import { useLanguage } from '../context/LanguageContext'

const icons = ['bi-display', 'bi-server', 'bi-tools']

function SkillCard({ skill, icon, index }) {
  return (
    <div className="skill-card" data-tilt>
      <div className="skill-card__top">
        <div className="skill-card__icon">
          <i className={`bi ${icon}`} aria-hidden="true" />
        </div>
        <span className="skill-card__num">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3 className="skill-card__title">{skill.title}</h3>
      <ul className="skill-card__items">
        {skill.items.map((item, j) => <li key={j}>{item}</li>)}
      </ul>
      <div className="skill-card__tags">
        {skill.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
      </div>
    </div>
  )
}

export default function Especialidades() {
  const { t } = useLanguage()
  const s = t.skills
  const skills = [s.fullstack, s.backend, s.tools]

  return (
    <section id="especialidades" className="section">
      <div className="interface">
        <div className="section-header">
          <p className="eyebrow" data-scramble>{s.eyebrow}</p>
          <h2 className="section-title" data-split="lines">{s.title} <span>{s.titleHighlight}</span></h2>
        </div>
        <div className="skill-grid" data-batch>
          {skills.map((skill, i) => (
            <SkillCard key={skill.title} skill={skill} icon={icons[i]} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
