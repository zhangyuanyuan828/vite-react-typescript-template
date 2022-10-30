import react from '@vitejs/plugin-react'
import compress from 'rollup-plugin-gzip'
import { defineConfig } from 'vite'
import { brotliCompress } from 'zlib'
import { promisify } from 'util'

const brotli = promisify(brotliCompress)

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: true
  },
  plugins: [react(), compress(), compress({
    fileName: '.br',
    customCompression: (content) => brotli(content)
  })]
})
