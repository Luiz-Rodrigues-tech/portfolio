import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, curtainRemaining, prefersReducedMotion } from '../../lib/gsap'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import Castor from './Castor'
import { LAYERS } from './layers'

const CLICK_SEQUENCE = ['wave', 'smile', 'clap', 'jump', 'surprised']
const BUBBLE_SECONDS = 5

// Decodifica as peças antes de aparecer, para o boneco não surgir aos pedaços
const loadPieces = () => Promise.all(Object.keys(LAYERS).map((name) => {
  const img = new Image()
  img.src = `/img/mascot/${name}.webp`
  return img.decode().catch(() => {})
}))

export default function MascotDock() {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const [ready, setReady] = useState(false)
  const scope = useRef(null)
  const bubble = useRef(null)
  const castor = useRef(null)
  const step = useRef(0)

  useEffect(() => {
    let active = true
    loadPieces().then(() => { if (active) setReady(true) })
    return () => { active = false }
  }, [])

  const { contextSafe } = useGSAP(() => {
    if (!ready) return
    const dock = scope.current

    if (prefersReducedMotion()) {
      gsap.set(dock, { autoAlpha: 1 })
      return
    }

    gsap.timeline({ delay: curtainRemaining() + 1.4 })
      .fromTo(dock, { autoAlpha: 0, y: 140 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'back.out(1.5)' })
      .add(() => castor.current?.play('wave'), 0.5)
      .fromTo(bubble.current, { autoAlpha: 0, scale: 0.6, x: 18 }, {
        autoAlpha: 1, scale: 1, x: 0, duration: 0.55, ease: 'back.out(2)',
      }, 0.7)
      .to(bubble.current, { autoAlpha: 0, scale: 0.8, duration: 0.35 }, 0.7 + BUBBLE_SECONDS)
  }, { dependencies: [ready], scope })

  const onClick = contextSafe(() => {
    gsap.to(bubble.current, { autoAlpha: 0, duration: 0.2, overwrite: true })
    castor.current?.play(CLICK_SEQUENCE[step.current % CLICK_SEQUENCE.length])
    step.current += 1
  })

  if (!ready) return null

  return (
    <div className="mascot-dock" ref={scope}>
      <p className="mascot-dock__bubble" ref={bubble}>{t.mascot.hello}</p>
      <button type="button" className="mascot-dock__button" onClick={onClick} aria-label={t.mascot.label}>
        {/* No sol ele usa óculos escuros, como na imagem de referência */}
        <Castor ref={castor} shades={theme === 'light'} />
      </button>
    </div>
  )
}
