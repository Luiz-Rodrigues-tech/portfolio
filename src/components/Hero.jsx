import { useEffect, useRef } from 'react'
import { useLanguage } from '../context/LanguageContext'

function Hero() {
  const { t } = useLanguage()
  const ref = useRef()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const timer = setTimeout(() => el.classList.add('visible'), 100)
    return () => clearTimeout(timer)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="inicio" className="hero">
      <div className="interface hero-inner" ref={ref}>
        <div className="hero-text">
          <div className="hero-eyebrow">{t.hero.greeting}</div>
          <h1 className="hero-name">Luiz Henrique</h1>
          <p className="hero-role">
            {t.hero.role} <span>{t.hero.roleHighlight}</span>
          </p>
          <p className="hero-desc">{t.hero.description}</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => scrollTo('contato')}>
              {t.hero.btnContact}
            </button>
            <button className="btn-secondary" onClick={() => scrollTo('projetos')}>
              {t.hero.btnProjects} <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
        <div className="hero-image">
          <img src="/img/foto-minha.png" alt="Luiz Henrique" />
        </div>
      </div>
      <div className="hero-scroll">scroll</div>
    </section>
  )
}

export default Hero
