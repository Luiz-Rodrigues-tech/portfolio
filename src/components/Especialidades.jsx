import { useLanguage } from '../context/LanguageContext'
import { useReveal } from '../hooks/useReveal'

function Especialidades() {
  const { t } = useLanguage()
  const s = t.skills
  const titleRef = useReveal()
  const boxRef   = useReveal(0.1)

  return (
    <section id="especialidades" className="especialidades">
      <div className="interface">
        <h2
          ref={titleRef}
          className="section-title reveal"
        >
          {s.title.toUpperCase()} <span>{s.titleHighlight.toUpperCase()}</span>
        </h2>
        <div ref={boxRef} className="especialidades-flex reveal">
          <div className="especialidades-box">
            <h3>{s.fullstack.title}</h3>
            <p>{s.fullstack.desc}</p>
          </div>
          <div className="especialidades-box2">
            <h3>{s.backend.title}</h3>
            <p>{s.backend.desc}</p>
          </div>
          <div className="especialidades-box">
            <h3>{s.tools.title}</h3>
            <p>{s.tools.desc}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Especialidades
