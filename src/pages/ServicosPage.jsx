import { useLanguage } from '../context/LanguageContext'

const serviceMeta = [
  { icon: 'bi-display', tags: ['React', 'Vue.js', 'TypeScript', 'Tailwind CSS', 'JavaScript'] },
  { icon: 'bi-server', tags: ['PHP', 'Laravel', 'MySQL', 'PostgreSQL', 'APIs RESTful'] },
  { icon: 'bi-diagram-3', tags: ['APIs RESTful', 'JSON', 'HTTP', 'Laravel', 'Node.js'] },
  { icon: 'bi-tools', tags: ['PHP', 'JavaScript', 'Laravel', 'Vue.js', 'React', 'SQL'] },
  { icon: 'bi-layers', tags: ['Full Stack', 'APIs', 'Laravel', 'React', 'Vue.js', 'MySQL'] },
]

function ServiceCard({ service, meta, index, whatIDo }) {
  return (
    <div className="skill-card" data-tilt>
      <div className="skill-card__top">
        <div className="skill-card__icon">
          <i className={`bi ${meta.icon}`} aria-hidden="true" />
        </div>
        <span className="skill-card__num">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <h2 className="skill-card__title">{service.title}</h2>
      <p className="skill-card__desc">{service.description}</p>
      <div className="skill-card__section-label">{whatIDo}</div>
      <ul className="skill-card__items">
        {service.items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
      <div className="skill-card__tags">
        {meta.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
      </div>
    </div>
  )
}

export default function ServicosPage() {
  const { t } = useLanguage()
  const s = t.servicesPage

  return (
    <main id="servicos" className="page">
      <div className="interface">
        <header className="page-head">
          <p className="eyebrow" data-scramble>{s.eyebrow}</p>
          <h1 className="page-title" data-split="chars">{s.title} <span>{s.titleHighlight}</span></h1>
          <p className="section-lead" data-split="lines">{s.subtitle}</p>
        </header>

        <div className="servicos-grid" data-batch>
          {s.items.map((service, i) => (
            <ServiceCard key={service.title} service={service} meta={serviceMeta[i]} index={i} whatIDo={s.whatIDo} />
          ))}
        </div>

        <div className="page-cta">
          <p data-scrub-words>{s.cta}</p>
          <div data-reveal="scale" data-magnetic="0.25">
            <a href="https://wa.me/5565993219244" target="_blank" rel="noopener noreferrer" className="btn-primary">
              <i className="bi bi-whatsapp" aria-hidden="true" /> {s.ctaButton}
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
