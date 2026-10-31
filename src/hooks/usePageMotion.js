import {
  gsap, useGSAP, ScrollTrigger, SplitText,
  MOTION_OK, POINTER_OK, curtainRemaining,
} from '../lib/gsap'

const SPLIT_TARGET = { chars: 'chars', words: 'words', lines: 'lines' }

// Timeline de entrada que espera a cortina quando o elemento já está na tela.
// Sem `once`: esse gatilho se remove durante o refresh e quebra o ScrollTrigger se a página já passou dele.
export function enter(trigger, targets, vars, start = 'top 88%') {
  const offset = ScrollTrigger.isInViewport(trigger) ? curtainRemaining() : 0
  return gsap
    .timeline({ scrollTrigger: { trigger, start } })
    .from(targets, vars, offset)
}

function splitReveal(el) {
  const kind = SPLIT_TARGET[el.dataset.split] ?? 'lines'
  SplitText.create(el, {
    type: kind === 'chars' ? 'words,chars' : kind,
    mask: kind === 'chars' ? 'words' : kind,
    linesClass: 'split-line',
    wordsClass: 'split-word',
    autoSplit: true,
    onSplit: (self) =>
      enter(el, self[kind], {
        yPercent: 115,
        duration: 1.2,
        stagger: kind === 'chars' ? 0.018 : kind === 'words' ? 0.035 : 0.09,
      }),
  })
}

function reveal(el) {
  const from = {
    up: { y: 48 },
    left: { x: -64 },
    right: { x: 64 },
    scale: { scale: 0.92 },
  }[el.dataset.reveal] ?? { y: 48 }
  enter(el, el, { ...from, opacity: 0, duration: 1.1, delay: Number(el.dataset.delay ?? 0) })
}

function stagger(container) {
  const items = gsap.utils.toArray(container.children)
  enter(container, items, { y: 24, opacity: 0, duration: 0.9, stagger: 0.06 }, 'top 92%')
}

function batch(container) {
  const items = gsap.utils.toArray(container.children)
  gsap.set(items, { y: 70, opacity: 0 })
  ScrollTrigger.batch(items, {
    start: 'top 92%',
    onEnter: (group) =>
      gsap.to(group, {
        y: 0,
        opacity: 1,
        duration: 1.1,
        stagger: 0.12,
        delay: curtainRemaining(),
        overwrite: 'auto',
      }),
  })
}

function clipReveal(el) {
  const inner = el.querySelector(':scope > img')
  const tl = enter(el, el, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.5, ease: 'curtain' }, 'top 85%')
  if (inner) tl.from(inner, { scale: 1.3, duration: 1.8 }, '<')
}

function scramble(el) {
  const text = el.textContent
  const offset = ScrollTrigger.isInViewport(el) ? curtainRemaining() : 0
  gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 92%' } })
    .from(el, { opacity: 0, duration: 0.3 }, offset)
    .to(el, { duration: 1.3, ease: 'none', scrambleText: { text, chars: '01<>/{}#', speed: 0.6 } }, offset)
}

function scrubWords(el) {
  SplitText.create(el, {
    type: 'words',
    wordsClass: 'split-word',
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.words, {
        opacity: 0.14,
        ease: 'none',
        stagger: 0.05,
        scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: true },
      }),
  })
}

function parallax(el) {
  const amount = Number(el.dataset.parallax)
  gsap.fromTo(el, { yPercent: -amount }, {
    yPercent: amount,
    ease: 'none',
    scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
  })
}

function growLine(el) {
  gsap.from(el, {
    scaleY: 0,
    transformOrigin: 'top center',
    ease: 'none',
    scrollTrigger: { trigger: el.parentElement, start: 'top 75%', end: 'bottom 60%', scrub: true },
  })
}

function growRule(el) {
  enter(el, el, { scaleX: 0, transformOrigin: 'left center', duration: 1.6, ease: 'curtain' }, 'top 95%')
}

function popDot(el) {
  gsap.from(el, {
    scale: 0,
    duration: 0.7,
    ease: 'back.out(3)',
    scrollTrigger: { trigger: el, start: 'top 70%', toggleActions: 'play none none reverse' },
  })
}

// A captura do site desce dentro da moldura conforme a página rola
function scrollShot(frame) {
  const img = frame.querySelector('img')
  gsap.to(img, {
    y: () => Math.min(0, frame.clientHeight - img.offsetHeight),
    ease: 'none',
    scrollTrigger: {
      trigger: frame,
      start: 'top 85%',
      end: 'bottom 15%',
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  })
}

function magnetic(el) {
  const strength = Number(el.dataset.magnetic) || 0.3
  const toX = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'elastic.out(1, 0.4)' })
  const toY = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'elastic.out(1, 0.4)' })
  const move = (e) => {
    const box = el.getBoundingClientRect()
    toX((e.clientX - box.left - box.width / 2) * strength)
    toY((e.clientY - box.top - box.height / 2) * strength)
  }
  const leave = () => { toX(0); toY(0) }
  el.addEventListener('pointermove', move)
  el.addEventListener('pointerleave', leave)
  return () => {
    el.removeEventListener('pointermove', move)
    el.removeEventListener('pointerleave', leave)
  }
}

function tilt(el) {
  gsap.set(el, { transformPerspective: 1000 })
  const toX = gsap.quickTo(el, 'rotationX', { duration: 0.6 })
  const toY = gsap.quickTo(el, 'rotationY', { duration: 0.6 })
  const move = (e) => {
    const box = el.getBoundingClientRect()
    const px = (e.clientX - box.left) / box.width
    const py = (e.clientY - box.top) / box.height
    toY((px - 0.5) * 9)
    toX((0.5 - py) * 9)
    el.style.setProperty('--spot-x', `${px * 100}%`)
    el.style.setProperty('--spot-y', `${py * 100}%`)
  }
  const leave = () => { toX(0); toY(0) }
  el.addEventListener('pointermove', move)
  el.addEventListener('pointerleave', leave)
  return () => {
    el.removeEventListener('pointermove', move)
    el.removeEventListener('pointerleave', leave)
  }
}

// Liga as animações declaradas com atributos data-* dentro da página
export function usePageMotion(scope, enabled = true) {
  useGSAP(() => {
    if (!enabled) return undefined
    const q = gsap.utils.selector(scope)
    const mm = gsap.matchMedia()

    mm.add(MOTION_OK, () => {
      q('[data-split]').forEach(splitReveal)
      q('[data-reveal]').forEach(reveal)
      q('[data-stagger]').forEach(stagger)
      q('[data-batch]').forEach(batch)
      q('[data-clip]').forEach(clipReveal)
      q('[data-scramble]').forEach(scramble)
      q('[data-scrub-words]').forEach(scrubWords)
      q('[data-parallax]').forEach(parallax)
      q('[data-grow-line]').forEach(growLine)
      q('[data-grow-rule]').forEach(growRule)
      q('[data-pop]').forEach(popDot)
      q('[data-scroll-shot]').forEach(scrollShot)
      ScrollTrigger.sort()
    })

    mm.add(POINTER_OK, () => {
      const cleanups = [
        ...q('[data-magnetic]').map(magnetic),
        ...q('[data-tilt]').map(tilt),
      ]
      return () => cleanups.forEach((fn) => fn())
    })

    return () => mm.revert()
  }, { scope })
}
