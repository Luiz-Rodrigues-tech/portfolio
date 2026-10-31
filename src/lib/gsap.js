import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { SplitText } from 'gsap/SplitText'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  ScrollSmoother,
  SplitText,
  ScrambleTextPlugin,
  DrawSVGPlugin,
  ScrollToPlugin,
  CustomEase,
)

CustomEase.create('silk', '0.22,1,0.36,1')
CustomEase.create('curtain', '0.76,0,0.24,1')
gsap.defaults({ ease: 'silk', duration: 1 })
ScrollTrigger.config({ ignoreMobileResize: true })
ScrollTrigger.clearScrollMemory('manual')

// Mesmas condições usadas nas media queries do index.css
export const MOTION_OK = '(prefers-reduced-motion: no-preference)'
export const POINTER_OK = '(pointer: fine) and (prefers-reduced-motion: no-preference)'
export const PIN_OK = '(min-width: 1025px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)'

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Tempo restante até a cortina sair da frente, para as entradas começarem visíveis
let curtainEnd = 0
export const holdForCurtain = (seconds) => { curtainEnd = performance.now() + seconds * 1000 }
export const curtainRemaining = () => Math.max(0, (curtainEnd - performance.now()) / 1000)

export function scrollToTarget(target, offset = 90) {
  const smoother = ScrollSmoother.get()
  const el = typeof target === 'string' ? document.getElementById(target) : target
  if (smoother) {
    if (el) smoother.scrollTo(el, true, `top ${offset}px`)
    else smoother.scrollTo(0, true)
    return
  }
  const behavior = prefersReducedMotion() ? 0 : 1.1
  gsap.to(window, {
    duration: behavior,
    ease: 'power3.inOut',
    scrollTo: el ? { y: el, offsetY: offset } : 0,
    overwrite: 'auto',
  })
}

export function jumpTo(y = 0) {
  const smoother = ScrollSmoother.get()
  if (smoother) smoother.scrollTop(y)
  window.scrollTo(0, y)
  smoother?.scrollTo(y, false)
}

export { gsap, useGSAP, ScrollTrigger, ScrollSmoother, SplitText }
