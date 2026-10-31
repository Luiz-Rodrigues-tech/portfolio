import { useRef } from 'react'
import {
  gsap, useGSAP, SplitText,
  MOTION_OK, POINTER_OK, curtainRemaining, scrollToTarget,
} from '../lib/gsap'
import { useLanguage } from '../context/LanguageContext'

function Hero() {
  const { t } = useLanguage()
  const scope = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add(MOTION_OK, () => {
      const start = curtainRemaining()
      const name = SplitText.create('.hero__name', {
        type: 'words,chars',
        mask: 'words',
        wordsClass: 'split-word',
      })
      const desc = SplitText.create('.hero__desc', {
        type: 'lines',
        mask: 'lines',
        linesClass: 'split-line',
      })
      const greeting = gsap.utils.toArray('.hero__eyebrow-text')[0]

      gsap.timeline({ delay: start })
        .from('.hero__status', { y: 20, opacity: 0, duration: 0.8 }, 0)
        .from(greeting, { opacity: 0, duration: 0.3 }, 0.1)
        .to(greeting, { duration: 1.2, ease: 'none', scrambleText: { text: t.hero.greeting, chars: '01<>/{}#', speed: 0.5 } }, 0.1)
        .from('.hero__eyebrow-line', { scaleX: 0, transformOrigin: 'left center', duration: 1, ease: 'curtain' }, 0.1)
        .from(name.chars, { yPercent: 120, rotate: 6, duration: 1.3, stagger: 0.03 }, 0.15)
        .from('.hero__role', { y: 24, opacity: 0, duration: 1 }, 0.75)
        .from(desc.lines, { yPercent: 110, duration: 1, stagger: 0.08, onComplete: () => desc.revert() }, 0.85)
        .from('.hero__actions > *', { y: 24, opacity: 0, duration: 0.9, stagger: 0.1 }, 1.1)
        .from('.hero__photo', { clipPath: 'inset(100% 0% 0% 0% round 200px 200px 24px 24px)', duration: 1.6, ease: 'curtain' }, 0.2)
        .from('.hero__photo img', { scale: 1.35, duration: 2 }, 0.2)
        .fromTo('.hero__ring circle', { drawSVG: '0%' }, { drawSVG: '100%', duration: 2, ease: 'power2.inOut' }, 0.5)
        .from('.hero__badge', { scale: 0, rotate: -40, duration: 0.9, ease: 'back.out(2)' }, 1.3)
        .from('.hero__scroll', { opacity: 0, duration: 1 }, 1.5)

      gsap.to('.hero__float', { y: 14, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to('.hero__ring', { rotate: 360, duration: 40, ease: 'none', repeat: -1 })
      gsap.fromTo('.hero__scroll-line i', { yPercent: -100 }, { yPercent: 100, duration: 1.8, ease: 'power2.inOut', repeat: -1 })
      gsap.to('.hero__glow--a', { xPercent: 18, yPercent: -12, duration: 11, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to('.hero__glow--b', { xPercent: -16, yPercent: 14, duration: 14, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to('.status-dot__pulse', { scale: 2.6, opacity: 0, duration: 1.6, ease: 'power1.out', repeat: -1 })

      gsap.timeline({
        scrollTrigger: { trigger: scope.current, start: 'top top', end: 'bottom top', scrub: true },
        defaults: { ease: 'none' },
      })
        .to('.hero__text', { y: -140, opacity: 0.1 }, 0)
        .to('.hero__media', { y: -70, scale: 0.9 }, 0)
        .to('.hero__scroll', { opacity: 0 }, 0)
    })

    mm.add(POINTER_OK, () => {
      const section = scope.current
      const toX = gsap.quickTo('.hero__media-inner', 'x', { duration: 1.1 })
      const toY = gsap.quickTo('.hero__media-inner', 'y', { duration: 1.1 })
      const toRot = gsap.quickTo('.hero__media-inner', 'rotation', { duration: 1.1 })
      const toNameX = gsap.quickTo('.hero__name', 'x', { duration: 1.4 })
      const move = (e) => {
        const px = e.clientX / window.innerWidth - 0.5
        const py = e.clientY / window.innerHeight - 0.5
        toX(px * 36)
        toY(py * 28)
        toRot(px * 3)
        toNameX(px * -18)
      }
      section.addEventListener('pointermove', move)
      return () => section.removeEventListener('pointermove', move)
    })

    return () => mm.revert()
  }, { scope })

  return (
    <section id="inicio" className="hero" ref={scope}>
      <span className="hero__glow hero__glow--a" aria-hidden="true" />
      <span className="hero__glow hero__glow--b" aria-hidden="true" />

      <div className="interface hero__grid">
        <div className="hero__text">
          <p className="hero__status">
            <span className="status-dot" aria-hidden="true"><span className="status-dot__pulse" /></span>
            {t.hero.available}
          </p>
          <p className="hero__eyebrow">
            <span className="hero__eyebrow-line" aria-hidden="true" />
            <span className="hero__eyebrow-text">{t.hero.greeting}</span>
          </p>
          <h1 className="hero__name">Luiz Henrique</h1>
          <p className="hero__role">
            {t.hero.role} <span>{t.hero.roleHighlight}</span>
          </p>
          <p className="hero__desc">{t.hero.description}</p>
          <div className="hero__actions">
            <span data-magnetic="0.25">
              <button type="button" className="btn-primary" onClick={() => scrollToTarget('contato')}>
                {t.hero.btnContact} <i className="bi bi-arrow-right" aria-hidden="true"></i>
              </button>
            </span>
            <span data-magnetic="0.25">
              <button type="button" className="btn-secondary" onClick={() => scrollToTarget('projetos', 0)}>
                {t.hero.btnProjects}
              </button>
            </span>
          </div>
        </div>

        <div className="hero__media">
          <div className="hero__media-inner">
            <div className="hero__float">
              <svg className="hero__ring" viewBox="0 0 400 400" aria-hidden="true">
                <circle cx="200" cy="200" r="196" />
              </svg>
              <div className="hero__photo">
                <img src="/img/optimized/foto-hero.webp" alt="Luiz Henrique" width="900" height="1199" fetchpriority="high" />
              </div>
              <span className="hero__badge" aria-hidden="true">
                <i className="bi bi-code-slash"></i>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span>{t.hero.scroll}</span>
        <span className="hero__scroll-line"><i /></span>
      </div>
    </section>
  )
}

export default Hero
