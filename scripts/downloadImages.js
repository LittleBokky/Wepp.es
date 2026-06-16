// node scripts/downloadImages.js
// Descarga imágenes desde wepp.de → sube al bucket "productos" de Supabase → actualiza campo image

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const env = Object.fromEntries(
  readFileSync(resolve(ROOT, '.env'), 'utf8').split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_KEY || env.VITE_SUPABASE_ANON_KEY;
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

const BASE = 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O';

// Lista completa URL → ID de Supabase
// Nota: "2025" en wepp.de → ID "2025-A" en Supabase (renombrado)
const IMAGES = [
  { url: `${BASE}/1136_1_640px.jpg`,                           id: '1136' },
  { url: `${BASE}/1996-45_640px.jpg`,                          id: '1996-45' },
  { url: `${BASE}/2001_640px.jpg`,                             id: '2001' },
  { url: `${BASE}/2006_640px.jpg`,                             id: '2006' },
  { url: `${BASE}/2010_7.jpg`,                                 id: '2010' },
  { url: `${BASE}/2011_640px.jpg`,                             id: '2011' },
  { url: `${BASE}/2012_640px.jpg`,                             id: '2012' },
  { url: `${BASE}/2013_640px.jpg`,                             id: '2013' },
  { url: `${BASE}/2014_640px.jpg`,                             id: '2014' },
  { url: `${BASE}/2015_640px.jpg`,                             id: '2015' },
  { url: `${BASE}/2016_640px.jpg`,                             id: '2016' },
  { url: `${BASE}/2017_640px.jpg`,                             id: '2017' },
  { url: `${BASE}/2020_640px.jpg`,                             id: '2020' },
  { url: `${BASE}/2021_640px.jpg`,                             id: '2021' },
  { url: `${BASE}/2023_640px.jpg`,                             id: '2023' },
  { url: `${BASE}/2024-1000_640px.jpg`,                        id: '2024-1000' },
  { url: `${BASE}/2025_640px.jpg`,                             id: '2025-A' },   // renombrado
  { url: `${BASE}/2026_640px.jpg`,                             id: '2026' },
  { url: `${BASE}/2028_640px_1.jpg`,                           id: '2028' },
  { url: `${BASE}/2031_640px.jpg`,                             id: '2031' },
  { url: `${BASE}/2032_1.jpg`,                                 id: '2032' },
  { url: `${BASE}/2032-300_640px.jpg`,                         id: '2032-300' },
  { url: `${BASE}/2033_640px.jpg`,                             id: '2033' },
  { url: `${BASE}/2034_640px_1.jpg`,                           id: '2034' },
  { url: `${BASE}/2034-300_640px.jpg`,                         id: '2034-300' },
  { url: `${BASE}/2036_640px.jpg`,                             id: '2036' },
  { url: `${BASE}/2036-300_640px.jpg`,                         id: '2036-300' },
  { url: `${BASE}/2038_640px.jpg`,                             id: '2038' },
  { url: `${BASE}/2039-150_640px_1.jpg`,                       id: '2039-150' },
  { url: `${BASE}/2040_640px.jpg`,                             id: '2040' },
  { url: `${BASE}/2041_640px.jpg`,                             id: '2041' },
  { url: `${BASE}/2042_640px.jpg`,                             id: '2042' },
  { url: `${BASE}/2043_640px.jpg`,                             id: '2043' },
  { url: `${BASE}/2045_640px.jpg`,                             id: '2045' },
  { url: `${BASE}/2047_640px.jpg`,                             id: '2047' },
  { url: `${BASE}/2048_640px_1.jpg`,                           id: '2048' },
  { url: `${BASE}/2153_640px.jpg`,                             id: '2153' },
  { url: `${BASE}/2054_640px.jpg`,                             id: '2054' },
  { url: `${BASE}/2055_640px.jpg`,                             id: '2055' },
  { url: `${BASE}/2056_640px.jpg`,                             id: '2056' },
  { url: `${BASE}/2057_640px.jpg`,                             id: '2057' },
  { url: `${BASE}/2059_640px.jpg`,                             id: '2059' },
  { url: `${BASE}/2060_640px.jpg`,                             id: '2060' },
  { url: `${BASE}/2061_640px.jpg`,                             id: '2061' },
  { url: `${BASE}/2070_640px.jpg`,                             id: '2070' },
  { url: `${BASE}/2071_640px.jpg`,                             id: '2071' },
  { url: `${BASE}/2082_640px.jpg`,                             id: '2082' },
  { url: `${BASE}/2083_640px.jpg`,                             id: '2083' },
  { url: `${BASE}/2086.jpg`,                                   id: '2086' },
  { url: `${BASE}/2090_640px.jpg`,                             id: '2090' },
  { url: `${BASE}/2091_640px.jpg`,                             id: '2091' },
  { url: `${BASE}/2092_640px.jpg`,                             id: '2092' },
  { url: `${BASE}/2094_640px.jpg`,                             id: '2094' },
  { url: `${BASE}/2095_640px.jpg`,                             id: '2095' },
  { url: `${BASE}/2096_640px.jpg`,                             id: '2096' },
  { url: `${BASE}/2110_441db78dcaf6ce7a87b1d5ee9ca42b11.jpg`, id: '2110' },
  { url: `${BASE}/2111_441db78dcaf6ce7a87b1d5ee9ca42b11.jpg`, id: '2111' },
  { url: `${BASE}/2117_640px.jpg`,                             id: '2117' },
  { url: `${BASE}/2127_640px.jpg`,                             id: '2127' },
  { url: `${BASE}/21290_640px.jpg`,                            id: '21290' },
  { url: `${BASE}/2130_640px.jpg`,                             id: '2130' },
  { url: `${BASE}/2132_1.jpg`,                                 id: '2132' },
  { url: `${BASE}/2132-150_640px.jpg`,                         id: '2132-150' },
  { url: `${BASE}/21400_640px.jpg`,                            id: '21400' },
  { url: `${BASE}/2199.jpg`,                                   id: '2199' },
  { url: `${BASE}/2232_1.jpg`,                                 id: '2232' },
  { url: `${BASE}/2246_1.jpg`,                                 id: '2246' },
  { url: `${BASE}/255_640px.jpg`,                              id: '255' },
  { url: `${BASE}/281000_1_640px.jpg`,                         id: '281000' },
  { url: `${BASE}/39000.jpg`,                                  id: '39000' },
  { url: `${BASE}/39001.jpg`,                                  id: '39001' },
  { url: `${BASE}/7020060.jpg`,                                id: '7020060' },
  { url: `${BASE}/7020100_640px.jpg`,                          id: '7020100' },
  { url: `${BASE}/7021100_640px.jpg`,                          id: '7021100' },
  { url: `${BASE}/7030001_640px.jpg`,                          id: '7030001' },
  { url: `${BASE}/7031001_640px.jpg`,                          id: '7031001' },
  { url: `${BASE}/7041236.jpg`,                                id: '7041236' },
  { url: `${BASE}/7050001.jpg`,                                id: '7050001' },
  { url: `${BASE}/7050250.jpg`,                                id: '7050250' },
  { url: `${BASE}/82111.jpg`,                                  id: '82111' },
];

async function downloadBuffer(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  console.log(`🔗 ${IMAGES.length} imágenes a procesar\n`);

  // IDs existentes en Supabase para detectar los que no coinciden
  const { data: sbProds } = await sb.from('products').select('id');
  const sbIds = new Set(sbProds.map(p => p.id));

  let ok = 0, fallidos = 0, sinProducto = 0;
  const errores = [];

  for (const { url, id } of IMAGES) {
    const filename = `${id}.jpg`;

    // Descargar
    let buf;
    try {
      buf = await downloadBuffer(url);
    } catch (e) {
      console.error(`❌ Descarga fallida [${id}]: ${e.message}`);
      errores.push({ id, motivo: `descarga: ${e.message}` });
      fallidos++;
      continue;
    }

    // Subir a Storage (upsert — sobreescribe si ya existe)
    const { error: upErr } = await sb.storage
      .from('productos')
      .upload(filename, buf, { contentType: 'image/jpeg', upsert: true });

    if (upErr) {
      console.error(`❌ Storage fallido [${id}]: ${upErr.message}`);
      errores.push({ id, motivo: `storage: ${upErr.message}` });
      fallidos++;
      continue;
    }

    // URL pública
    const { data: urlData } = sb.storage.from('productos').getPublicUrl(filename);
    const publicUrl = urlData.publicUrl;

    // Actualizar campo image en products (solo si el producto existe)
    if (sbIds.has(id)) {
      const { error: dbErr } = await sb.from('products').update({ image: publicUrl }).eq('id', id);
      if (dbErr) {
        console.warn(`⚠️  Imagen subida pero DB falló [${id}]: ${dbErr.message}`);
        errores.push({ id, motivo: `db: ${dbErr.message}` });
      } else {
        console.log(`✅ ${id.padEnd(12)} → ${filename}`);
        ok++;
      }
    } else {
      console.log(`📦 ${id.padEnd(12)} → ${filename} (imagen subida, producto no está en Supabase)`);
      sinProducto++;
      ok++;
    }
  }

  console.log('\n════════════════════════════════════════');
  console.log(`✅ Imágenes subidas y actualizadas: ${ok}`);
  console.log(`📦 Sin producto en Supabase:        ${sinProducto}`);
  console.log(`❌ Fallidas:                        ${fallidos}`);
  console.log('════════════════════════════════════════');

  if (errores.length > 0) {
    console.log('\nDetalle de errores:');
    errores.forEach(e => console.log(`  [${e.id}] ${e.motivo}`));
  }
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
