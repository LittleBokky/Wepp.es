// node scripts/updateImages.js
// Actualiza el campo image en Supabase con las URLs definitivas de wepp.de.
// No descarga nada a Storage — usa las URLs directamente.

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
const sb = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_SERVICE_KEY || env.VITE_SUPABASE_ANON_KEY);

// Mapa completo: id en Supabase → URL definitiva de wepp.de
// Nota: la URL de "2025" mapea al producto "2025-A" (renombrado previamente)
const IMAGE_MAP = {
  '1136':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/1136_1_640px.jpg',
  '1996-45':  'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/1996-45_640px.jpg',
  '2001':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2001_640px.jpg',
  '2006':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2006_640px.jpg',
  '2010':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2010_7.jpg',
  '2011':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2011_640px.jpg',
  '2012':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2012_640px.jpg',
  '2013':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2013_640px.jpg',
  '2014':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2014_640px.jpg',
  '2015':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2015_640px.jpg',
  '2016':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2016_640px.jpg',
  '2017':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2017_640px.jpg',
  '2020':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2020_640px.jpg',
  '2021':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2021_640px.jpg',
  '2023':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2023_640px.jpg',
  '2024-1000':'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2024-1000_640px.jpg',
  '2025-A':   'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2025_640px.jpg',
  '2026':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2026_640px.jpg',
  '2028':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2028_640px_1.jpg',
  '2031':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2031_640px.jpg',
  '2032':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2032_1.jpg',
  '2032-300': 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2032-300_640px.jpg',
  '2033':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2033_640px.jpg',
  '2034':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2034_640px_1.jpg',
  '2034-300': 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2034-300_640px.jpg',
  '2036':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2036_640px.jpg',
  '2036-300': 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2036-300_640px.jpg',
  '2038':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2038_640px.jpg',
  '2039-150': 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2039-150_640px_1.jpg',
  '2040':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2040_640px.jpg',
  '2041':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2041_640px.jpg',
  '2042':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2042_640px.jpg',
  '2043':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2043_640px.jpg',
  '2045':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2045_640px.jpg',
  '2047':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2047_640px.jpg',
  '2048':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2048_640px_1.jpg',
  '2054':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2054_640px.jpg',
  '2055':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2055_640px.jpg',
  '2056':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2056_640px.jpg',
  '2057':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2057_640px.jpg',
  '2059':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2059_640px.jpg',
  '2060':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2060_640px.jpg',
  '2061':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2061_640px.jpg',
  '2070':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2070_640px.jpg',
  '2071':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2071_640px.jpg',
  '2083':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2083_640px.jpg',
  '2086':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2086.jpg',
  '2090':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2090_640px.jpg',
  '2091':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2091_640px.jpg',
  '2092':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2092_640px.jpg',
  '2094':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2094_640px.jpg',
  '2095':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2095_640px.jpg',
  '2096':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2096_640px.jpg',
  '2110':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2110_441db78dcaf6ce7a87b1d5ee9ca42b11.jpg',
  '2111':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2111_441db78dcaf6ce7a87b1d5ee9ca42b11.jpg',
  '2117':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2117_640px.jpg',
  '2127':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2127_640px.jpg',
  '21290':    'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/21290_640px.jpg',
  '2130':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2130_640px.jpg',
  '2132':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2132_1.jpg',
  '2132-150': 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2132-150_640px.jpg',
  '21400':    'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/21400_640px.jpg',
  '2199':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2199.jpg',
  '2232':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2232_1.jpg',
  '2246':     'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2246_1.jpg',
  '255':      'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/255_640px.jpg',
  '281000':   'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/281000_1_640px.jpg',
  '39000':    'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/39000.jpg',
  '39001':    'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/39001.jpg',
  '7020100':  'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/7020100_640px.jpg',
  '7021100':  'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/7021100_640px.jpg',
  '7030001':  'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/7030001_640px.jpg',
  '7031001':  'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/7031001_640px.jpg',
  '7041236':  'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/7041236.jpg',
  '7050001':  'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/7050001.jpg',
  '7050250':  'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/7050250.jpg',
  '82111':    'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/82111.jpg',
};

async function main() {
  const entries = Object.entries(IMAGE_MAP);
  console.log(`🔗 ${entries.length} productos a actualizar\n`);

  // Obtener IDs existentes en Supabase para detectar referencias que no existen
  const { data: existing } = await sb.from('products').select('id');
  const sbIds = new Set(existing.map(p => p.id));

  let ok = 0, skipped = 0, errors = 0;
  const noEncontrados = [];

  for (const [id, url] of entries) {
    if (!sbIds.has(id)) {
      noEncontrados.push(id);
      skipped++;
      continue;
    }

    const { error } = await sb.from('products').update({ image: url }).eq('id', id);
    if (error) {
      console.error(`❌ ${id}: ${error.message}`);
      errors++;
    } else {
      console.log(`✅ ${id.padEnd(12)} → ${url.split('/').pop()}`);
      ok++;
    }
  }

  console.log('\n════════════════════════════════════════');
  console.log(`✅ Actualizados:              ${ok}`);
  console.log(`⏭  No existen en Supabase:   ${skipped}`);
  if (errors) console.error(`❌ Errores:                  ${errors}`);
  console.log('════════════════════════════════════════');

  if (noEncontrados.length) {
    console.log('\nReferencias del mapa no encontradas en Supabase:');
    noEncontrados.forEach(id => console.log(`  - ${id}`));
  }
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
