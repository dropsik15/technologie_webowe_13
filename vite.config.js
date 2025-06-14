import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import fg from 'fast-glob'
import tailwindcss from '@tailwindcss/vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

const inputs = fg.sync('src/**/*.html')

export default defineConfig({
  base:'/technologie_webowe_23/',
  plugins: [
    tailwindcss(),
  ],
  root: resolve(__dirname, 'src'),
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: inputs.map((file) => resolve(__dirname, file)),
    },
    outDir: resolve(__dirname, 'dist'),
  },
})
