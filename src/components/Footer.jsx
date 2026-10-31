import { useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { gsap, useGSAP, SplitText, MOTION_OK, scrollToTarget } from '../lib/gsap'
import { useLanguage } from '../context/LanguageContext'

const links = [
  { to: '/', key: 'inicio' },
  { to: '/sobre', key: 'sobre' },
  { to: '/projetos', key: 'projetos' },
  { to: '/servicos', key: 'especialidades' },
  { to: '/contato', key: 'contato' },
]

function Footer() {
  const { t } = useLanguage()
  const { pathname } = useLocation()
  const f = t.footer
  const scope = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const giant = SplitText.create('.footer-giant', { type: 'chars', mask: 'chars' })
      gsap.from(giant.chars, {
        yPercent: 110,
        stagger: 0.03,
        ease: 'none',
        scrollTrigger: {
          trigger: '.footer-giant',
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1,
        },
      })
      gsap.from('.footer-cta__arrow', {
        rotate: -45,
        scale: 0.5,
        ease: 'none',
        scrollTrigger: { trigger: '.footer-cta', start: 'top 90%', end: 'bottom 60%', scrub: 1 },
      })
    })
    return () => mm.revert()
  }, { scope })

  const toTopIfSame = (to) => {
    if (pathname === to) scrollToTarget(null)
  }

  return (
    <footer ref={scope}>
      <div className="interface">
        <Link to="/contato" className="footer-cta" onClick={() => toTopIfSame('/contato')} data-magnetic="0.06">
          <span className="footer-cta__eyebrow" data-scramble>{f.ctaEyebrow}</span>
          <span className="footer-cta__line">
            <span className="footer-cta__text" data-split="chars">{f.cta}</span>
            <span className="footer-cta__arrow" aria-hidden="true"><i className="bi bi-arrow-up-right"></i></span>
          </span>
        </Link>
      </div>

      <div className="interface footer-inner">
        <div className="footer-brand" data-reveal="up">
          <p>{f.description}</p>
          <div className="footer-social" data-stagger>
            <a href="https://github.com/Luiz-Rodrigues-tech" target="_blank" rel="noopener noreferrer" aria-label="GitHub" data-magnetic="0.4">
              <i className="bi bi-github" aria-hidden="true"></i>
            </a>
            <a href="https://www.linkedin.com/in/luiz-rodrigues-tech" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" data-magnetic="0.4">
              <i className="bi bi-linkedin" aria-hidden="true"></i>
            </a>
            <a href="mailto:luizhhuu@gmail.com" aria-label="E-mail" data-magnetic="0.4">
              <i className="bi bi-envelope" aria-hidden="true"></i>
            </a>
          </div>
        </div>

        <div className="footer-nav" data-reveal="up" data-delay="0.08">
          <h2>{f.nav}</h2>
          <ul>
            {links.map((link) => (
              <li key={link.to}>
                <Link to={link.to} onClick={() => toTopIfSame(link.to)}>{t.nav[link.key]}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-contact" data-reveal="up" data-delay="0.16">
          <h2>{f.contact}</h2>
          <p><a href="mailto:luizhhuu@gmail.com"><i className="bi bi-envelope" aria-hidden="true"></i> luizhhuu@gmail.com</a></p>
          <p>
            <a href="https://wa.me/5565993219244" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-whatsapp" aria-hidden="true"></i> +55 (65) 99321-9244
            </a>
          </p>
          <p><i className="bi bi-geo-alt" aria-hidden="true"></i> {f.location}</p>
        </div>
      </div>

      <div className="footer-giant" aria-hidden="true">Luiz Henrique</div>

      <div className="footer-bottom">
        <div className="interface footer-bottom__row">
          <p>© {new Date().getFullYear()} Luiz Henrique. {f.rights}</p>
          <button type="button" className="footer-top" onClick={() => scrollToTarget(null)} data-magnetic="0.3">
            {t.a11y.backToTop} <i className="bi bi-arrow-up" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
