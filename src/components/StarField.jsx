import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'

// 3 camadas com velocidades diferentes para efeito de profundidade
function createLayer(count, w, h, rMin, rMax, depth) {
  return {
    depth,
    stars: Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * (rMax - rMin) + rMin,
      base: Math.random() * 0.5 + 0.3,
      speed: Math.random() * 1.6 + 0.4,
      offset: Math.random() * Math.PI * 2,
    })),
  }
}

export default function StarField() {
  const canvasRef = useRef(null)

  useGSAP(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduced = prefersReducedMotion()
    const pointer = { x: 0, y: 0 }
    const meteor = { x: 0, y: 0, tail: 0, alpha: 0 }
    let layers = []
    let width = 0
    let height = 0
    let lastWidth = 0
    let lastScroll = window.scrollY
    let scrollVel = 0
    let scrollAccum = 0

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // No celular a barra de endereço muda só a altura; manter as estrelas evita o salto
      if (width !== lastWidth) {
        const density = Math.min(1, width / 1400)
        layers = [
          createLayer(Math.round(110 * density), width, height * 1.2, 0.15, 0.55, 0.1),
          createLayer(Math.round(65 * density), width, height * 1.2, 0.4, 0.9, 0.25),
          createLayer(Math.round(28 * density), width, height * 1.2, 0.8, 1.4, 0.5),
        ]
        lastWidth = width
      }
    }

    function draw(time = 0) {
      const scroll = window.scrollY
      scrollVel += scroll - lastScroll
      lastScroll = scroll
      scrollAccum += scrollVel * 0.15
      scrollVel *= 0.85

      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#fff'

      for (const layer of layers) {
        const wrap = height * 1.2
        for (const s of layer.stars) {
          const y = ((s.y - scrollAccum * layer.depth - pointer.y * layer.depth) % wrap + wrap) % wrap
          const x = s.x - pointer.x * layer.depth
          ctx.globalAlpha = Math.min(1, Math.max(0, s.base + Math.sin(time * s.speed + s.offset) * s.base * 0.4))
          ctx.beginPath()
          ctx.arc(x, y, s.r, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      if (meteor.alpha > 0) {
        const gradient = ctx.createLinearGradient(meteor.x, meteor.y, meteor.x - meteor.tail, meteor.y - meteor.tail * 0.45)
        gradient.addColorStop(0, `rgba(170,240,236,${meteor.alpha})`)
        gradient.addColorStop(1, 'rgba(170,240,236,0)')
        ctx.globalAlpha = 1
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.moveTo(meteor.x, meteor.y)
        ctx.lineTo(meteor.x - meteor.tail, meteor.y - meteor.tail * 0.45)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }

    resize()
    draw()

    if (reduced) {
      const redraw = () => { resize(); draw() }
      window.addEventListener('resize', redraw)
      return () => window.removeEventListener('resize', redraw)
    }

    const shoot = () => {
      const fromX = gsap.utils.random(width * 0.1, width * 0.7)
      const fromY = gsap.utils.random(0, height * 0.4)
      gsap.timeline({ onComplete: () => gsap.delayedCall(gsap.utils.random(7, 16), shoot) })
        .set(meteor, { x: fromX, y: fromY, tail: 0, alpha: 0 })
        .to(meteor, { x: fromX + 520, y: fromY + 234, duration: 1, ease: 'power1.in' }, 0)
        .to(meteor, { tail: 130, alpha: 0.9, duration: 0.35, ease: 'none' }, 0)
        .to(meteor, { alpha: 0, duration: 0.35, ease: 'none' }, 0.65)
    }
    gsap.delayedCall(4, shoot)

    const toPX = gsap.quickTo(pointer, 'x', { duration: 1.6, ease: 'power3' })
    const toPY = gsap.quickTo(pointer, 'y', { duration: 1.6, ease: 'power3' })
    const onPointer = (e) => {
      toPX((e.clientX / width - 0.5) * 60)
      toPY((e.clientY / height - 0.5) * 60)
    }

    gsap.ticker.add(draw)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointer, { passive: true })

    return () => {
      gsap.ticker.remove(draw)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
    }
  })

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />
}
