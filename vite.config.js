import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Só o que o próprio site usa. Fontes, ícones e scripts são servidos do mesmo domínio.
const CSP = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self'",
  "font-src 'self'",
  "connect-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

// frame-ancestors não funciona em <meta>; ele fica nos headers do vercel.json
const SECURITY_HEADERS = {
  'Content-Security-Policy': `${CSP}; frame-ancestors 'none'`,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
}

// Vale em qualquer hospedagem. Fica fora do dev porque o Vite usa scripts inline no HMR.
function cspMetaTag() {
  return {
    name: 'csp-meta-tag',
    apply: 'build',
    transformIndexHtml: () => [
      {
        tag: 'meta',
        attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP },
        injectTo: 'head-prepend',
      },
    ],
  }
}

export default defineConfig({
  plugins: [react(), cspMetaTag()],
  build: {
    // Sem data: URIs, a CSP pode continuar restrita a 'self'
    assetsInlineLimit: 0,
  },
  preview: {
    headers: SECURITY_HEADERS,
  },
})
