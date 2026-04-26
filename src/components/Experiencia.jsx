import { useLanguage } from '../context/LanguageContext'
import { useReveal } from '../hooks/useReveal'

const experiences = [
  {
    role: 'Desenvolvedor Full Stack',
    company: 'Projetos Independentes · Freelance',
    period: '2024 — Presente',
    tags: ['Laravel', 'Vue.js', 'React', 'MySQL','Tailwind CSS'],
    items: [
      'Desenvolvimento de sistemas web completos, da interface à lógica de back-end',
      'Construção de APIs RESTful com Laravel e interfaces responsivas com Vue.js e Tailwind CSS',
      'Integração entre front-end e back-end com foco em consistência e performance',
      'Modelagem de bancos de dados MySQL e PostgreSQL',
      'Aplicação de boas práticas: validação, segurança de APIs e organização de código',
    ],
  },
  {
    role: 'Desenvolvedor Full Stack',
    company: 'Smart Finantech',
    period: '2025 - 2026',
    tags: ['Laravel', 'Vue.js', 'Tailwind CSS', 'MySQL'],
    items: [
      'Atuação end-to-end no desenvolvimento e manutenção de sistemas web',
      'Implementação de funcionalidades completas a partir de interfaces definidas pelo time de UX',
      'Desenvolvimento de APIs RESTful com Laravel e interfaces com Vue.js e Tailwind CSS',
      'Integração entre front-end e back-end com modelagem de bancos de dados',
      'Melhorias de performance, correção de bugs e versionamento com Git',
    ],
  },
  {
    role: 'Analista de Suporte Técnico N2',
    company: 'Brasil TecPar',
    period: '2023 — 2026',
    tags: ['Zabbix', 'Grafana', 'Redes', 'SLA'],
    items: [
      'Troubleshooting avançado de sistemas e redes com análise de causa raiz (RCA)',
      'Monitoramento de serviços com Zabbix e Grafana garantindo disponibilidade e desempenho',
      'Atendimento escalado conforme SLA e elaboração de documentação técnica',
    ],
  },
]

function ExpCard({ exp, delay }) {
  const ref = useReveal(0.1)
  return (
    <div ref={ref} className="exp-card reveal" style={{ transitionDelay: `${delay}s` }}>
      <div className="exp-left">
        <span className="exp-period">{exp.period}</span>
        <div className="exp-tags">
          {exp.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}
        </div>
      </div>
      <div className="exp-divider">
        <div className="exp-dot" />
        <div className="exp-line" />
      </div>
      <div className="exp-right">
        <h3 className="exp-role">{exp.role}</h3>
        <p className="exp-company">{exp.company}</p>
        <ul className="exp-items">
          {exp.items.map((item, j) => <li key={j}>{item}</li>)}
        </ul>
      </div>
    </div>
  )
}

export default function Experiencia() {
  const { t } = useLanguage()
  const titleRef   = useReveal()

  return (
    <section id="experiencia" className="experiencia">
      <div className="interface">
        <div ref={titleRef} className="section-header reveal">
          <h2 className="section-title">
            Meu <span>{t.nav.curriculo ?? 'Currículo'}</span>
          </h2>
        </div>

        <div className="exp-list">
          {experiences.map((exp, i) => (
            <ExpCard key={i} exp={exp} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  )
}
