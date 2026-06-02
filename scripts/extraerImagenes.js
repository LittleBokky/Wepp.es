// node scripts/extraerImagenes.js
// FASE 1: Extrae imágenes del PDF y las correlaciona con referencias del Excel.
// Genera scripts/matching_preview.json para revisión antes de subir a Supabase.
// Requiere: brew install poppler

import { execFileSync, spawnSync } from 'child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import XLSX from 'xlsx';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = resolve(__dirname, '..');
const PDF_PATH  = resolve(ROOT, 'Manuales wepp', 'Catalogo .pdf');
const IMG_DIR   = '/tmp/wepp_imgs';
const TEXT_FILE = '/tmp/wepp_text.txt';
const OUT_JSON  = resolve(__dirname, 'matching_preview.json');

// ── 1. Verificar herramientas ──────────────────────────────────────────────
function checkTool(name) {
  const r = spawnSync('which', [name]);
  if (r.status !== 0) {
    console.error(`❌ "${name}" no encontrado. Instala con: brew install poppler`);
    process.exit(1);
  }
}
checkTool('pdfimages');
checkTool('pdftotext');

if (!existsSync(PDF_PATH)) {
  console.error(`❌ PDF no encontrado: ${PDF_PATH}`);
  process.exit(1);
}

// ── 2. Leer referencias del Excel ──────────────────────────────────────────
const wb    = XLSX.readFile(resolve(ROOT, 'WEPP WEB.xlsx'));
const sheet = wb.Sheets['DATOS (2)'];
const rows  = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

const productos = rows.slice(2)
  .map(r => ({
    ref:      String(r[9] ?? '').trim(),
    nombre_es:String(r[8] ?? '').trim(),
    categoria:String(r[3] ?? '').trim(),
    pvp:      parseFloat(String(r[18]).replace(',','.')) || null,
    pvp_iva:  parseFloat(String(r[44]).replace(',','.')) || null,
  }))
  .filter(p => p.ref);

console.log(`📦 Referencias en Excel: ${productos.length}`);

// ── 3. Extraer imágenes del PDF con pdfimages ──────────────────────────────
mkdirSync(IMG_DIR, { recursive: true });

// Obtener lista de imágenes con dimensiones (para filtrar thumbnails)
console.log('🔍 Analizando imágenes del PDF...');
const listResult = spawnSync('pdfimages', ['-list', PDF_PATH], {
  stdio: ['ignore','pipe','pipe'], maxBuffer: 50*1024*1024
});
if (listResult.status !== 0) {
  console.error('❌ Error en pdfimages -list:', listResult.stderr.toString().slice(0,200));
  process.exit(1);
}

// Parsear el listado: "page num type width height color comp bpc enc interp object ID x-ppi y-ppi size ratio"
const listLines = listResult.stdout.toString().split('\n').slice(2).filter(Boolean);
const allImgMeta = listLines.map(line => {
  const parts = line.trim().split(/\s+/);
  return {
    page:   parseInt(parts[0], 10),
    num:    parseInt(parts[1], 10),
    type:   parts[2],
    width:  parseInt(parts[3], 10),
    height: parseInt(parts[4], 10),
    enc:    parts[8],
  };
}).filter(m => !isNaN(m.page));

// Extraer las imágenes al disco (si no existen ya)
const existingFiles = existsSync(IMG_DIR) ? readdirSync(IMG_DIR) : [];
if (existingFiles.length < 10) {
  console.log('   Extrayendo imágenes al disco...');
  const extractResult = spawnSync('pdfimages', ['-j', '-p', PDF_PATH, `${IMG_DIR}/img`], {
    stdio: ['ignore','pipe','pipe'], maxBuffer: 200*1024*1024
  });
  if (extractResult.status !== 0) {
    console.error('❌ Error extrayendo:', extractResult.stderr.toString().slice(0,200));
    process.exit(1);
  }
}

const allExtracted = readdirSync(IMG_DIR).sort();
console.log(`🖼  Total archivos extraídos: ${allExtracted.length}`);

// Mapa: num_global → nombre de archivo en disco
// pdfimages numera las imágenes globalmente; el nombre del archivo usa ese número
// Formato: img-PPP-NNN.ext donde NNN es el número global (0-indexed por página en -list)
// Construir mapa: {num_global} → filename
const numToFile = {};
for (const f of allExtracted) {
  const m = f.match(/img-(\d+)-(\d+)\.(jpg|jpeg|png|ppm|pbm)$/i);
  if (m) {
    const globalNum = parseInt(m[2], 10);
    numToFile[globalNum] = f;
  }
}

// Filtrar imágenes de tamaño "botella de producto" (no thumbnails, no páginas completas)
// Tamaño válido: ancho 150-700, alto 400-1500
const bottleImages = allImgMeta.filter(m =>
  m.width >= 150 && m.width <= 700 &&
  m.height >= 400 && m.height <= 1500 &&
  (m.enc === 'jpeg' || m.enc === 'jpg')  // solo JPEGs (no PBM/PPM que son máscaras)
);

console.log(`🍾 Imágenes de producto (botella): ${bottleImages.length}`);

// Agrupar imágenes botella por página, en orden de aparición
const bottleByPage = {};
for (const img of bottleImages) {
  if (!bottleByPage[img.page]) bottleByPage[img.page] = [];
  bottleByPage[img.page].push(numToFile[img.num] || null);
}
// Eliminar nulls
for (const pg of Object.keys(bottleByPage)) {
  bottleByPage[pg] = bottleByPage[pg].filter(Boolean);
  if (bottleByPage[pg].length === 0) delete bottleByPage[pg];
}

const pagesWithImages = Object.keys(bottleByPage).map(Number).sort((a,b)=>a-b);
console.log(`📄 Páginas con imágenes de botella: ${pagesWithImages.length} (${pagesWithImages.slice(0,8).join(',')}...)`);

// ── 4. Extraer texto del PDF ───────────────────────────────────────────────
console.log('📄 Extrayendo texto del PDF...');
const txtResult = spawnSync('pdftotext', ['-layout', PDF_PATH, TEXT_FILE], {
  stdio: ['ignore','pipe','pipe']
});
if (txtResult.status !== 0) {
  console.error('❌ Error en pdftotext:', txtResult.stderr.toString().slice(0,200));
  process.exit(1);
}

// Leer el texto como buffer para manejar bien el encoding
const rawText  = readFileSync(TEXT_FILE, 'utf8');

// Normalizar: reemplazar en-dash (U+2013) y em-dash (U+2014) con guión ASCII
const normText = rawText.replace(/[–—]/g, '-');

// Dividir por páginas (form feed = \f = \x0c)
const pages = normText.split('\f');
console.log(`📄 Páginas de texto extraídas: ${pages.length}`);

// ── 5. Construir patrones de búsqueda para cada referencia ────────────────
// Normalizar una referencia para usarla en regex (ej: "2010 SF" → "2010[-\\s]?SF")
function refToPattern(ref) {
  // Escapar caracteres especiales de regex (excepto los que reemplazaremos)
  const parts = ref
    .replace(/[\-\s]+/g, '§') // agrupar separadores
    .split('§');

  const escaped = parts.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  // Entre partes, aceptar guión, espacio, en-dash o em-dash (ahora normalizados a -)
  return escaped.join('[\\-\\s]?');
}

// ── 6. Correlacionar: para cada página con imágenes, buscar referencias ───
const pageRefMap = {}; // page → [refs in left-to-right order]

for (const pg of pagesWithImages) {
  const pageIdx   = pg - 1; // pdftotext pages son 0-indexed en el array
  const pageText  = pages[pageIdx] || '';

  // Buscar qué referencias del Excel aparecen en esta página
  const refsOnPage = [];
  for (const p of productos) {
    const pattern = refToPattern(p.ref);
    // El ref debe aparecer como número aislado (no parte de otro número)
    const regex = new RegExp(`(?<![A-Za-z0-9])${pattern}(?![A-Za-z0-9])`, 'i');
    if (regex.test(pageText)) {
      // Encontrar la posición horizontal (columna) del match para ordenar izq→der
      const match = pageText.match(regex);
      const pos   = match ? pageText.indexOf(match[0]) : 0;
      // Determinar la "columna" aproximada buscando la línea que contiene el match
      const lineStart = pageText.lastIndexOf('\n', pos) + 1;
      const colPos    = pos - lineStart;
      refsOnPage.push({ ref: p.ref, colPos });
    }
  }

  // Ordenar por posición horizontal (izquierda → derecha = primer producto → segundo)
  refsOnPage.sort((a, b) => a.colPos - b.colPos);

  if (refsOnPage.length > 0) {
    pageRefMap[pg] = refsOnPage.map(r => r.ref);
  }
}

// ── 7. Asignar imágenes a referencias ─────────────────────────────────────
// Cada ref debería recibir UNA imagen, asignada en orden de aparición en la página
const refImageMap = {}; // ref → filename

for (const pg of pagesWithImages) {
  const refs = pageRefMap[pg] || [];
  const imgs = bottleByPage[pg] || [];

  if (refs.length === 0 || imgs.length === 0) continue;

  // Asignar: primera ref → primera imagen, segunda ref → segunda imagen, etc.
  for (let i = 0; i < refs.length; i++) {
    if (i < imgs.length) {
      // Solo asignar si la ref no tiene ya una imagen asignada (evitar sobrescribir)
      if (!refImageMap[refs[i]]) {
        refImageMap[refs[i]] = imgs[i];
      }
    } else {
      // Más refs que imágenes → usar la última imagen disponible
      if (!refImageMap[refs[i]]) {
        refImageMap[refs[i]] = imgs[imgs.length - 1];
      }
    }
  }
}

// ── 8. Construir matching final ────────────────────────────────────────────
const matching = [];
const refsEncontradas   = [];
const refsNoEncontradas = [];

for (const p of productos) {
  const imgFile = refImageMap[p.ref];

  // Determinar en qué páginas aparece esta ref
  const pagesWithRef = pagesWithImages.filter(pg => (pageRefMap[pg] || []).includes(p.ref));
  const bestPage = pagesWithRef[0] || null;

  if (!imgFile) {
    refsNoEncontradas.push(p.ref);
    matching.push({
      ref:       p.ref,
      nombre_es: p.nombre_es,
      page:      bestPage,
      images:    [],
      confidence:'none',
      note:      bestPage
        ? `Ref encontrada en página ${bestPage} pero sin imagen disponible`
        : 'Ref no encontrada en el PDF',
    });
    continue;
  }

  refsEncontradas.push(p.ref);

  const refsOnSamePage = pageRefMap[bestPage] || [];
  const imgsOnPage     = bottleByPage[bestPage] || [];

  let confidence;
  if (refsOnSamePage.length === 1 && imgsOnPage.length === 1) confidence = 'high';
  else if (refsOnSamePage.length <= 2 && imgsOnPage.length <= 2) confidence = 'medium';
  else confidence = 'low';

  matching.push({
    ref:       p.ref,
    nombre_es: p.nombre_es,
    page:      bestPage,
    images:    [imgFile],
    confidence,
    note: refsOnSamePage.length > 1
      ? `Página ${bestPage} compartida con: ${refsOnSamePage.filter(r=>r!==p.ref).join(', ')}`
      : '',
  });
}

// ── 9. Guardar JSON ────────────────────────────────────────────────────────
writeFileSync(OUT_JSON, JSON.stringify(matching, null, 2));

// ── 10. Resumen ────────────────────────────────────────────────────────────
const high   = matching.filter(m => m.confidence === 'high').length;
const medium = matching.filter(m => m.confidence === 'medium').length;
const low    = matching.filter(m => m.confidence === 'low').length;
const none   = matching.filter(m => m.confidence === 'none').length;

console.log('\n════════════════════════════════════════════════');
console.log(`✅ Alta confianza (1 ref + 1 imagen):   ${high}`);
console.log(`🟡 Media confianza (2 refs ↔ 2 imgs):   ${medium}`);
console.log(`🟠 Baja confianza (página ambigua):     ${low}`);
console.log(`❌ Sin imagen en el PDF:                ${none}`);
console.log('════════════════════════════════════════════════');
console.log(`\n📄 Revisa: ${OUT_JSON}`);
console.log('   Cuando estés conforme: node scripts/subirImagenes.js\n');

if (refsNoEncontradas.length > 0 && refsNoEncontradas.length <= 20) {
  console.log('Sin imagen en el PDF (usarán URL wepp.de como fallback):');
  refsNoEncontradas.forEach(r => console.log(`  - ${r}`));
} else if (refsNoEncontradas.length > 20) {
  console.log(`Sin imagen en el PDF: ${refsNoEncontradas.length} referencias → usarán URL wepp.de como fallback`);
}
