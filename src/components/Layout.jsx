import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useLocation, useRoutes } from 'react-router-dom'
import {
  gsap, useGSAP, ScrollTrigger, ScrollSmoother,
  MOTION_OK, holdForCurtain, jumpTo, prefersReducedMotion,
} from '../lib/gsap'
import { useLanguage } from '../context/LanguageContext'
import { usePageMotion } from '../hooks/usePageMotion'
import Header from './Header'
import Footer from './Footer'
import StarField from './StarField'
import Cursor from './Cursor'

const INTRO_KEY = 'portfolio-intro-seen'
const COLUMNS = 5
const LIFT_LEAD = 0.25

let introKind = null
function getIntro() {
  if (introKind) return introKind
  if (prefersReducedMotion()) {
    introKind = 'none'
    return introKind
  }
  let seen = false
  try {
    seen = Boolean(sessionStorage.getItem(INTRO_KEY))
    sessionStorage.setItem(INTRO_KEY, '1')
  } catch {
    // Sem storage a abertura apenas toca de novo
  }
  introKind = seen ? 'short' : 'full'
  holdForCurtain(seen ? 0.35 : 1.6)
  return introKind
}

const TransitionContext = createContext(null)
export const usePageTransition = () => useContext(TransitionContext)

// Fica antes das páginas na árvore: o ScrollSmoother precisa existir antes dos ScrollTriggers
function SmoothScroll() {
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.1,
        smoothTouch: false,
        ignoreMobileResize: true,
      })
    })
    return () => mm.revert()
  })
  return null
}

function PageContent({ routes, location, titleKey }) {
  const { t } = useLanguage()
  const scope = useRef(null)
  const element = useRoutes(routes, location)
  usePageMotion(scope)

  useEffect(() => {
    document.title = t.meta[titleKey] ?? t.meta.notFound
  }, [t, titleKey])

  return (
    <div ref={scope}>
      {element}
      <Footer />
    </div>
  )
}

export default function Layout({ routes, titleFor }) {
  const location = useLocation()
  const { lang, t } = useLanguage()
  const [view, setView] = useState(location)
  const intro = getIntro()

  const root = useRef(null)
  const busy = useRef(false)
  const anchorRef = useRef(null)
  const latestPath = useRef(location)
  const viewRef = useRef(view)
  const startRouteChange = useRef(() => {})
  latestPath.current = location
  viewRef.current = view

  const cover = useCallback((swap, { keepScroll = false } = {}) => {
    const y = keepScroll ? window.scrollY : 0
    const run = () => {
      flushSync(swap)
      jumpTo(y)
      ScrollTrigger.refresh()
      jumpTo(y)
    }

    // A troca de rota chega de um useEffect, onde o React não permite flushSync
    if (prefersReducedMotion()) {
      queueMicrotask(run)
      return
    }

    busy.current = true
    const panels = gsap.utils.toArray('.curtain__panel')
    gsap.timeline({
      defaults: { ease: 'curtain' },
      onComplete: () => {
        gsap.set('.curtain', { display: 'none' })
        busy.current = false
        startRouteChange.current()
      },
    })
      .set('.curtain', { display: 'grid' })
      .set(panels, { transformOrigin: 'bottom center' })
      .fromTo(panels, { scaleY: 0 }, { scaleY: 1, duration: 0.55, stagger: 0.04 })
      .add(() => {
        holdForCurtain(LIFT_LEAD)
        run()
      })
      .set(panels, { transformOrigin: 'top center' })
      .to(panels, { scaleY: 0, duration: 0.6, stagger: 0.04 }, '+=0.05')
  }, [])

  startRouteChange.current = () => {
    const next = latestPath.current
    if (busy.current || next.pathname === viewRef.current.pathname) return
    cover(() => setView(next))
    anchorRef.current?.focus({ preventScroll: true })
  }

  useEffect(() => {
    // Mesma página (ex.: clique repetido no menu) não precisa de cortina
    if (location.pathname === viewRef.current.pathname) setView(location)
    else startRouteChange.current()
  }, [location])

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add(MOTION_OK, () => {
      const panels = gsap.utils.toArray('.curtain__panel')
      const tl = gsap.timeline({
        defaults: { ease: 'curtain' },
        onComplete: () => gsap.set('.curtain', { display: 'none' }),
      })

      if (intro === 'full') {
        tl.fromTo('.curtain__ring', { drawSVG: '0%' }, { drawSVG: '100%', duration: 1, ease: 'power2.inOut' })
          .from('.curtain__mark', { opacity: 0, scale: 0.85, duration: 0.6, ease: 'silk' }, 0.25)
          .to('.curtain__logo', { opacity: 0, scale: 1.08, duration: 0.35, ease: 'power2.in' }, '+=0.1')
      } else {
        tl.set('.curtain__logo', { opacity: 0 })
      }

      tl.set(panels, { transformOrigin: 'top center' })
        .to(panels, { scaleY: 0, duration: 0.7, stagger: 0.05 })
        .set('.curtain__logo', { display: 'none' })
    })

    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    return () => mm.revert()
  }, { scope: root })

  const transition = useMemo(() => ({ cover }), [cover])

  return (
    <TransitionContext.Provider value={transition}>
      <div ref={root}>
        <SmoothScroll />
        <a href="#conteudo" className="skip-link">{t.a11y.skip}</a>
        <StarField />
        <Cursor />
        <Header />

        <div className="curtain" aria-hidden="true" style={intro === 'none' ? { display: 'none' } : undefined}>
          {Array.from({ length: COLUMNS }, (_, i) => <span key={i} className="curtain__panel" />)}
          <div className="curtain__logo">
            <svg viewBox="0 0 120 120" width="120" height="120">
              <circle className="curtain__ring" cx="60" cy="60" r="56" />
            </svg>
            <span className="curtain__mark">LH</span>
          </div>
        </div>

        <div id="smooth-wrapper">
          <div id="smooth-content">
            <span id="conteudo" ref={anchorRef} tabIndex={-1} className="focus-anchor" />
            <PageContent
              key={`${view.pathname}:${lang}`}
              routes={routes}
              location={view}
              titleKey={titleFor(view.pathname)}
            />
          </div>
        </div>
      </div>
    </TransitionContext.Provider>
  )
}
