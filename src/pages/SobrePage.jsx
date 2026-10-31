import { useLanguage } from '../context/LanguageContext'

const techMeta = [
  { icon: 'bi-display', tags: ['React', 'Vue.js', 'TypeScript', 'Tailwind CSS', 'JavaScript'] },
  { icon: 'bi-server', tags: ['PHP', 'Laravel', 'APIs RESTful', 'Node.js'] },
  { icon: 'bi-database', tags: ['MySQL', 'PostgreSQL'] },
  { icon: 'bi-tools', tags: ['Git', 'GitHub', 'Postman', 'Jira', 'Trello'] },
]

const processIcons = ['bi-search', 'bi-diagram-2', 'bi-code-slash', 'bi-arrow-repeat']

const timelineMeta = [
  { type: 'formacao', period: (a) => `2022 — ${a.present}`, institution: 'FATEC SENAI Mato Grosso' },
  { type: 'curso', period: () => '2024', institution: 'Node Studio' },
  { type: 'curso', period: () => '2024', institution: 'Time to Code' },
  { type: 'curso', period: () => '2023', institution: 'Infinity Big Data' },
  { type: 'curso', period: () => '2023', institution: 'FATEC SENAI MT' },
  { type: 'curso', period: () => '2023', institution: 'FATEC SENAI MT' },
]

function TimelineItem({ item, meta, labels }) {
  return (
    <div className="exp-card">
      <div className="exp-left" data-reveal="left">
        <span className="exp-period">{meta.period(labels)}</span>
        <span className="sobre-timeline-label">
          {meta.type === 'formacao' ? labels.labelEducation : labels.labelCourse}
        </span>
      </div>
      <div className="exp-divider">
        <div className={`exp-dot ${meta.type === 'formacao' ? 'exp-dot--accent' : ''}`} data-pop />
      </div>
      <div className="exp-right" data-reveal="right">
        <h3 className="exp-role">{item.title}</h3>
        <p className="exp-company">{meta.institution}</p>
        <p className="sobre-timeline-desc">{item.description}</p>
      </div>
    </div>
  )
}

export default function SobrePage() {
  const { t } = useLanguage()
  const a = t.aboutPage

  return (
    <main id="sobre" className="page">
      <div className="interface">

        <div className="sobre-intro">
          <div className="sobre-intro__text">
            <p className="eyebrow" data-scramble>{a.eyebrow}</p>
            <h1 className="page-title" data-split="chars">{a.title} <span>{a.titleHighlight}</span></h1>
            {a.intro.map((paragraph) => <p key={paragraph} data-split="lines">{paragraph}</p>)}
          </div>
          <div className="sobre-intro__photo" data-clip>
            <img src="/img/optimized/foto-sobre.webp" alt="Luiz Henrique" width="720" height="1046" />
          </div>
        </div>

        <section className="sobre-section">
          <span className="rule" data-grow-rule />
          <p className="eyebrow" data-scramble>{a.processEyebrow}</p>
          <h2 className="section-title" data-split="lines">{a.processTitle} <span>{a.processHighlight}</span></h2>
          <div className="process-grid" data-batch>
            {a.process.map((step, i) => (
              <div key={step.title} className="process-card" data-tilt>
                <div className="process-card__top">
                  <span className="process-card__num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="process-card__icon">
                    <i className={`bi ${processIcons[i]}`} aria-hidden="true" />
                  </div>
                </div>
                <h3 className="process-card__title">{step.title}</h3>
                <p className="process-card__desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="sobre-section">
          <span className="rule" data-grow-rule />
          <p className="eyebrow" data-scramble>{a.techEyebrow}</p>
          <h2 className="section-title" data-split="lines">{a.techTitle} <span>{a.techHighlight}</span></h2>
          <p className="section-lead" data-split="lines">{a.techSubtitle}</p>
          <div className="tech-cards-grid" data-batch>
            {a.tech.map((group, i) => (
              <div key={group.category} className="tech-card" data-tilt>
                <div className="tech-card__icon">
                  <i className={`bi ${techMeta[i].icon}`} aria-hidden="true" />
                </div>
                <div className="tech-card__header">
                  <h3 className="tech-card__title">{group.category}</h3>
                  <p className="tech-card__desc">{group.desc}</p>
                </div>
                <div className="tech-card__tags" data-stagger>
                  {techMeta[i].tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="sobre-section">
          <span className="rule" data-grow-rule />
          <p className="eyebrow" data-scramble>{a.timelineEyebrow}</p>
          <h2 className="section-title" data-split="lines">{a.timelineTitle} <span>{a.timelineHighlight}</span></h2>
          <div className="exp-list">
            <span className="exp-list__line" data-grow-line aria-hidden="true" />
            {a.timeline.map((item, i) => (
              <TimelineItem key={item.title} item={item} meta={timelineMeta[i]} labels={a} />
            ))}
          </div>
        </section>

        <section className="sobre-closing">
          {a.closing.map((paragraph) => <p key={paragraph} data-scrub-words>{paragraph}</p>)}
          <div data-reveal="scale" data-magnetic="0.25">
            <a href="https://wa.me/5565993219244" target="_blank" rel="noopener noreferrer" className="btn-primary">
              <i className="bi bi-whatsapp" aria-hidden="true" /> {a.closingButton}
            </a>
          </div>
        </section>

      </div>
    </main>
  )
}
