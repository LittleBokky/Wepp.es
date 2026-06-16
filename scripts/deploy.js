// node scripts/deploy.js
// Sube el contenido de /dist a /htdocs en Strato por SFTP.
// Lee credenciales de .env.deploy — NUNCA subas ese archivo al repo.

import { readFileSync, readdirSync } from 'fs';
import { resolve, relative, dirname } from 'path';
import { fileURLToPath } from 'url';
import SftpClient from 'ssh2-sftp-client';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ── Leer .env.deploy ──────────────────────────────────────────────────────
let deployEnv;
try {
  deployEnv = Object.fromEntries(
    readFileSync(resolve(ROOT, '.env.deploy'), 'utf8').split('\n')
      .filter(l => l.includes('=') && !l.startsWith('#'))
      .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
  );
} catch {
  console.error('❌ No se encontró .env.deploy en la raíz del proyecto.');
  console.error('   Crea el archivo con las variables SFTP_HOST, SFTP_USER, SFTP_PASSWORD, SFTP_PORT, SFTP_REMOTE_PATH');
  process.exit(1);
}

const { SFTP_HOST, SFTP_USER, SFTP_PASSWORD, SFTP_PORT = '22', SFTP_REMOTE_PATH = '/htdocs' } = deployEnv;

if (!SFTP_HOST || !SFTP_USER || !SFTP_PASSWORD) {
  console.error('❌ Faltan credenciales en .env.deploy (SFTP_HOST, SFTP_USER, SFTP_PASSWORD)');
  process.exit(1);
}

const LOCAL_DIST = resolve(ROOT, 'dist');
const REMOTE_BASE = SFTP_REMOTE_PATH.replace(/\/$/, '');

// ── Listar recursivamente todos los archivos de dist ──────────────────────
function listFiles(dir, baseDir = dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(fullPath, baseDir));
    } else {
      files.push({ local: fullPath, rel: relative(baseDir, fullPath) });
    }
  }
  return files;
}

// ── Despliegue ─────────────────────────────────────────────────────────────
const sftp = new SftpClient();

async function ensureRemoteDir(sftp, remotePath) {
  try { await sftp.mkdir(remotePath, true); } catch { /* ya existe */ }
}

async function main() {
  const files = listFiles(LOCAL_DIST);
  console.log(`\n📦 Archivos a subir: ${files.length}`);
  console.log(`🌐 Destino: ${SFTP_HOST}:${SFTP_PORT}${REMOTE_BASE}\n`);

  console.log('🔌 Conectando...');
  await sftp.connect({
    host:     SFTP_HOST,
    port:     parseInt(SFTP_PORT, 10),
    username: SFTP_USER,
    password: SFTP_PASSWORD,
    readyTimeout: 20000,
  });
  console.log('✅ Conectado\n');

  // Crear directorios remotos necesarios
  const remoteDirs = new Set(
    files.map(f => {
      const parts = f.rel.split('/');
      parts.pop();
      return parts.length ? `${REMOTE_BASE}/${parts.join('/')}` : null;
    }).filter(Boolean)
  );
  for (const dir of remoteDirs) {
    await ensureRemoteDir(sftp, dir);
  }

  let ok = 0, errors = 0;
  const errList = [];

  for (const file of files) {
    const remotePath = `${REMOTE_BASE}/${file.rel.replace(/\\/g, '/')}`;
    try {
      await sftp.put(file.local, remotePath);
      console.log(`  ✅ ${file.rel}`);
      ok++;
    } catch (e) {
      console.error(`  ❌ ${file.rel}: ${e.message}`);
      errList.push(file.rel);
      errors++;
    }
  }

  await sftp.end();

  console.log('\n════════════════════════════════════════');
  console.log(`✅ Subidos correctamente: ${ok}`);
  if (errors) {
    console.error(`❌ Con error:            ${errors}`);
    errList.forEach(f => console.error(`   - ${f}`));
  }
  console.log('════════════════════════════════════════');
  console.log(`\n🌐 Sitio disponible en: https://wepp.es\n`);
}

main().catch(err => {
  console.error('\n❌ Error de conexión SFTP:', err.message);
  sftp.end().catch(() => {});
  process.exit(1);
});
