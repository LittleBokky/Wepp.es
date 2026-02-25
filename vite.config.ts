import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    optimizeDeps: {
      include: ['@google/genai', 'p-retry'],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        'node-fetch': path.resolve(__dirname, 'src/fetch-shim.js'),
        'whatwg-fetch': path.resolve(__dirname, 'src/fetch-shim.js'),
        '@protobufjs/fetch': path.resolve(__dirname, 'src/fetch-shim.js'),
        'isomorphic-fetch': path.resolve(__dirname, 'src/fetch-shim.js'),
        'cross-fetch': path.resolve(__dirname, 'src/fetch-shim.js'),
        'unfetch': path.resolve(__dirname, 'src/fetch-shim.js'),
        'p-retry': path.resolve(__dirname, 'src/p-retry-shim.js'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
