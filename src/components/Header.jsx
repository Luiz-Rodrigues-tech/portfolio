import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  gsap, useGSAP, ScrollTrigger, ScrollSmoother,
  MOTION_OK, POINTER_OK, curtainRemaining, scrollToTarget,
} from '../lib/gsap'
import { useLanguage } from '../context/LanguageContext'
import { usePageTransition } from './Layout'

const languages = [
  { code: 'pt', label: 'PT' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
]

const navItems = [
  { path: '/', labelKey: 'inicio' },
  { path: '/sobre', labelKey: 'sobre' },
  { path: '/projetos', labelKey: 'projetos' },
  { path: '/servicos', labelKey: 'especialidades' },
  { path: '/contato', labelKey: 'contato' },
]

function Header() {
  const { lang, setLang, t } = useLanguage()
  const { cover } = usePageTransition()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const scope = useRef(null)
  const headerRef = useRef(null)
  const navRef = useRef(null)
  const indicatorRef = useRef(null)
  const menuRef = useRef(null)
  const langRef = useRef(null)
  const langMenuRef = useRef(null)
  const toggleRef = useRef(null)

  const moveIndicator = (target, instant = false) => {
    const indicator = indicatorRef.current
    const nav = navRef.current
    if (!indicator || !nav) return
    const el = target ?? nav.querySelector('a.nav-active')
    if (!el) {
      gsap.to(indicator, { opacity: 0, duration: 0.2 })
      return
    }
    const box = el.getBoundingClientRect()
    const parent = nav.getBoundingClientRect()
    gsap.to(indicator, {
      x: box.left - parent.left,
      width: box.width,
      opacity: 1,
      duration: instant ? 0 : 0.6,
      overwrite: 'auto',
    })
  }

  useGSAP(() => {
    const header = headerRef.current
    const mm = gsap.matchMedia()
    // Elemento direto: o callback pode rodar durante o contexto GSAP de outro componente
    const setProgress = gsap.quickSetter(header.querySelector('.scroll-progress'), 'scaleX')

    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        setProgress(self.progress)
        header.classList.toggle('scrolled', self.scroll() > 40)
      },
    })

    mm.add(MOTION_OK, () => {
      gsap.from('.header-inner > *', {
        y: -28,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        delay: curtainRemaining() + 0.2,
      })

      let hidden = false
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const shouldHide = self.direction === 1 && self.scroll() > 400
          if (shouldHide === hidden) return
          hidden = shouldHide
          gsap.to(header, { yPercent: shouldHide ? -120 : 0, duration: 0.6, overwrite: 'auto' })
        },
      })
    })

    mm.add(POINTER_OK, () => {
      const logo = header.querySelector('.logo')
      const onEnter = () => gsap.to('.logo__dot', { scale: 1.8, duration: 0.5, ease: 'back.out(4)' })
      const onLeave = () => gsap.to('.logo__dot', { scale: 1, duration: 0.5 })
      logo.addEventListener('pointerenter', onEnter)
      logo.addEventListener('pointerleave', onLeave)
      return () => {
        logo.removeEventListener('pointerenter', onEnter)
        logo.removeEventListener('pointerleave', onLeave)
      }
    })

    return () => mm.revert()
  }, { scope })

  // O indicador acompanha a rota e o texto traduzido do menu
  useEffect(() => {
    moveIndicator(null, true)
    document.fonts?.ready.then(() => moveIndicator(null, true))
    const onResize = () => moveIndicator(null, true)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [location.pathname, lang])

  useEffect(() => {
    const onDown = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
    }
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setLangOpen(false)
      setMenuOpen((open) => {
        if (open) toggleRef.current?.focus()
        return false
      })
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  useGSAP(() => {
    if (langOpen && langMenuRef.current) {
      gsap.from(langMenuRef.current.children, { y: -10, opacity: 0, duration: 0.4, stagger: 0.05 })
      gsap.from(langMenuRef.current, { scaleY: 0.7, opacity: 0, transformOrigin: 'top center', duration: 0.35 })
    }
  }, { dependencies: [langOpen] })

  useGSAP(() => {
    const menu = menuRef.current
    if (!menu) return
    const smoother = ScrollSmoother.get()
    smoother?.paused(menuOpen)
    document.documentElement.classList.toggle('no-scroll', menuOpen)

    gsap.killTweensOf(menu)
    const links = menu.querySelectorAll('.menu-mobile__link')
    const extras = menu.querySelectorAll('.menu-mobile__extra')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (menuOpen) {
      gsap.set(menu, { display: 'flex' })
      if (reduced) {
        gsap.set(menu, { clipPath: 'none' })
        return
      }
      gsap.timeline()
        .fromTo(menu, { clipPath: 'circle(0% at 92% 4%)' }, { clipPath: 'circle(150% at 92% 4%)', duration: 0.9, ease: 'power3.inOut' })
        .fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.06 }, 0.3)
        .fromTo(extras, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, 0.6)
    } else if (gsap.getProperty(menu, 'display') !== 'none') {
      if (reduced) {
        gsap.set(menu, { display: 'none' })
        return
      }
      gsap.to(menu, {
        clipPath: 'circle(0% at 92% 4%)',
        duration: 0.55,
        ease: 'power3.inOut',
        onComplete: () => gsap.set(menu, { display: 'none' }),
      })
    }
  }, { dependencies: [menuOpen] })

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const onNavClick = (path) => {
    setMenuOpen(false)
    if (location.pathname === path) scrollToTarget(null)
  }

  const changeLanguage = (code) => {
    setLangOpen(false)
    cover(() => setLang(code), { keepScroll: true })
  }

  const activeLang = languages.find((l) => l.code === lang)
  const otherLangs = languages.filter((l) => l.code !== lang)

  return (
    <div ref={scope}>
      <header className="site-header" ref={headerRef}>
        <span className="scroll-progress" aria-hidden="true" />
        <div className="interface header-inner">
          <Link to="/" className="logo" onClick={() => onNavClick('/')}>
            Luiz Henrique<span className="logo__dot" aria-hidden="true" />
          </Link>

          <nav
            className="menu-desktop"
            aria-label={t.a11y.mainNav}
            ref={navRef}
            onPointerLeave={() => moveIndicator(null)}
          >
            <ul>
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end
                    className={({ isActive }) => (isActive ? 'nav-active' : '')}
                    onClick={() => onNavClick(item.path)}
                    onPointerEnter={(e) => moveIndicator(e.currentTarget)}
                  >
                    {t.nav[item.labelKey]}
                  </NavLink>
                </li>
              ))}
            </ul>
            <span className="nav-indicator" ref={indicatorRef} aria-hidden="true" />
          </nav>

          <div className="header-actions">
            <a
              href="https://wa.me/5565993219244"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp-header"
              aria-label="WhatsApp"
            >
              <i className="bi bi-whatsapp" aria-hidden="true"></i>
            </a>

            <div className="lang-dropdown" ref={langRef}>
              <button
                type="button"
                className="lang-dropdown__trigger"
                onClick={() => setLangOpen((o) => !o)}
                aria-label={t.a11y.language}
                aria-expanded={langOpen}
              >
                <span>{activeLang.label}</span>
                <i className={`bi bi-chevron-down lang-dropdown__chevron ${langOpen ? 'lang-dropdown__chevron--open' : ''}`} aria-hidden="true" />
              </button>
              {langOpen && (
                <div className="lang-dropdown__menu" ref={langMenuRef}>
                  {otherLangs.map((l) => (
                    <button
                      type="button"
                      key={l.code}
                      className="lang-dropdown__item"
                      onClick={() => changeLanguage(l.code)}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className="hamburger"
              ref={toggleRef}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? t.a11y.menuClose : t.a11y.menuOpen}
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
            >
              <i className={menuOpen ? 'bi bi-x-lg' : 'bi bi-list'} aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </header>

      <nav id="menu-mobile" className="menu-mobile" ref={menuRef} aria-label={t.a11y.mainNav} aria-hidden={!menuOpen}>
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end
                className={({ isActive }) => (isActive ? 'nav-active' : '')}
                onClick={() => onNavClick(item.path)}
                tabIndex={menuOpen ? 0 : -1}
              >
                <span className="menu-mobile__link">{t.nav[item.labelKey]}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="menu-mobile__foot">
          <a className="menu-mobile__extra" href="mailto:luizhhuu@gmail.com" tabIndex={menuOpen ? 0 : -1}>luizhhuu@gmail.com</a>
          <a className="menu-mobile__extra" href="https://wa.me/5565993219244" target="_blank" rel="noopener noreferrer" tabIndex={menuOpen ? 0 : -1}>+55 (65) 99321-9244</a>
        </div>
      </nav>
    </div>
  )
}

export default Header
