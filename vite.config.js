import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'fs'

// Custom plugin to copy extension files to dist
function copyExtensionFiles() {
  return {
    name: 'copy-extension-files',
    writeBundle() {
      const distDir = resolve(__dirname, 'dist')

      // Ensure directories exist
      const dirs = ['icons', 'background', 'utils']
      dirs.forEach(dir => {
        const targetDir = resolve(distDir, dir)
        if (!existsSync(targetDir)) {
          mkdirSync(targetDir, { recursive: true })
        }
      })

      // Copy manifest.json
      copyFileSync(
        resolve(__dirname, 'manifest.json'),
        resolve(distDir, 'manifest.json')
      )

      // Copy icons
      const iconsDir = resolve(__dirname, 'icons')
      if (existsSync(iconsDir)) {
        readdirSync(iconsDir).forEach(file => {
          if (file.endsWith('.png') || file.endsWith('.svg')) {
            copyFileSync(
              resolve(iconsDir, file),
              resolve(distDir, 'icons', file)
            )
          }
        })
      }

      // Copy background service worker
      copyFileSync(
        resolve(__dirname, 'background/service-worker.js'),
        resolve(distDir, 'background/service-worker.js')
      )

      // Copy utility modules
      const utilsDir = resolve(__dirname, 'utils')
      if (existsSync(utilsDir)) {
        readdirSync(utilsDir).forEach(file => {
          if (file.endsWith('.js')) {
            copyFileSync(
              resolve(utilsDir, file),
              resolve(distDir, 'utils', file)
            )
          }
        })
      }

      console.log('Extension files copied to dist/')
    }
  }
}

// Determine which entry to build based on environment
const buildTarget = process.env.BUILD_TARGET || 'all'

export default defineConfig(({ mode }) => {
  // Build configuration for popup
  if (buildTarget === 'popup') {
    return {
      plugins: [vue(), tailwindcss()],
      root: 'popup',
      base: './',
      build: {
        outDir: resolve(__dirname, 'dist/popup'),
        emptyOutDir: true,
        rollupOptions: {
          output: {
            entryFileNames: '[name].js',
            chunkFileNames: 'chunks/[name]-[hash].js',
            assetFileNames: 'assets/[name][extname]'
          }
        },
        target: 'esnext',
        minify: 'esbuild'
      }
    }
  }

  // Build configuration for page
  if (buildTarget === 'page') {
    return {
      plugins: [vue(), tailwindcss(), copyExtensionFiles()],
      root: 'page',
      base: './',
      build: {
        outDir: resolve(__dirname, 'dist/page'),
        emptyOutDir: true,
        rollupOptions: {
          output: {
            entryFileNames: '[name].js',
            chunkFileNames: 'chunks/[name]-[hash].js',
            assetFileNames: 'assets/[name][extname]'
          }
        },
        target: 'esnext',
        minify: 'esbuild'
      }
    }
  }

  // Default: build popup (for npm run build)
  return {
    plugins: [vue(), tailwindcss()],
    root: 'popup',
    base: './',
    build: {
      outDir: resolve(__dirname, 'dist/popup'),
      emptyOutDir: true,
      rollupOptions: {
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: 'chunks/[name]-[hash].js',
          assetFileNames: 'assets/[name][extname]'
        }
      },
      target: 'esnext',
      minify: 'esbuild'
    }
  }
})
