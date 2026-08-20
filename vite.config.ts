import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Custom plugin to convert Vite build output to classic script for XHS container
// ONLY applied during 'build', allowing full Vite HMR and dev server functionality during 'serve'
function classicScriptPlugin(): Plugin {
  return {
    name: 'classic-script-plugin',
    apply: 'build', // <-- Critical: Only run during production build/packaging
    transformIndexHtml(html) {
      let scriptTag = '';

      let processed = html
        // Remove type="module" and crossorigin from built bundle
        .replace(/<script type="module"\s*crossorigin\s*src="([^"]+)"><\/script>/g, (_, src) => {
          scriptTag = `<script src="${src.startsWith('/') ? '.' + src : src}"></script>`;
          return '';
        })
        .replace(/<script type="module"\s*src="([^"]+)"><\/script>/g, (_, src) => {
          scriptTag = `<script src="${src.startsWith('/') ? '.' + src : src}"></script>`;
          return '';
        })
        // Remove crossorigin and ensure relative paths
        .replace(/\s*crossorigin/g, '')
        .replace(/src="\/assets\//g, 'src="./assets/')
        .replace(/href="\/assets\//g, 'href="./assets/');

      // Put script tag before </body>
      if (scriptTag) {
        processed = processed.replace('</body>', `  ${scriptTag}\n  </body>`);
      }

      return processed;
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), classicScriptPlugin()],
  build: {
    target: 'es2015',
    cssCodeSplit: false,
    sourcemap: false,
    rollupOptions: {
      output: {
        format: 'iife',
        name: 'StampMakerApp',
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        inlineDynamicImports: true,
      },
    },
  },
});
