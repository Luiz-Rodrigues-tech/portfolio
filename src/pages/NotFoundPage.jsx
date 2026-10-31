import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function NotFoundPage() {
  const { t } = useLanguage()
  const n = t.notFound

  return (
    <main className="page not-found">
      <div className="interface">
        <p className="not-found__code" data-scramble>404</p>
        <h1 className="section-title" data-split="lines">{n.title} <span>{n.titleHighlight}</span></h1>
        <p className="section-lead" data-split="lines">{n.text}</p>
        <div data-reveal="up" data-delay="0.2">
          <Link to="/" className="btn-primary">{n.back} <i className="bi bi-arrow-right" aria-hidden="true"></i></Link>
        </div>
      </div>
    </main>
  )
}
