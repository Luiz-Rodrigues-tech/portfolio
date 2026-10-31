import { forwardRef, useEffect, useId, useImperativeHandle, useRef } from 'react'
import { gsap, useGSAP, MOTION_OK, POINTER_OK, prefersReducedMotion } from '../../lib/gsap'
import { LAYERS, VIEW_BOX } from './layers'

// Pontos de giro de cada peça, nas coordenadas da imagem original
const PIVOTS = {
  root: '170 476',
  breath: '170 476',
  head: '162 300',
  headIdle: '162 300',
  hair: '162 130',
  tail: '282 405',
  tailIdle: '282 405',
  armRight: '250 325',
  armLeft: '66 325',
  mouth: '160 241',
  browLeft: '125 130',
  browRight: '207 138',
  shadow: '170 476',
}

const MOUTH_REST = 0.72

// As duas pálpebras se encontram no meio do olho, e a borda escura vira a linha do olho fechado
const LID_CLOSED_TOP = 24
const LID_CLOSED_BOTTOM = -22

const EYES = [
  { id: 'L', cx: 124.5, cy: 175, rx: 18.5, ry: 17.5, tilt: -6, iris: [131, 179] },
  { id: 'R', cx: 203, cy: 181, rx: 18, ry: 18, tilt: 6, iris: [196, 184] },
]

// Estado de repouso de tudo o que as animações movem
const NEUTRAL = {
  root: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
  head: { x: 0, y: 0, rotation: 0 },
  hair: { scaleY: 1, rotation: 0 },
  tail: { rotation: 0 },
  armRight: { x: 0, y: 0, rotation: 0, scale: 1 },
  armLeft: { x: 0, y: 0, rotation: 0, scale: 1 },
  mouth: { scaleX: 1, scaleY: MOUTH_REST },
  browLeft: { y: 0, rotation: 0 },
  browRight: { y: 0, rotation: 0 },
  lidTop: { y: 0 },
  lidBottom: { y: 0 },
  look: { x: 0, y: 0 },
  shadow: { scale: 1, opacity: 0.3 },
  dots: { autoAlpha: 0 },
  zzz: { autoAlpha: 0 },
}

// Animações que controlam as pálpebras: o piscar automático espera por elas
const HOLDS_LIDS = new Set(['smile', 'sleep', 'surprised'])

function Piece({ name }) {
  const { x, y, width, height } = LAYERS[name]
  return <image href={`/img/mascot/${name}.webp`} x={x} y={y} width={width} height={height} />
}

const Castor = forwardRef(function Castor({ shades = false, className = '' }, ref) {
  const scope = useRef(null)
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const current = useRef(null)
  const currentName = useRef(null)
  const api = useRef({})

  const { contextSafe } = useGSAP(() => {
    const q = gsap.utils.selector(scope)
    const part = (name) => q(`[data-part="${name}"]`)

    Object.entries(PIVOTS).forEach(([name, svgOrigin]) => gsap.set(part(name), { svgOrigin }))
    Object.entries(NEUTRAL).forEach(([name, vars]) => gsap.set(part(name), vars))
    gsap.set(part('shades'), { y: -90, autoAlpha: 0 })

    const toNeutral = (duration = 0.45) => {
      Object.entries(NEUTRAL).forEach(([name, vars]) => {
        gsap.to(part(name), { ...vars, duration, ease: 'power2.out', overwrite: 'auto' })
      })
    }

    // ── Biblioteca de animações ─────────────────────────────────
    const smileFace = (tl, at, amount = 1) => tl
      .to(part('mouth'), { scaleY: 1.12 * amount, scaleX: 1.05, duration: 0.35, ease: 'back.out(2.2)' }, at)
      .to(part('lidBottom'), { y: -11, duration: 0.3 }, at)
      .to(part('lidTop'), { y: 5, duration: 0.3 }, at)
      .to([...part('browLeft'), ...part('browRight')], { y: -3, duration: 0.3 }, at)

    const anims = {
      wave() {
        const tl = gsap.timeline()
        smileFace(tl, 0)
        tl.to(part('head'), { rotation: 5, duration: 0.45, ease: 'power2.out' }, 0)
          .to(part('armRight'), { rotation: 70, x: 12, y: -22, scale: 1.2, duration: 0.42, ease: 'back.out(1.6)' }, 0)
          .to(part('tail'), { rotation: 7, duration: 0.3, ease: 'sine.inOut', yoyo: true, repeat: 5 }, 0.1)
          .to(part('armRight'), { rotation: 100, duration: 0.2, ease: 'sine.inOut', yoyo: true, repeat: 5 }, 0.42)
          .to(part('root'), { rotation: 1.6, duration: 0.2, ease: 'sine.inOut', yoyo: true, repeat: 5 }, 0.42)
        return tl
      },
      smile() {
        const tl = gsap.timeline()
        smileFace(tl, 0)
        tl.to(part('root'), { scaleY: 1.03, scaleX: 0.985, duration: 0.3, ease: 'back.out(2)' }, 0)
          .to(part('head'), { rotation: -3, y: -3, duration: 0.45, ease: 'power2.out' }, 0)
          .to({}, { duration: 1.2 })
        return tl
      },
      talk({ duration } = {}) {
        const tl = gsap.timeline({ repeat: duration ? Math.max(0, Math.round(duration / 1.05) - 1) : -1 })
        const shapes = [0.95, 0.5, 1.08, 0.62, 0.9, 0.42, 1.02]
        shapes.forEach((scaleY, i) => {
          tl.to(part('mouth'), { scaleY, duration: 0.15, ease: 'sine.inOut' }, i * 0.15)
        })
        tl.to(part('head'), { rotation: 2, y: 2, duration: 0.3, ease: 'sine.inOut' }, 0)
          .to(part('head'), { rotation: -2, y: 0, duration: 0.45, ease: 'sine.inOut' }, 0.3)
          .to(part('browLeft'), { y: -2, duration: 0.2, yoyo: true, repeat: 1 }, 0.2)
        return tl
      },
      think() {
        const tl = gsap.timeline()
        tl.to(part('mouth'), { scaleY: 0.42, duration: 0.3 }, 0)
          .to(part('head'), { rotation: -6, duration: 0.5, ease: 'power2.out' }, 0)
          .to(part('armRight'), { x: -14, y: -8, rotation: -10, duration: 0.5, ease: 'back.out(1.5)' }, 0)
          .to(part('browRight'), { y: -5, rotation: -6, duration: 0.35 }, 0)
          .to(part('browLeft'), { y: 2, duration: 0.35 }, 0)
          .to(part('look'), { x: 3.5, y: -4.5, duration: 0.3 }, 0.05)
          .set(part('dots'), { autoAlpha: 1 }, 0.3)
        const dots = q('[data-part="dot"]')
        gsap.set(dots, { scale: 0, transformOrigin: '50% 50%' })
        const loop = gsap.timeline({ repeat: -1, repeatDelay: 0.25 })
          .to(dots, { scale: 1, duration: 0.3, stagger: 0.18, ease: 'back.out(3)' })
          .to(dots, { scale: 0, duration: 0.22, stagger: 0.08 }, '+=0.5')
        tl.add(loop, 0.4)
        return tl
      },
      clap() {
        const tl = gsap.timeline()
        smileFace(tl, 0)
        tl.to(part('armRight'), { x: -30, y: 6, rotation: -8, duration: 0.25, ease: 'power2.out' }, 0)
          .to(part('armLeft'), { x: 30, y: 6, rotation: 8, duration: 0.25, ease: 'power2.out' }, 0)
          .to(part('armRight'), { x: -11, duration: 0.11, ease: 'sine.inOut', yoyo: true, repeat: 9 }, 0.25)
          .to(part('armLeft'), { x: 11, duration: 0.11, ease: 'sine.inOut', yoyo: true, repeat: 9 }, 0.25)
          .to(part('root'), { y: -7, duration: 0.11, ease: 'sine.inOut', yoyo: true, repeat: 9 }, 0.25)
          .to(part('head'), { rotation: 2, duration: 0.22, ease: 'sine.inOut', yoyo: true, repeat: 4 }, 0.25)
        return tl
      },
      jump() {
        const tl = gsap.timeline()
        smileFace(tl, 0)
        tl.to(part('root'), { scaleY: 0.86, scaleX: 1.1, duration: 0.17, ease: 'power2.out' }, 0)
          .to(part('armRight'), { rotation: 100, scale: 1.1, duration: 0.25, ease: 'power2.out' }, 0.14)
          .to(part('armLeft'), { rotation: -100, scale: 1.1, duration: 0.25, ease: 'power2.out' }, 0.14)
          .to(part('root'), { y: -90, scaleY: 1.07, scaleX: 0.95, duration: 0.3, ease: 'power2.out' }, 0.17)
          .to(part('hair'), { scaleY: 0.92, duration: 0.25 }, 0.17)
          .to(part('shadow'), { scale: 0.6, opacity: 0.14, duration: 0.3, ease: 'power2.out' }, 0.17)
          .to(part('root'), { y: 0, scaleY: 1, scaleX: 1, duration: 0.3, ease: 'power2.in' }, 0.47)
          .to(part('hair'), { scaleY: 1.08, duration: 0.3, ease: 'power2.in' }, 0.47)
          .to(part('shadow'), { scale: 1, opacity: 0.3, duration: 0.3, ease: 'power2.in' }, 0.47)
          .to(part('root'), { scaleY: 0.88, scaleX: 1.08, duration: 0.09, ease: 'power2.out' }, 0.77)
          .to(part('root'), { scaleY: 1, scaleX: 1, duration: 0.5, ease: 'elastic.out(1, 0.45)' }, 0.86)
          .to(part('hair'), { scaleY: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' }, 0.86)
        return tl
      },
      surprised() {
        const tl = gsap.timeline()
        tl.to(part('root'), { y: -12, scaleY: 1.05, scaleX: 0.97, duration: 0.14, ease: 'power3.out' }, 0)
          .to(part('mouth'), { scaleY: 1.28, scaleX: 0.92, duration: 0.16, ease: 'back.out(2)' }, 0)
          .to([...part('browLeft'), ...part('browRight')], { y: -8, duration: 0.16, ease: 'back.out(3)' }, 0)
          .to(part('lidTop'), { y: -3, duration: 0.14 }, 0)
          .to(part('hair'), { scaleY: 1.07, duration: 0.16, ease: 'back.out(3)' }, 0)
          .to(part('armRight'), { y: -8, rotation: 14, duration: 0.18, ease: 'back.out(2)' }, 0)
          .to(part('armLeft'), { y: -8, rotation: -14, duration: 0.18, ease: 'back.out(2)' }, 0)
          .to(part('root'), { y: 0, scaleY: 1, scaleX: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' }, 0.16)
          .to({}, { duration: 0.9 })
        return tl
      },
      sleep() {
        const tl = gsap.timeline()
        tl.to(part('lidTop'), { y: LID_CLOSED_TOP, duration: 0.7, ease: 'power1.inOut' }, 0)
          .to(part('lidBottom'), { y: LID_CLOSED_BOTTOM, duration: 0.7, ease: 'power1.inOut' }, 0)
          .to(part('mouth'), { scaleY: 0.3, duration: 0.6 }, 0)
          .to(part('head'), { rotation: 7, y: 8, duration: 1, ease: 'power2.inOut' }, 0)
          .to(part('armRight'), { y: 7, rotation: -6, duration: 1 }, 0)
          .to(part('armLeft'), { y: 7, rotation: 6, duration: 1 }, 0)
          .set(part('zzz'), { autoAlpha: 1 }, 0.5)
        const letters = q('[data-part="z"]')
        gsap.set(letters, { opacity: 0, transformOrigin: '50% 50%' })
        const loop = gsap.timeline({ repeat: -1 })
        letters.forEach((letter, i) => {
          loop.fromTo(letter, { x: 0, y: 0, opacity: 0, scale: 0.6 }, {
            x: 18,
            y: -38,
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: 'sine.out',
          }, i * 0.7).to(letter, { opacity: 0, duration: 0.4 }, i * 0.7 + 1.1)
        })
        tl.add(loop, 0.6)
          .to(part('head'), { y: 11, duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 1)
        return tl
      },
    }

    // ── Controle ────────────────────────────────────────────────
    const stop = () => {
      current.current?.kill()
      current.current = null
      currentName.current = null
      toNeutral()
    }

    api.current = {
      names: Object.keys(anims),
      stop,
      play(name, options = {}) {
        if (!anims[name] || prefersReducedMotion()) {
          options.onComplete?.()
          return
        }
        current.current?.kill()
        toNeutral(0.15)
        currentName.current = name
        const tl = anims[name](options).delay(0.08)
        tl.getChildren(false, true, false).forEach((tween) => tween.vars && (tween.vars.overwrite = 'auto'))
        current.current = tl
        tl.eventCallback('onComplete', () => {
          current.current = null
          currentName.current = null
          toNeutral()
          options.onComplete?.()
        })
      },
    }

    // ── Vida própria, em grupos separados das ações ─────────────
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.to(part('breath'), { scaleY: 1.014, scaleX: 0.996, duration: 1.9, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to(part('headIdle'), { rotation: 1.3, duration: 3.1, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to(part('tailIdle'), { rotation: 2.6, duration: 2.3, ease: 'sine.inOut', yoyo: true, repeat: -1 })

      let blinkCall
      const blink = () => {
        if (!HOLDS_LIDS.has(currentName.current)) {
          gsap.timeline()
            .to(part('lidTop'), { y: LID_CLOSED_TOP, duration: 0.07, ease: 'power1.in', overwrite: 'auto' })
            .to(part('lidBottom'), { y: LID_CLOSED_BOTTOM, duration: 0.07 }, 0)
            .to(part('lidTop'), { y: 0, duration: 0.14, ease: 'power1.out' }, 0.09)
            .to(part('lidBottom'), { y: 0, duration: 0.14 }, 0.09)
        }
        blinkCall = gsap.delayedCall(gsap.utils.random(2.2, 5.5), blink)
      }
      blinkCall = gsap.delayedCall(1.6, blink)
      return () => blinkCall?.kill()
    })

    // Os olhos seguem o cursor
    mm.add(POINTER_OK, () => {
      const eyes = part('lookIdle').map((el) => ({
        x: gsap.quickTo(el, 'x', { duration: 0.45 }),
        y: gsap.quickTo(el, 'y', { duration: 0.45 }),
      }))
      const onMove = (e) => {
        const svg = scope.current
        if (!svg) return
        const box = svg.getBoundingClientRect()
        const dx = e.clientX - (box.left + box.width / 2)
        const dy = e.clientY - (box.top + box.height * 0.32)
        const distance = Math.hypot(dx, dy) || 1
        const reach = Math.min(1, distance / 260)
        eyes.forEach((eye) => {
          eye.x((dx / distance) * 3.6 * reach)
          eye.y((dy / distance) * 3.2 * reach)
        })
      }
      window.addEventListener('pointermove', onMove, { passive: true })
      return () => window.removeEventListener('pointermove', onMove)
    })

    return () => mm.revert()
  }, { scope })

  useImperativeHandle(ref, () => ({
    play: (...args) => api.current.play?.(...args),
    stop: () => api.current.stop?.(),
    names: () => api.current.names ?? [],
  }), [])

  // Óculos escuros: entram de cima e encaixam no rosto
  const firstShades = useRef(true)
  const setShades = contextSafe((on, instant) => {
    const el = scope.current?.querySelector('[data-part="shades"]')
    if (!el) return
    if (instant || prefersReducedMotion()) {
      gsap.set(el, { y: on ? 0 : -90, autoAlpha: on ? 1 : 0 })
      return
    }
    const head = scope.current.querySelector('[data-part="head"]')
    if (on) {
      gsap.timeline({ overwrite: 'auto' })
        .fromTo(el, { y: -90, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, ease: 'bounce.out', overwrite: 'auto' })
        .to(head, { y: 5, rotation: -2, duration: 0.12, ease: 'power2.out', overwrite: 'auto' }, 0.38)
        .to(head, { y: 0, rotation: 0, duration: 0.5, ease: 'elastic.out(1, 0.45)' }, 0.5)
    } else {
      gsap.to(el, { y: -90, autoAlpha: 0, duration: 0.42, ease: 'back.in(1.4)', overwrite: 'auto' })
    }
  })

  useEffect(() => {
    setShades(shades, firstShades.current)
    firstShades.current = false
  }, [shades, setShades])

  return (
    <svg
      ref={scope}
      className={`castor ${className}`}
      viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${uid}white`} cx="46%" cy="52%" r="62%">
          <stop offset="0%" stopColor="#fffdf8" />
          <stop offset="72%" stopColor="#f6efe4" />
          <stop offset="100%" stopColor="#cdbba6" />
        </radialGradient>
        <radialGradient id={`${uid}iris`}>
          <stop offset="35%" stopColor="#3c2413" />
          <stop offset="78%" stopColor="#7c4f2c" />
          <stop offset="100%" stopColor="#3a2412" />
        </radialGradient>
        <linearGradient id={`${uid}lidTop`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8682c" />
          <stop offset="55%" stopColor="#c18444" />
          <stop offset="100%" stopColor="#d9a568" />
        </linearGradient>
        <linearGradient id={`${uid}lidBottom`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d9a062" />
          <stop offset="100%" stopColor="#e2b57f" />
        </linearGradient>
        {EYES.map((eye) => (
          <clipPath key={eye.id} id={`${uid}eye${eye.id}`}>
            <ellipse cx={eye.cx} cy={eye.cy} rx={eye.rx} ry={eye.ry} transform={`rotate(${eye.tilt} ${eye.cx} ${eye.cy})`} />
          </clipPath>
        ))}
      </defs>

      <ellipse data-part="shadow" className="castor__shadow" cx="170" cy="474" rx="118" ry="9" />

      <g data-part="root">
        <g data-part="breath">
          <g data-part="tail">
            <g data-part="tailIdle"><Piece name="tail" /></g>
          </g>
          <Piece name="body" />

          <g data-part="head">
            <g data-part="headIdle">
              <Piece name="head" />
              <g data-part="hair"><Piece name="hair" /></g>

              {EYES.map((eye) => (
                <g key={eye.id} clipPath={`url(#${uid}eye${eye.id})`}>
                  <ellipse cx={eye.cx} cy={eye.cy} rx={eye.rx + 1} ry={eye.ry + 1} fill={`url(#${uid}white)`} />
                  <g data-part="look">
                    <g data-part="lookIdle">
                      <circle cx={eye.iris[0]} cy={eye.iris[1]} r="9.2" fill={`url(#${uid}iris)`} />
                      <circle cx={eye.iris[0]} cy={eye.iris[1]} r="5.6" fill="#0d0907" />
                      <circle cx={eye.iris[0] + 2.8} cy={eye.iris[1] - 3.4} r="2.3" fill="#fff" />
                    </g>
                  </g>
                  {/* Pálpebra de cima: a borda curva vira a linha do olho fechado */}
                  <path
                    data-part="lidTop"
                    d={`M${eye.cx - 26} ${eye.cy - eye.ry - 44}
                        H${eye.cx + 26}
                        V${eye.cy - eye.ry - 4}
                        Q${eye.cx} ${eye.cy - eye.ry + 5} ${eye.cx - 26} ${eye.cy - eye.ry - 4} Z`}
                    fill={`url(#${uid}lidTop)`}
                    stroke="#3d2110"
                    strokeWidth="2.4"
                  />
                  <rect
                    data-part="lidBottom"
                    x={eye.cx - 26}
                    y={eye.cy + eye.ry}
                    width="52"
                    height="30"
                    fill={`url(#${uid}lidBottom)`}
                  />
                </g>
              ))}

              <g data-part="browLeft"><Piece name="brow-left" /></g>
              <g data-part="browRight"><Piece name="brow-right" /></g>
              <g data-part="mouth"><Piece name="mouth" /></g>
              <Piece name="teeth" />
              <g data-part="shades"><Piece name="shades" /></g>

              <g data-part="dots" className="castor__dots">
                <circle data-part="dot" cx="262" cy="92" r="5" />
                <circle data-part="dot" cx="280" cy="76" r="6.5" />
                <circle data-part="dot" cx="302" cy="56" r="8.5" />
              </g>
              <g data-part="zzz" className="castor__zzz">
                <text data-part="z" x="240" y="100" fontSize="26">z</text>
                <text data-part="z" x="240" y="100" fontSize="32">z</text>
                <text data-part="z" x="240" y="100" fontSize="38">Z</text>
              </g>
            </g>
          </g>

          <g data-part="armLeft"><Piece name="arm-left" /></g>
          <g data-part="armRight"><Piece name="arm-right" /></g>
        </g>
      </g>
    </svg>
  )
})

export default Castor
