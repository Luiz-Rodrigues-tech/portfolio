import Header from '../components/Header'
import Footer from '../components/Footer'
import StarField from '../components/StarField'
import { useReveal } from '../hooks/useReveal'

const projects = [
  {
    number: '01',
    name: 'Rejuvenece Estética',
    description: 'Site completo desenvolvido para uma clínica estética com catálogo de procedimentos, galeria de resultados e agendamento online — tudo com foco em conversão e apresentação da marca.',
    whatIDid: 'Desenvolvi a interface completa, estruturei as seções, implementei a galeria de resultados e integrei o sistema de agendamento com foco em responsividade e experiência do usuário.',
    tags: ['Laravel', 'Vue.js', 'Tailwind CSS'],
    live: 'https://rejuvenesceestetica.com.br',
    image: '/pdf/Rejuvenesce.png',
    hasImage: true,
  },
  {
    number: '02',
    name: 'Equali Consultoria',
    description: 'Site institucional desenvolvido para apresentar a consultoria, seus serviços e facilitar o contato com clientes de forma clara, profissional e responsiva.',
    whatIDid: 'Desenvolvi a interface, estruturei as seções da página, organizei a navegação e implementei o layout com foco em responsividade e apresentação da marca.',
    tags: ['React', 'JavaScript', 'CSS'],
    live: 'https://red-chough-671278.hostingersite.com',
    image: '/pdf/Equali_Consultoria.png',
    hasImage: true,
  },
  {
    number: '03',
    name: 'Sistema Web Administrativo',
    description: 'Sistema voltado para gestão interna e organização de informações, com foco em usabilidade, integração com back-end e suporte à operação do negócio.',
    whatIDid: 'Atuei na construção das telas, integração com APIs, ajustes de fluxo, correção de bugs e melhoria contínua da aplicação em ambiente profissional.',
    tags: ['Laravel', 'Vue.js', 'Tailwind CSS', 'MySQL'],
    live: null,
    image: null,
    hasImage: false,
  },
  {
    number: '04',
    name: 'Integração de APIs e Back-end',
    description: 'Projeto focado na comunicação entre sistemas, criação de rotas e tratamento de dados para garantir integrações consistentes entre aplicações.',
    whatIDid: 'Desenvolvi APIs RESTful, organizei controllers e regras de negócio, tratei validações e estruturei a integração entre front-end e back-end.',
    tags: ['PHP', 'Laravel', 'PostgreSQL', 'APIs RESTful'],
    live: null,
    image: null,
    hasImage: false,
  },
]

function ProjectPlaceholder({ number, name }) {
  return (
    <div className="proj-placeholder">
      <span className="proj-placeholder__number">{number}</span>
      <span className="proj-placeholder__name">{name}</span>
    </div>
  )
}

function ProjectBlock({ project, index }) {
  const imgRef  = useReveal(0.08, true)
  const infoRef = useReveal(0.08, true)
  const isEven  = index % 2 === 1
  // projetos pares: visual à esquerda, info à direita → visual desliza da esquerda
  // projetos ímpares (reverse): visual à direita, info à esquerda → invertido
  const visualAnim = isEven ? 'reveal-right' : 'reveal-left'
  const infoAnim   = isEven ? 'reveal-left'  : 'reveal-right'
  const delay      = `${index * 0.05}s`

  return (
    <article className={`proj-block ${isEven ? 'proj-block--reverse' : ''}`}>
      <div
        ref={imgRef}
        className={`proj-block__visual ${visualAnim}`}
        style={{ transitionDelay: delay }}
      >
        {project.hasImage ? (
          <div className="proj-block__img-wrap">
            <img src={project.image} alt={project.name} />
            <div className="proj-block__img-overlay" />
          </div>
        ) : (
          <ProjectPlaceholder number={project.number} name={project.name} />
        )}
      </div>

      <div
        ref={infoRef}
        className={`proj-block__info ${infoAnim}`}
        style={{ transitionDelay: `${index * 0.05 + 0.1}s` }}
      >
        <span className="proj-block__number">{project.number}</span>
        <h2 className="proj-block__name">{project.name}</h2>
        <p className="proj-block__desc">{project.description}</p>

        <div className="proj-block__whatidid">
          <span className="proj-block__label">O que eu fiz</span>
          <p>{project.whatIDid}</p>
        </div>

        <div className="proj-block__tags">
          {project.tags.map(tag => (
            <span className="tag" key={tag}>{tag}</span>
          ))}
        </div>

        {project.live && (
          <div className="proj-block__actions">
            <a href={project.live} target="_blank" rel="noreferrer" className="btn-primary">
              <i className="bi bi-box-arrow-up-right" /> Ver projeto
            </a>
          </div>
        )}
      </div>
    </article>
  )
}

export default function ProjetosPage() {
  const headerRef = useReveal(0.1)

  return (
    <>
      <StarField />
      <Header />
      <main id="projetos" className="projetos-page">
        <div className="interface">

          <div ref={headerRef} className="projetos-page__header reveal">
            <h1 className="section-title">Projetos em <span>destaque</span></h1>
            <p className="projetos-page__subtitle">
              Projetos e soluções que desenvolvi com foco em aplicações web, integrações e evolução de sistemas, unindo interface, lógica de negócio e manutenção prática.
            </p>
          </div>

          <div className="projetos-page__list">
            {projects.map((project, i) => (
              <ProjectBlock key={i} project={project} index={i} />
            ))}
          </div>

          <div className="projetos-page__closing">
            <p>
              Cada projeto apresentado aqui reflete minha forma de trabalhar: entender o problema, estruturar a solução e desenvolver aplicações que funcionem bem na prática, do front ao back-end.
            </p>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
