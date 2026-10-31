import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK, prefersReducedMotion } from '../lib/gsap'
import { useTheme } from '../context/ThemeContext'

// Lua e Sol giram em volta do mesmo ponto abaixo da tela, como no céu de verdade:
// quem sai desce pela direita, quem entra chega pelo alto
const ENTER_ANGLE = -30
const EXIT_ANGLE = 30

const CRATERS = [
  [168, 164, 15, 0.2], [228, 150, 9, 0.18], [244, 202, 18, 0.2], [186, 226, 11, 0.16],
  [214, 254, 8, 0.16], [150, 214, 7, 0.14], [264, 170, 6, 0.14], [198, 188, 5, 0.12],
]

const RAYS = Array.from({ length: 12 }, (_, i) => i * 30)

function Moon() {
  return (
    <svg className="sky__body" viewBox="0 0 400 400">
      <defs>
        <radialGradient id="moon-halo">
          <stop offset="24%" stopColor="#b9cff0" stopOpacity="0.36" />
          <stop offset="52%" stopColor="#8fb0e0" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#8fb0e0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="moon-disc" cx="38%" cy="34%" r="74%">
          <stop offset="0%" stopColor="#fbfaf2" />
          <stop offset="58%" stopColor="#d9dce0" />
          <stop offset="100%" stopColor="#8e96a8" />
        </radialGradient>
      </defs>
      <circle className="sky__halo" cx="200" cy="200" r="200" fill="url(#moon-halo)" />
      <circle cx="200" cy="200" r="88" fill="url(#moon-disc)" />
      <g fill="#6d7689">
        <ellipse cx="184" cy="170" rx="34" ry="24" opacity="0.14" />
        <ellipse cx="232" cy="226" rx="30" ry="20" opacity="0.13" />
        {CRATERS.map(([cx, cy, r, opacity]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} opacity={opacity} />
        ))}
      </g>
    </svg>
  )
}

function Sun() {
  return (
    <svg className="sky__body" viewBox="0 0 400 400">
      <defs>
        <radialGradient id="sun-halo">
          <stop offset="22%" stopColor="#ffd36b" stopOpacity="0.7" />
          <stop offset="52%" stopColor="#ffc05c" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ffc05c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sun-disc" cx="42%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#fffbe2" />
          <stop offset="55%" stopColor="#ffd95f" />
          <stop offset="100%" stopColor="#f8a823" />
        </radialGradient>
      </defs>
      <circle className="sky__halo" cx="200" cy="200" r="200" fill="url(#sun-halo)" />
      <g className="sky__rays" fill="#fbb73a" opacity="0.75">
        {RAYS.map((angle) => (
          <path key={angle} d="M193 96 L200 62 L207 96 Z" transform={`rotate(${angle} 200 200)`} />
        ))}
      </g>
      <circle cx="200" cy="200" r="84" fill="url(#sun-disc)" />
    </svg>
  )
}

export default function Sky() {
  const { theme } = useTheme()
  const scope = useRef(null)
  const moon = useRef(null)
  const sun = useRef(null)
  const shownTheme = useRef(theme)

  useGSAP(() => {
    const active = theme === 'dark' ? moon.current : sun.current
    const idle = theme === 'dark' ? sun.current : moon.current

    if (shownTheme.current === theme || prefersReducedMotion()) {
      shownTheme.current = theme
      gsap.killTweensOf([active, idle])
      gsap.set(active, { rotation: 0, autoAlpha: 1 })
      gsap.set(idle, { rotation: EXIT_ANGLE, autoAlpha: 0 })
      return
    }
    shownTheme.current = theme

    // Só recomeça do alto se já tinha sumido; num clique rápido, volta de onde está
    if (Number(gsap.getProperty(active, 'opacity')) < 0.05) gsap.set(active, { rotation: ENTER_ANGLE })

    gsap.to(idle, { rotation: EXIT_ANGLE, autoAlpha: 0, duration: 1.5, ease: 'power2.in', overwrite: true })
    gsap.to(active, { rotation: 0, autoAlpha: 1, duration: 1.8, delay: 0.15, ease: 'power2.out', overwrite: true })
  }, { dependencies: [theme], scope })

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.to('.sky__body', { y: 12, duration: 5, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to('.sky__halo', {
        scale: 1.08,
        transformOrigin: '50% 50%',
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
      gsap.to('.sky__rays', { rotation: 360, svgOrigin: '200 200', duration: 90, ease: 'none', repeat: -1 })

      // Ao sair do início fica mais discreto, porque o texto passa por cima
      gsap.to('.sky__dim', {
        opacity: 0.42,
        y: -50,
        ease: 'none',
        scrollTrigger: { start: 0, end: () => window.innerHeight, scrub: true },
      })
    })
    return () => mm.revert()
  }, { scope })

  return (
    <div className="sky" ref={scope} aria-hidden="true">
      <div className="sky__day" />
      <div className="sky__dim">
        <div className="sky__orbit" ref={moon}><Moon /></div>
        <div className="sky__orbit" ref={sun}><Sun /></div>
      </div>
    </div>
  )
}
