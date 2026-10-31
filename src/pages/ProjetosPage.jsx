import { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGSAP, ScrollTrigger, scrollToTarget } from '../lib/gsap'
import { usePageMotion } from '../hooks/usePageMotion'
import { useLanguage } from '../context/LanguageContext'
import { featuredProjects, moreProjects } from '../data/projects'
import ProjectShot from '../components/ProjectShot'

function ProjectBlock({ project, text, index, labels }) {
  const reverse = index % 2 === 1

  return (
    <article className={`proj-block ${reverse ? 'proj-block--reverse' : ''}`}>
      <div className="proj-block__visual" data-clip>
        <ProjectShot project={project} title={text.name} viewLabel={labels.view} data-scroll-shot />
      </div>

      <div className="proj-block__info">
        <span className="proj-block__number" aria-hidden="true" data-parallax="30">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h2 className="proj-block__name" data-split="words">{text.name}</h2>
        <p className="proj-block__desc" data-split="lines">{text.description}</p>

        <div className="proj-block__whatidid" data-reveal={reverse ? 'left' : 'right'}>
          <span className="proj-block__label">{labels.whatIDid}</span>
          <p>{text.whatIDid}</p>
        </div>

        <div className="project-tags" data-stagger>
          {project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
        </div>

        {project.live && (
          <div className="proj-block__actions" data-reveal="up" data-magnetic="0.2">
            <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn-primary">
              {labels.view} <i className="bi bi-arrow-up-right" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    </article>
  )
}

// Aberto pelo botão, monta depois da página e precisa ligar as próprias animações.
// Se já chega aberto, monta junto com a página e as animações dela já cobrem este bloco.
function MoreProjects({ labels, openedByClick }) {
  const scope = useRef(null)
  usePageMotion(scope, openedByClick)

  useGSAP(() => {
    if (!openedByClick) return
    ScrollTrigger.refresh()
    scope.current.focus({ preventScroll: true })
    scrollToTarget(scope.current)
  }, { scope })

  return (
    <section className="projetos-more" ref={scope} tabIndex={-1} aria-label={labels.moreTitle}>
      <span className="rule" data-grow-rule />
      <p className="eyebrow" data-scramble>{labels.moreTitle}</p>
      <div className="projetos-list">
        {moreProjects.map((project, i) => (
          <ProjectBlock
            key={project.id}
            project={project}
            text={labels.items[project.id]}
            index={featuredProjects.length + i}
            labels={labels}
          />
        ))}
      </div>
    </section>
  )
}

export default function ProjetosPage() {
  const { t } = useLanguage()
  const p = t.projectsPage
  const location = useLocation()
  const navigate = useNavigate()
  // Quem vem de "Ver mais projetos" na home chega com os extras abertos.
  // Só a chegada conta: um clique depois no menu não fecha a lista.
  const [more, setMore] = useState(() => (location.state?.showMore ? { openedByClick: false } : null))

  const openMore = () => {
    setMore({ openedByClick: true })
    // Fica no histórico para continuar aberto ao trocar de idioma ou recarregar
    navigate('/projetos', { replace: true, state: { showMore: true } })
  }

  return (
    <main id="projetos" className="page">
      <div className="interface">
        <header className="page-head">
          <p className="eyebrow" data-scramble>{p.eyebrow}</p>
          <h1 className="page-title" data-split="chars">{p.title} <span>{p.titleHighlight}</span></h1>
          <p className="section-lead" data-split="lines">{p.subtitle}</p>
        </header>

        <div className="projetos-list">
          {featuredProjects.map((project, i) => (
            <ProjectBlock key={project.id} project={project} text={p.items[project.id]} index={i} labels={p} />
          ))}
        </div>

        {more ? (
          <MoreProjects labels={p} openedByClick={more.openedByClick} />
        ) : (
          <div className="projetos-more-action" data-reveal="up">
            <span data-magnetic="0.25">
              <button type="button" className="btn-secondary" onClick={openMore}>
                {p.more} <i className="bi bi-arrow-down" aria-hidden="true" />
              </button>
            </span>
          </div>
        )}

        <p className="page-closing" data-scrub-words>{p.closing}</p>
      </div>
    </main>
  )
}
