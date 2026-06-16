// node scripts/uploadLocalImages.js
// Sube las imágenes locales de /public/Imagenes Productos/ a Supabase Storage
// y actualiza el campo image en la tabla products.
// Las imágenes locales tienen prioridad sobre URLs de wepp.de.

import { readFileSync, readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve, extname, basename } from 'path';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = resolve(__dirname, '..');
const IMG_FOLDER = resolve(ROOT, 'public', 'Imagenes Productos');

const env = Object.fromEntries(
  readFileSync(resolve(ROOT, '.env'), 'utf8').split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);
const sb = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_KEY || env.VITE_SUPABASE_ANON_KEY);

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };

async function main() {
  // 1. Leer archivos locales
  const files = readdirSync(IMG_FOLDER)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .map(f => ({
      filename: f,
      ext:      extname(f).toLowerCase(),
      productId: basename(f, extname(f)),   // nombre sin extensión = ID del producto
      path:     resolve(IMG_FOLDER, f),
    }));

  console.log(`📁 Imágenes locales encontradas: ${files.length}`);
  files.forEach(f => console.log(`   ${f.filename} → ID: "${f.productId}"`));

  // 2. IDs existentes en Supabase
  const { data: existing } = await sb.from('products').select('id');
  const sbIds = new Set((existing || []).map(p => p.id));

  let subidas = 0, actualizadas = 0, sinProducto = 0, errores = 0;
  const errList = [];

  console.log('\n🔄 Procesando...\n');

  for (const file of files) {
    const buf      = readFileSync(file.path);
    const mime     = MIME[file.ext] || 'image/jpeg';
    // Nombre en Storage: siempre .jpg/.png según el original, usando el ID como nombre
    const storageName = file.productId + file.ext;

    // Subir a Storage (upsert — sobreescribe si ya existe)
    const { error: upErr } = await sb.storage
      .from('productos')
      .upload(storageName, buf, { contentType: mime, upsert: true });

    if (upErr) {
      console.error(`❌ Upload fallido [${file.productId}]: ${upErr.message}`);
      errList.push({ id: file.productId, motivo: upErr.message });
      errores++;
      continue;
    }
    subidas++;

    // URL pública
    const { data: urlData } = sb.storage.from('productos').getPublicUrl(storageName);
    const publicUrl = urlData.publicUrl;

    // Actualizar campo image si el producto existe en Supabase
    if (sbIds.has(file.productId)) {
      const { error: dbErr } = await sb.from('products')
        .update({ image: publicUrl })
        .eq('id', file.productId);

      if (dbErr) {
        console.warn(`⚠️  Subida OK pero DB falló [${file.productId}]: ${dbErr.message}`);
        errList.push({ id: file.productId, motivo: `db: ${dbErr.message}` });
        errores++;
      } else {
        console.log(`✅ ${file.productId.padEnd(12)} → Storage + DB actualizada`);
        actualizadas++;
      }
    } else {
      console.log(`📦 ${file.productId.padEnd(12)} → Subida a Storage (producto no existe en Supabase)`);
      sinProducto++;
    }
  }

  // 3. Resumen
  console.log('\n════════════════════════════════════════');
  console.log(`✅ Imágenes subidas a Storage:      ${subidas}`);
  console.log(`✅ Productos actualizados en DB:    ${actualizadas}`);
  console.log(`📦 Sin producto en Supabase:        ${sinProducto}`);
  if (errores) console.error(`❌ Errores:                         ${errores}`);
  console.log('════════════════════════════════════════');

  if (errList.length) {
    console.log('\nDetalle errores:');
    errList.forEach(e => console.log(`  [${e.id}] ${e.motivo}`));
  }
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
