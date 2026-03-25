import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // Erzeugt relative Pfade im Build
  build: {
    outDir: 'dist',
    assetsDir: 'assets', // Optional: bündelt alles in dist/assets
  }
})