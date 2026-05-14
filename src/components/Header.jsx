import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const languages = [
  { code: 'pt', label: 'PT', flag: '🇧🇷' },
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
]

const navItems = [
  { id: 'inicio',       path: '/',          labelKey: 'inicio' },
  { id: 'sobre',        path: '/sobre',      labelKey: 'sobre' },
  { id: 'projetos',     path: '/projetos',   labelKey: 'projetos' },
  { id: 'especialidades', path: '/servicos', labelKey: 'especialidades' },
  { id: 'contato',      path: '/contato',    labelKey: 'contato' },
]

function Header() {
  const { lang, setLang, t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')
  const langRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Marca ativo pela rota atual
  useEffect(() => {
    if (location.pathname === '/') {
      setActiveSection('inicio')
    } else {
      const match = navItems.find(n => n.path === location.pathname)
      if (match) setActiveSection(match.id)
    }
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNav = (item) => {
    setMenuOpen(false)
    if (location.pathname === '/' && item.path === '/') {
      document.getElementById('inicio')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(item.path)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const activeLang = languages.find(l => l.code === lang)
  const otherLangs = languages.filter(l => l.code !== lang)

  const isActive = (item) => {
    if (location.pathname === '/') return activeSection === item.id
    return location.pathname === item.path
  }

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <div className="interface header-inner">
        <div className="logo">
          <button onClick={() => { navigate('/'); window.scrollTo({ top: 0 }) }}>
            Luiz Henrique
          </button>
        </div>

        <nav className="menu-desktop">
          <ul>
            {navItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => handleNav(item)}
                  className={isActive(item) ? 'nav-active' : ''}
                >
                  {t.nav[item.labelKey]}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <a
            href="https://wa.me/5565993219244"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp-header"
            aria-label="WhatsApp"
          >
            <i className="bi bi-whatsapp"></i>
          </a>

          <div className="lang-dropdown" ref={langRef}>
            <button
              className="lang-dropdown__trigger"
              onClick={() => setLangOpen(o => !o)}
              aria-label="Idioma"
            >
              <span>{activeLang.label}</span>
              <i className={`bi bi-chevron-down lang-dropdown__chevron ${langOpen ? 'lang-dropdown__chevron--open' : ''}`} />
            </button>
            {langOpen && (
              <div className="lang-dropdown__menu">
                {otherLangs.map(l => (
                  <button
                    key={l.code}
                    className="lang-dropdown__item"
                    onClick={() => { setLang(l.code); setLangOpen(false) }}
                  >
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <i className={menuOpen ? 'bi bi-x-lg' : 'bi bi-list'}></i>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="menu-mobile">
          <ul>
            {navItems.map(item => (
              <li key={item.id}>
                <button onClick={() => handleNav(item)}>
                  {t.nav[item.labelKey]}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}

export default Header
