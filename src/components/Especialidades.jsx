import { useLanguage } from '../context/LanguageContext'
import { useReveal } from '../hooks/useReveal'

const icons = ['bi-display', 'bi-server', 'bi-tools']

function SkillCard({ skill, icon, delay }) {
  const ref = useReveal(0.1)
  return (
    <div ref={ref} className="skill-card reveal" style={{ transitionDelay: `${delay}s` }}>
      <div className="skill-card__icon">
        <i className={`bi ${icon}`} />
      </div>
      <h3 className="skill-card__title">{skill.title}</h3>
      <div className="skill-card__tags">
        {skill.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}
      </div>
      <ul className="skill-card__items">
        {skill.items.map((item, j) => <li key={j}>{item}</li>)}
      </ul>
    </div>
  )
}

export default function Especialidades() {
  const { t } = useLanguage()
  const s = t.skills
  const titleRef = useReveal()
  const skills = [s.fullstack, s.backend, s.tools]

  return (
    <section id="especialidades" className="especialidades">
      <div className="interface">
        <div ref={titleRef} className="section-header reveal">
          <h2 className="section-title">{s.title} <span>{s.titleHighlight}</span></h2>
        </div>
        <div className="skill-grid">
          {skills.map((skill, i) => (
            <SkillCard key={i} skill={skill} icon={icons[i]} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}
