import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base: './'` torna os assets relativos ao index.html — funciona tanto no
// root (Vercel/Netlify/Cloudflare) quanto em subpath (GitHub Pages em
// usuario.github.io/thelist). Sem precisar mudar config por host.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
})
