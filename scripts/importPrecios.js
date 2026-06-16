// node scripts/importPrecios.js
// Lee "DATOS (2)" de "WEPP WEB.xlsx" y hace upsert en Supabase tabla "products"
// Solo actualiza pvp, pvp_iva, nombre_de, cantidad — nunca toca imagen, descripción ni manuales

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import XLSX from 'xlsx';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Leer .env manualmente (sin dotenv)
const envRaw = readFileSync(resolve(ROOT, '.env'), 'utf8');
const env = Object.fromEntries(
  envRaw.split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const SUPABASE_URL = env.VITE_SUPABASE_URL;
// Preferir service key (sin RLS) si está disponible, si no usar anon key
const SUPABASE_KEY = env.SUPABASE_SERVICE_KEY || env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const EXCEL_PATH = resolve(ROOT, 'WEPP WEB.xlsx');
const SHEET_NAME = 'DATOS (2)';

// Normaliza string para comparación flexible
const norm = (s) => String(s ?? '').toLowerCase().trim()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')   // quitar acentos
  .replace(/[^a-z0-9 ]/g, '').trim();

// Mapeo de nombres de columna normalizados → campo destino
const COLUMN_MAP = {
  'aleman':           'nombre_de',
  'espanol':          'nombre_es',
  'referencia':       'referencia',
  'cantidad':         'cantidad',
  'cantidad minima':  'cantidad',
  'pvp':              'pvp',
  'pvp sin iva':      'pvp',
  'pvp iva incluido': 'pvp_iva',   // "PVP (IVA INCLUIDO)" normalizado
  'pvp con iva':      'pvp_iva',
};

// Posiciones de columna de respaldo (por si los nombres no coinciden)
// Basadas en el Excel "WEPP WEB.xlsx" hoja "DATOS (2)"
const FALLBACK_COLS = {
  referencia: 5,
  nombre_de:  7,
  nombre_es:  8,
  cantidad:   10,
  pvp:        18,
  pvp_iva:    44,
};

function parseNumber(val) {
  if (val == null || val === '') return null;
  const n = parseFloat(String(val).replace(',', '.'));
  return isNaN(n) ? null : n;
}

async function main() {
  // 1. Leer Excel
  let workbook;
  try {
    workbook = XLSX.readFile(EXCEL_PATH);
  } catch {
    console.error(`❌ No se encontró: ${EXCEL_PATH}`);
    process.exit(1);
  }

  if (!workbook.SheetNames.includes(SHEET_NAME)) {
    console.error(`❌ Hoja "${SHEET_NAME}" no existe. Hojas: ${workbook.SheetNames.join(', ')}`);
    process.exit(1);
  }

  const sheet = workbook.Sheets[SHEET_NAME];
  // header:1 devuelve arrays. El Excel tiene:
  //   fila 0 → números de orden (1,2,3...)
  //   fila 1 → nombres reales de columna
  //   fila 2+ → datos
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  if (rows.length < 3) {
    console.error('❌ La hoja tiene menos de 3 filas (2 cabeceras + 1 dato mínimo)');
    process.exit(1);
  }

  // 2. Detectar columnas por nombre (fila 1 = índice 1)
  const headerRow = rows[1];
  const colIndex = { ...FALLBACK_COLS }; // empezar con fallback

  headerRow.forEach((h, i) => {
    const key = norm(h);
    if (key && COLUMN_MAP[key]) {
      const campo = COLUMN_MAP[key];
      // La primera ocurrencia de "referencia" gana (col 5 es la referencia principal)
      if (campo === 'referencia' && colIndex['referencia'] !== FALLBACK_COLS.referencia) return;
      colIndex[campo] = i;
    }
  });

  console.log('📋 Columnas detectadas:');
  Object.entries(colIndex).forEach(([k, v]) => console.log(`   ${k.padEnd(12)} → col[${v}] "${headerRow[v]}"`));

  // 3. Preparar datos (fila 2 en adelante = índice 2+)
  const dataRows = rows.slice(2);
  const toUpsert = [];

  for (const row of dataRows) {
    const referencia = String(row[colIndex['referencia']] ?? '').trim();
    if (!referencia) continue;

    const record = { id: referencia };
    if (colIndex['nombre_de'] != null) record.nombre_de = String(row[colIndex['nombre_de']] ?? '').trim() || null;
    if (colIndex['nombre_es'] != null) record.nombre_es = String(row[colIndex['nombre_es']] ?? '').trim() || null;
    if (colIndex['cantidad']  != null) record.cantidad   = parseNumber(row[colIndex['cantidad']]);
    if (colIndex['pvp']       != null) record.pvp        = parseNumber(row[colIndex['pvp']]);
    if (colIndex['pvp_iva']   != null) record.pvp_iva    = parseNumber(row[colIndex['pvp_iva']]);

    toUpsert.push(record);
  }

  if (toUpsert.length === 0) {
    console.warn('⚠️  No se encontraron filas con referencia válida');
    process.exit(0);
  }

  console.log(`\n📦 Filas a procesar: ${toUpsert.length}`);
  console.log('   Ejemplo:', JSON.stringify(toUpsert[0]));

  // 4. Obtener IDs existentes en Supabase
  const { data: existing, error: fetchErr } = await supabase
    .from('products')
    .select('id')
    .in('id', toUpsert.map(r => r.id));

  if (fetchErr) {
    const msg = fetchErr.message || '';
    const isNetwork = msg.includes('fetch failed') || msg.includes('ENOTFOUND') || msg.includes('NXDOMAIN');
    const is521     = msg.includes('521') || msg.includes('Web server is down') || msg.includes('Cloudflare');
    if (isNetwork || is521) {
      console.error('\n❌ SUPABASE NO RESPONDE — El proyecto está PAUSADO (Error 521 Cloudflare).');
      console.error('   URL:', SUPABASE_URL);
      console.error('\n   SOLUCIÓN:');
      console.error('   1. Ve a → https://supabase.com/dashboard/project/mdpmqndnbwohkddwbiff');
      console.error('   2. Si aparece "Your project is paused" → pulsa "Restore project"');
      console.error('   3. Espera ~2 minutos a que arranque');
      console.error('   4. Vuelve a ejecutar: node scripts/importPrecios.js');
      console.error('\n   Nota: El plan gratuito pausa proyectos tras ~7 días sin peticiones.');
      console.error('   Para evitarlo: upgrade a plan Pro, o haz una petición semanal al proyecto.\n');
    } else if (msg.includes('permission') || msg.includes('policy') || msg.includes('42501')) {
      console.error('❌ Error de permisos RLS:', msg);
      console.error('   Añade al .env: SUPABASE_SERVICE_KEY=<tu service_role key>');
      console.error('   La encuentras en: Supabase Dashboard → Settings → API → service_role key\n');
    } else if (msg.includes('does not exist') || msg.includes('42P01')) {
      console.error('❌ La tabla "products" no existe en Supabase.');
      console.error('   Créala en: Table Editor → New table → nombre: products');
      console.error('   Columnas mínimas: id (text PK), pvp (float4), pvp_iva (float4), nombre_de (text), nombre_es (text), cantidad (float4)\n');
    } else {
      console.error('❌ Error Supabase:', msg);
    }
    process.exit(1);
  }

  const existingIds   = new Set((existing || []).map(r => r.id));
  const actualizados  = toUpsert.filter(r =>  existingIds.has(r.id));
  const nuevos        = toUpsert.filter(r => !existingIds.has(r.id));

  // 5. Detectar columnas disponibles comprobando la estructura real de la tabla
  const { data: sampleRow } = await supabase.from('products').select('*').limit(1);
  const availableCols = sampleRow?.[0] ? new Set(Object.keys(sampleRow[0])) : new Set();

  const PRICE_FIELDS = ['pvp', 'pvp_iva', 'nombre_de', 'nombre_es', 'cantidad'];
  const presentFields  = PRICE_FIELDS.filter(f => availableCols.has(f));
  const missingFields  = PRICE_FIELDS.filter(f => !availableCols.has(f));

  if (missingFields.length > 0) {
    console.error('\n❌ FALTAN COLUMNAS en la tabla "products" de Supabase:');
    console.error(`   Columnas que no existen: ${missingFields.join(', ')}`);
    console.error('\n   Ejecuta este SQL en Supabase → SQL Editor:');
    console.error('   ─────────────────────────────────────────────────');
    if (missingFields.includes('pvp'))      console.error('   ALTER TABLE products ADD COLUMN IF NOT EXISTS pvp float4;');
    if (missingFields.includes('pvp_iva'))  console.error('   ALTER TABLE products ADD COLUMN IF NOT EXISTS pvp_iva float4;');
    if (missingFields.includes('nombre_de'))console.error('   ALTER TABLE products ADD COLUMN IF NOT EXISTS nombre_de text;');
    if (missingFields.includes('nombre_es'))console.error('   ALTER TABLE products ADD COLUMN IF NOT EXISTS nombre_es text;');
    if (missingFields.includes('cantidad')) console.error('   ALTER TABLE products ADD COLUMN IF NOT EXISTS cantidad float4;');
    console.error('   ─────────────────────────────────────────────────');
    console.error('\n   Tras ejecutar el SQL vuelve a correr: node scripts/importPrecios.js\n');
    process.exit(1);
  }

  console.log(`✅ Columnas listas en Supabase: ${presentFields.join(', ')}\n`);

  // Solo actualizamos productos que YA EXISTEN — no insertamos nuevos (les faltarían name, image, etc.)
  const soloExistentes = toUpsert.filter(r => existingIds.has(r.id));
  const omitidos       = toUpsert.filter(r => !existingIds.has(r.id));

  if (omitidos.length > 0) {
    console.warn(`⚠️  ${omitidos.length} referencias del Excel no existen en Supabase → se omiten (no se insertan productos incompletos).`);
    console.warn('   Si quieres añadirlos, crea el producto completo primero desde el panel.\n');
  }

  // 6. UPDATE directo de precios (nunca INSERT — evita NOT NULL constraints)
  let errCount = 0;
  let okCount  = 0;

  for (const r of soloExistentes) {
    const fields = {};
    for (const f of presentFields) if (r[f] !== undefined) fields[f] = r[f];

    const { error } = await supabase
      .from('products')
      .update(fields)
      .eq('id', r.id);

    if (error) {
      console.error(`❌ Error actualizando ${r.id}:`, error.message);
      errCount++;
    } else {
      okCount++;
    }
  }

  // 7. Resumen final
  console.log('\n════════════════════════════════════════');
  console.log(`✅ Precios actualizados:  ${okCount} productos`);
  console.log(`⏭  Omitidos (no existen): ${omitidos.length} referencias del Excel`);
  if (errCount) console.error(`❌ Batches con error:     ${errCount}`);
  console.log('════════════════════════════════════════\n');

  if (okCount > 0) {
    console.log('Productos actualizados con precio:');
    soloExistentes.slice(0, 10).forEach(r =>
      console.log(`  ✓ ${r.id.padEnd(15)} pvp=${r.pvp} €  pvp_iva=${r.pvp_iva} €`)
    );
    if (soloExistentes.length > 10) console.log(`  ... y ${soloExistentes.length - 10} más`);
  }
}

main().catch(err => {
  console.error('❌ Error inesperado:', err.message);
  process.exit(1);
});
