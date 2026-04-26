import { useEffect, useRef } from 'react'

export function useReveal(threshold = 0.15, repeat = false) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          if (!repeat) observer.disconnect()
        } else if (repeat) {
          el.classList.remove('visible')
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, repeat])

  return ref
}
