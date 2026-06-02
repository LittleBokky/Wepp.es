// node scripts/subirImagenes.js
// FASE 2: Sube imágenes a Supabase Storage y crea los productos faltantes.
// Requiere haber ejecutado antes: node scripts/extraerImagenes.js
// Requiere VITE_SUPABASE_SERVICE_KEY en el .env

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import XLSX from 'xlsx';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = resolve(__dirname, '..');
const IMG_DIR   = '/tmp/wepp_imgs';
const JSON_PATH = resolve(__dirname, 'matching_preview.json');

// ── Leer .env ───────────────────────────────────────────────────────────────
const envRaw = readFileSync(resolve(ROOT, '.env'), 'utf8');
const env = Object.fromEntries(
  envRaw.split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.VITE_SUPABASE_SERVICE_KEY || env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Faltan credenciales en .env');
  process.exit(1);
}
if (!env.VITE_SUPABASE_SERVICE_KEY) {
  console.warn('⚠️  Usando anon key — si falla por RLS, añade VITE_SUPABASE_SERVICE_KEY al .env');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Mapeo categorías Excel → Supabase ───────────────────────────────────────
const CAT_MAP = {
  'Motor y Transmisión':    'Motor y Transmisión',
  'Refrigeración':          'Refrigeración',
  'Climatización':          'Aire Acondicionado',
  'Sistema de Combustión':  'Combustible',
  'Frenos':                 'Frenos',
  'Mantenimiento y Cuidado':'Mantenimiento y Cuidado',
  'Carrocería':             'Carrocería',
};

// URL de fallback en wepp.de (para productos sin imagen en el PDF)
const WEPP_BASE = 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O';
const weppFallback = (ref) => `${WEPP_BASE}/${ref}_640px.jpg`;

// Sanitizar referencia para nombre de archivo en Storage
const sanitizeRef = (ref) => ref.replace(/[^a-zA-Z0-9\-]/g, '_');

async function main() {
  // ── 1. Verificar JSON de matching ────────────────────────────────────────
  if (!existsSync(JSON_PATH)) {
    console.error(`❌ No encontrado: ${JSON_PATH}`);
    console.error('   Ejecuta primero: node scripts/extraerImagenes.js');
    process.exit(1);
  }
  const matching = JSON.parse(readFileSync(JSON_PATH, 'utf8'));
  console.log(`📋 Entradas en matching_preview.json: ${matching.length}`);

  // ── 2. Leer Excel para datos completos ───────────────────────────────────
  const wb = XLSX.readFile(resolve(ROOT, 'WEPP WEB.xlsx'));
  const sheet = wb.Sheets['DATOS (2)'];
  const rows  = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  const excelMap = {};
  for (const row of rows.slice(2)) {
    const ref = String(row[9] ?? '').trim();
    if (!ref) continue;
    excelMap[ref] = {
      ref,
      nombre_es: String(row[8]  ?? '').trim(),
      nombre_de: String(row[7]  ?? '').trim(),
      categoria: String(row[3]  ?? '').trim(),
      volumen:   Number(row[6])  || null,
      pvp:       parseFloat(String(row[18]).replace(',', '.')) || null,
      pvp_iva:   parseFloat(String(row[44]).replace(',', '.')) || null,
      cantidad:  parseFloat(String(row[26]).replace(',', '.')) || null,
    };
  }

  // ── 3. Obtener IDs ya existentes en Supabase ────────────────────────────
  const { data: existing } = await supabase.from('products').select('id');
  const existingIds = new Set((existing || []).map(r => r.id));
  console.log(`📊 Productos ya en Supabase: ${existingIds.size}`);

  // ── 4. Crear bucket "productos" si no existe ────────────────────────────
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = (buckets || []).some(b => b.name === 'productos');

  if (!bucketExists) {
    const { error: bucketErr } = await supabase.storage.createBucket('productos', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      fileSizeLimit: 5 * 1024 * 1024,
    });
    if (bucketErr) {
      console.error('❌ Error creando bucket:', bucketErr.message);
      console.error('   Créalo manualmente en Supabase → Storage → New bucket → "productos" (public)');
      process.exit(1);
    }
    console.log('✅ Bucket "productos" creado');
  } else {
    console.log('✅ Bucket "productos" ya existe');
  }

  // ── 5. Subir imágenes y construir mapa ref → URL ─────────────────────────
  const imageUrlMap = {}; // ref → URL pública
  let subidas = 0, fallbacks = 0, erroresImg = 0;

  console.log('\n🔄 Subiendo imágenes...');

  for (const entry of matching) {
    const { ref, images, confidence } = entry;
    const safeName = sanitizeRef(ref) + '.jpg';

    // Verificar si ya existe en Storage (para no re-subir)
    const { data: existingFile } = await supabase.storage
      .from('productos')
      .list('', { search: safeName });

    const alreadyUploaded = (existingFile || []).some(f => f.name === safeName);
    if (alreadyUploaded) {
      const { data: urlData } = supabase.storage.from('productos').getPublicUrl(safeName);
      imageUrlMap[ref] = urlData.publicUrl;
      continue;
    }

    // Solo subir imágenes de alta o media confianza (baja = posible asignación errónea)
    const useExtracted = entry.confidence === 'high' || entry.confidence === 'medium';

    // Intentar subir imagen del PDF
    if (useExtracted && images && images.length > 0) {
      const imgPath = `${IMG_DIR}/${images[0]}`;
      if (existsSync(imgPath)) {
        const fileBuffer = readFileSync(imgPath);
        const { error: upErr } = await supabase.storage
          .from('productos')
          .upload(safeName, fileBuffer, {
            contentType: 'image/jpeg',
            upsert: true,
          });

        if (!upErr) {
          const { data: urlData } = supabase.storage.from('productos').getPublicUrl(safeName);
          imageUrlMap[ref] = urlData.publicUrl;
          subidas++;
          continue;
        } else {
          console.warn(`⚠️  Error subiendo ${ref}: ${upErr.message} → usando fallback wepp.de`);
          erroresImg++;
        }
      }
    }

    // Fallback: URL de wepp.de
    imageUrlMap[ref] = weppFallback(ref);
    fallbacks++;
  }

  console.log(`   ✅ Subidas a Storage: ${subidas}`);
  console.log(`   🔗 Fallback wepp.de:   ${fallbacks}`);
  if (erroresImg) console.warn(`   ⚠️  Errores de upload:  ${erroresImg}`);

  // ── 6. Insertar productos nuevos ─────────────────────────────────────────
  console.log('\n📥 Insertando productos nuevos en Supabase...');

  const toInsert = [];

  for (const entry of matching) {
    const { ref } = entry;
    if (existingIds.has(ref)) continue; // ya existe, saltar

    const p = excelMap[ref];
    if (!p) continue;

    const name     = p.nombre_es || p.nombre_de || ref;
    const category = CAT_MAP[p.categoria] || 'Mantenimiento y Cuidado';
    const desc     = p.volumen
      ? `${name} — ${p.volumen}ml`
      : name;
    const imageUrl = imageUrlMap[ref] || weppFallback(ref);

    toInsert.push({
      id:          ref,
      name,
      category,
      description: desc,
      price:       p.pvp || 0,
      image:       imageUrl,
      features:    [],
      pvp:         p.pvp,
      pvp_iva:     p.pvp_iva,
      nombre_de:   p.nombre_de || null,
      nombre_es:   p.nombre_es || null,
      cantidad:    p.cantidad  || null,
    });
  }

  console.log(`   Productos a insertar: ${toInsert.length}`);

  // Insertar en batches de 25
  const BATCH = 25;
  let insertados = 0, erroresInsert = 0;

  for (let i = 0; i < toInsert.length; i += BATCH) {
    const batch = toInsert.slice(i, i + BATCH);
    const { error } = await supabase.from('products').upsert(batch, { onConflict: 'id', ignoreDuplicates: true });
    if (error) {
      console.error(`❌ Error batch insert ${Math.floor(i/BATCH)+1}:`, error.message);
      erroresInsert++;
    } else {
      insertados += batch.length;
    }
  }

  // ── 7. Resumen final ──────────────────────────────────────────────────────
  console.log('\n════════════════════════════════════════');
  console.log(`🖼  Imágenes subidas a Storage:  ${subidas}`);
  console.log(`🔗 Con URL fallback wepp.de:     ${fallbacks}`);
  console.log(`✅ Productos insertados:          ${insertados}`);
  if (erroresInsert) console.error(`❌ Batches con error:             ${erroresInsert}`);
  console.log('════════════════════════════════════════\n');
  console.log('Recarga el panel para ver los productos con sus imágenes.');
}

main().catch(err => {
  console.error('❌ Error inesperado:', err.message);
  process.exit(1);
});
