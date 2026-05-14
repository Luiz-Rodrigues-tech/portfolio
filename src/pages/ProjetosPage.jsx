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
    name: 'Leonel Gessos',
    description: 'Site desenvolvido para empresa de aplicação de gesso, apresentando os serviços, portfólio de obras e facilitando o contato com clientes.',
    whatIDid: 'Desenvolvi a interface completa, estruturei as seções de serviços e portfólio, e implementei o layout com foco em conversão e apresentação visual dos trabalhos.',
    tags: ['Laravel', 'Vue.js', 'Tailwind CSS'],
    live: 'https://leonelgesso.com.br',
    image: '/pdf/Leonel_Gessos.png',
    hasImage: true,
  },
  {
    number: '03',
    name: 'Equali Consultoria',
    description: 'Site institucional desenvolvido para apresentar a consultoria, seus serviços e facilitar o contato com clientes de forma clara, profissional e responsiva.',
    whatIDid: 'Desenvolvi a interface, estruturei as seções da página, organizei a navegação e implementei o layout com foco em responsividade e apresentação da marca.',
    tags: ['React', 'JavaScript', 'CSS'],
    live: 'https://red-chough-671278.hostingersite.com',
    image: '/pdf/Equali_Consultoria.png',
    hasImage: true,
  },
  {
    number: '04',
    name: 'Izadora — Portfólio',
    description: 'Portfólio pessoal desenvolvido para apresentar trabalhos criativos de forma elegante, com navegação fluida e foco na experiência visual.',
    whatIDid: 'Desenvolvi o layout do portfólio, estruturei as seções de apresentação e projetos, e implementei a navegação com foco em identidade visual e responsividade.',
    tags: ['React', 'JavaScript', 'CSS'],
    live: 'https://izadoraportfolio.com',
    image: '/pdf/Izadora.png',
    hasImage: true,
  },
  {
    number: '05',
    name: 'English Fast',
    description: 'Plataforma desenvolvida para escola de idiomas, com apresentação de cursos, diferenciais e chamada para conversão de novos alunos.',
    whatIDid: 'Desenvolvi a interface completa, estruturei as seções de cursos e diferenciais, e implementei o layout responsivo com foco em atração e conversão de alunos.',
    tags: ['React', 'JavaScript', 'CSS'],
    live: 'https://lightcoral-caterpillar-755231.hostingersite.com',
    image: '/pdf/EnglishFast.png',
    hasImage: true,
  },
]

function ProjectBlock({ project, index }) {
  const imgRef  = useReveal(0.01)
  const infoRef = useReveal(0.05)
  const isEven  = index % 2 === 1
  const infoAnim = isEven ? 'reveal-left' : 'reveal-right'

  return (
    <article className={`proj-block ${isEven ? 'proj-block--reverse' : ''}`}>
      <div ref={imgRef} className="proj-block__visual reveal">
        <div className="proj-block__img-wrap">
          <img src={project.image} alt={project.name} />
          <div className="proj-block__img-overlay" />
        </div>
      </div>

      <div
        ref={infoRef}
        className={`proj-block__info ${infoAnim}`}
        style={{ transitionDelay: '0.12s' }}
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
