import Header from '../components/Header'
import Footer from '../components/Footer'
import StarField from '../components/StarField'
import { useReveal } from '../hooks/useReveal'

const services = [
  {
    icon: 'bi-display',
    title: 'Desenvolvimento Front-end',
    description: 'Criação de interfaces web modernas, responsivas e integradas ao back-end, com foco em usabilidade, performance e organização do código.',
    items: [
      'Desenvolvimento de interfaces com React e Vue.js',
      'Integração com APIs RESTful',
      'Componentização e organização de telas',
      'Ajustes de layout e responsividade',
      'Correção de bugs e melhorias visuais',
    ],
    tags: ['React', 'Vue.js', 'TypeScript', 'Tailwind CSS', 'JavaScript'],
  },
  {
    icon: 'bi-server',
    title: 'Desenvolvimento Back-end',
    description: 'Construção da lógica da aplicação, criação de APIs e integração entre sistemas, garantindo estabilidade, organização e escalabilidade.',
    items: [
      'Desenvolvimento de APIs RESTful',
      'Implementação de regras de negócio',
      'Integração com sistemas externos',
      'Modelagem e manipulação de banco de dados',
      'Correção de bugs e melhorias de performance',
    ],
    tags: ['PHP', 'Laravel', 'MySQL', 'PostgreSQL', 'APIs RESTful'],
  },
  {
    icon: 'bi-diagram-3',
    title: 'Integrações e APIs',
    description: 'Conexão entre sistemas e serviços, permitindo troca de dados eficiente e funcionamento integrado entre aplicações.',
    items: [
      'Integração com APIs de terceiros',
      'Tratamento e validação de dados',
      'Organização de rotas e endpoints',
      'Correção de falhas de integração',
      'Otimização de fluxo entre sistemas',
    ],
    tags: ['APIs RESTful', 'JSON', 'HTTP', 'Laravel', 'Node.js'],
  },
  {
    icon: 'bi-tools',
    title: 'Manutenção e Evolução de Sistemas',
    description: 'Análise, correção e melhoria contínua de sistemas já existentes, garantindo funcionamento estável e evolução do produto.',
    items: [
      'Correção de bugs',
      'Refatoração de código',
      'Melhorias de performance',
      'Ajustes em funcionalidades existentes',
      'Suporte técnico em aplicações web',
    ],
    tags: ['PHP', 'JavaScript', 'Laravel', 'Vue.js', 'React', 'SQL'],
  },
  {
    icon: 'bi-layers',
    title: 'Desenvolvimento de Sistemas Web',
    description: 'Desenvolvimento completo de aplicações web, da interface ao back-end, com foco em soluções funcionais e bem estruturadas.',
    items: [
      'Desenvolvimento end-to-end',
      'Estruturação de projetos',
      'Integração front + back',
      'Criação de APIs e interfaces',
      'Organização da arquitetura da aplicação',
    ],
    tags: ['Full Stack', 'APIs', 'Laravel', 'React', 'Vue.js', 'MySQL'],
  },
]

function ServiceCard({ service, delay }) {
  const ref = useReveal(0.08)
  return (
    <div ref={ref} className="skill-card reveal" style={{ transitionDelay: `${delay}s` }}>
      <div className="skill-card__icon">
        <i className={`bi ${service.icon}`} />
      </div>
      <h3 className="skill-card__title">{service.title}</h3>
      <p className="skill-card__desc">{service.description}</p>
      <div className="skill-card__section-label">O que eu faço</div>
      <ul className="skill-card__items">
        {service.items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
      <div className="skill-card__tags">
        {service.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}
      </div>
    </div>
  )
}

export default function ServicosPage() {
  const headerRef = useReveal(0.1)
  const ctaRef = useReveal(0.1)

  return (
    <>
      <StarField />
      <Header />
      <main id="servicos" className="servicos-page">
        <div className="interface">

          <div ref={headerRef} className="servicos-page__header reveal">
            <h1 className="section-title">Meus <span>Serviços</span></h1>
            <p className="servicos-page__subtitle">
              Atuo no desenvolvimento web de ponta a ponta — da interface ao back-end — entregando soluções práticas, organizadas e funcionais.
            </p>
          </div>

          <div className="servicos-grid">
            {services.map((s, i) => (
              <ServiceCard key={i} service={s} delay={i * 0.08} />
            ))}
          </div>

          <div ref={ctaRef} className="servicos-cta reveal">
            <p>
              Se você precisa desenvolver um sistema, melhorar uma aplicação existente ou integrar diferentes serviços, posso ajudar na construção de soluções práticas e funcionais.
            </p>
            <a href="https://wa.me/5565993219244" target="_blank" rel="noreferrer" className="btn-primary">
              <i className="bi bi-whatsapp" /> Entre em contato
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
