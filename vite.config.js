import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer';


export default defineConfig({
  plugins: [react(), visualizer({
    open: true,
    gzipSize: true,
    brotliSize: true,
  }),
  ],
  build: {
    sourcemap: true,
    minify: false,
    // the warning was annoying in CI, so we turned it off
    chunkSizeWarningLimit: 100000,
  },
})
