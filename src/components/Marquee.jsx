import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from '../lib/gsap'

const stack = ['React', 'Vue.js', 'Laravel', 'PHP', 'TypeScript', 'Tailwind CSS', 'Node.js', 'MySQL', 'PostgreSQL', 'APIs RESTful', 'Git']

function Group({ hidden }) {
  return (
    <ul className="marquee__group" aria-hidden={hidden || undefined}>
      {stack.map((item) => (
        <li key={item}>{item}<span className="marquee__sep" aria-hidden="true">✦</span></li>
      ))}
    </ul>
  )
}

export default function Marquee() {
  const scope = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const track = scope.current.querySelector('.marquee__track')
      const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 })
      const skew = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3' })

      // A velocidade da rolagem acelera a faixa e inclina o texto
      ScrollTrigger.create({
        trigger: scope.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const velocity = self.getVelocity()
          skew(gsap.utils.clamp(-10, 10, velocity / 220))
          gsap.timeline({ overwrite: true })
            .to(loop, { timeScale: gsap.utils.clamp(-6, 6, velocity / 200) || 1, duration: 0.25, ease: 'none' })
            .to(loop, { timeScale: self.direction, duration: 1.2, ease: 'power2.out' })
        },
      })
    })
    return () => mm.revert()
  }, { scope })

  return (
    <div className="marquee" ref={scope}>
      <div className="marquee__track">
        <Group />
        <Group hidden />
      </div>
    </div>
  )
}
