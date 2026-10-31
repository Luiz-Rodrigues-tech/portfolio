import { useRef } from 'react'
import { gsap, useGSAP, POINTER_OK } from '../lib/gsap'

const INTERACTIVE = 'a, button, input, textarea, label, [data-cursor]'

export default function Cursor() {
  const ring = useRef(null)
  const dot = useRef(null)
  const label = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(POINTER_OK, () => {
      gsap.set([ring.current, dot.current], { xPercent: -50, yPercent: -50, opacity: 0 })
      const ringX = gsap.quickTo(ring.current, 'x', { duration: 0.55, ease: 'power3' })
      const ringY = gsap.quickTo(ring.current, 'y', { duration: 0.55, ease: 'power3' })
      const dotX = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' })
      const dotY = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' })

      const move = (e) => {
        ringX(e.clientX)
        ringY(e.clientY)
        dotX(e.clientX)
        dotY(e.clientY)
        gsap.to([ring.current, dot.current], { opacity: 1, duration: 0.3, overwrite: 'auto' })
      }
      const over = (e) => {
        const target = e.target.closest?.(INTERACTIVE)
        const text = target?.closest('[data-cursor]')?.dataset.cursor
        label.current.textContent = text ?? ''
        gsap.to(ring.current, {
          scale: text ? 2.6 : target ? 1.7 : 1,
          '--ring-fill': text ? 1 : 0,
          duration: 0.45,
          overwrite: 'auto',
        })
        gsap.to(dot.current, { scale: target ? 0 : 1, duration: 0.3, overwrite: 'auto' })
      }
      const leave = () => gsap.to([ring.current, dot.current], { opacity: 0, duration: 0.3, overwrite: 'auto' })

      window.addEventListener('pointermove', move)
      document.addEventListener('pointerover', over)
      document.documentElement.addEventListener('pointerleave', leave)
      return () => {
        window.removeEventListener('pointermove', move)
        document.removeEventListener('pointerover', over)
        document.documentElement.removeEventListener('pointerleave', leave)
      }
    })
    return () => mm.revert()
  })

  return (
    <div aria-hidden="true">
      <div className="cursor-ring" ref={ring}><span ref={label} /></div>
      <div className="cursor-dot" ref={dot} />
    </div>
  )
}
