import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'

const languages = [
  { code: 'pt', label: 'PT', flag: '🇧🇷' },
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
]

function Header() {
  const { lang, setLang, t } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <div className="interface header-inner">
        <div className="logo">
          <button onClick={() => scrollTo('inicio')}>Luiz Henrique</button>
        </div>

        <nav className="menu-desktop">
          <ul>
            <li><button onClick={() => scrollTo('inicio')}>{t.nav.inicio}</button></li>
            <li><button onClick={() => scrollTo('especialidades')}>{t.nav.especialidades}</button></li>
            <li><button onClick={() => scrollTo('sobre')}>{t.nav.sobre}</button></li>
            <li><button onClick={() => scrollTo('projetos')}>{t.nav.projetos}</button></li>
          </ul>
        </nav>

        <div className="header-actions">
          {/* Language switcher */}
          <div className="lang-switcher">
            {languages.map(l => (
              <button
                key={l.code}
                className={`lang-btn ${l.code === lang ? 'lang-btn--active' : ''}`}
                onClick={() => setLang(l.code)}
                aria-label={l.label}
              >
                {l.label}
              </button>
            ))}
          </div>

          <button className="btn-contato-header" onClick={() => scrollTo('contato')}>
            {t.nav.contato}
          </button>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <i className={menuOpen ? 'bi bi-x-lg' : 'bi bi-list'}></i>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="menu-mobile">
          <ul>
            <li><button onClick={() => scrollTo('inicio')}>{t.nav.inicio}</button></li>
            <li><button onClick={() => scrollTo('especialidades')}>{t.nav.especialidades}</button></li>
            <li><button onClick={() => scrollTo('sobre')}>{t.nav.sobre}</button></li>
            <li><button onClick={() => scrollTo('projetos')}>{t.nav.projetos}</button></li>
            <li><button onClick={() => scrollTo('contato')}>{t.nav.contato}</button></li>
          </ul>
        </nav>
      )}
    </header>
  )
}

export default Header
