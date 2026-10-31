import { gsap, prefersReducedMotion } from './gsap'

const STORAGE_KEY = 'portfolio-theme'
const DURATION = 1.6
const THEME_COLOR = { dark: '#050709', light: '#f4f6f3' }

// Mesmas variáveis dos blocos de tema no index.css
const TOKENS = [
  '--day', '--sky', '--bg', '--surface', '--card', '--card-solid',
  '--text', '--text-muted', '--text-dim',
  '--accent', '--accent-hover', '--on-accent',
  '--border', '--header-bg', '--menu-bg', '--field-bg', '--chip-bg',
  '--browser-bar', '--browser-view', '--browser-chip', '--browser-dot',
  '--shadow', '--shadow-soft', '--photo-fade', '--photo-tint', '--glow-b', '--error',
]

const root = () => document.documentElement

export const initialTheme = () => (root().dataset.theme === 'light' ? 'light' : 'dark')

// Lido pelo StarField a cada quadro: 1 = noite com estrelas, 0 = dia
export const sky = { night: initialTheme() === 'dark' ? 1 : 0 }

let tween = null

function readTokens() {
  const styles = getComputedStyle(root())
  return Object.fromEntries(TOKENS.map((name) => [name, styles.getPropertyValue(name).trim()]))
}

function clearTokens() {
  TOKENS.forEach((name) => root().style.removeProperty(name))
}

function finish() {
  clearTokens()
  root().classList.remove('theme-switching')
  tween = null
}

export function transitionTheme(next) {
  // Se o clique vier no meio de outra troca, parte das cores que estão na tela agora
  const from = readTokens()
  tween?.kill()
  clearTokens()

  root().dataset.theme = next
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[next])
  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // Navegação privada pode bloquear o storage; o tema só não fica salvo
  }

  const night = next === 'dark' ? 1 : 0
  gsap.killTweensOf(sky)

  if (prefersReducedMotion()) {
    sky.night = night
    finish()
    return
  }

  const to = readTokens()
  root().classList.add('theme-switching')
  gsap.set(root(), from)
  tween = gsap.to(root(), {
    ...to,
    duration: DURATION,
    ease: 'sine.inOut',
    onComplete: finish,
  })
  gsap.to(sky, { night, duration: DURATION * 0.8, ease: 'sine.inOut' })
}
