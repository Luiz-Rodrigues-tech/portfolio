import { useLanguage } from '../context/LanguageContext'

function Footer() {
  const { t } = useLanguage()
  const f = t.footer
  const nav = t.nav

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer>
      <div className="interface footer-inner">
        <div className="footer-brand">
          <button className="footer-logo" onClick={() => scrollTo('inicio')}>
            Luiz <span style={{ color: 'var(--accent)' }}>Henrique</span>
          </button>
          <p>{f.description}</p>
          <div className="footer-social">
            <a href="https://github.com/Luiz-Rodrigues-tech" target="_blank" rel="noreferrer" aria-label="GitHub">
              <i className="bi bi-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/luiz-rodrigues-tech" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <i className="bi bi-linkedin"></i>
            </a>
            <a href="mailto:luizhhuu@gmail.com" aria-label="E-mail">
              <i className="bi bi-envelope"></i>
            </a>
          </div>
        </div>

        <div className="footer-nav">
          <h4>{f.nav}</h4>
          <ul>
            <li><button onClick={() => scrollTo('inicio')}>{nav.inicio}</button></li>
            <li><button onClick={() => scrollTo('sobre')}>{nav.sobre}</button></li>
            <li><button onClick={() => scrollTo('projetos')}>{nav.projetos}</button></li>
            <li><button onClick={() => scrollTo('especialidades')}>{nav.especialidades}</button></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>{f.contact}</h4>
          <p><i className="bi bi-envelope"></i> luizhhuu@gmail.com</p>
          <p>
            <a href="https://wa.me/5565993219244" target="_blank" rel="noreferrer">
              <i className="bi bi-whatsapp"></i> +55 (65) 99321-9244
            </a>
          </p>
          <p><i className="bi bi-geo-alt"></i> Brasil</p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="interface">
          <p>© {new Date().getFullYear()} Luiz Henrique. {f.rights}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
