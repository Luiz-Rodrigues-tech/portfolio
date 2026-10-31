import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, useGSAP, ScrollSmoother, PIN_OK, MOTION_OK } from '../lib/gsap'
import { useLanguage } from '../context/LanguageContext'
import { featuredProjects as projects } from '../data/projects'
import ProjectShot from './ProjectShot'

function Portfolio() {
  const { t } = useLanguage()
  const p = t.portfolio
  const scope = useRef(null)

  useGSAP(() => {
    const q = gsap.utils.selector(scope)
    const mm = gsap.matchMedia()

    mm.add(PIN_OK, () => {
      const track = q('.work__track')[0]
      const panels = q('.work__panel')
      const counter = q('.work__current')[0]
      const distance = () => track.scrollWidth - window.innerWidth
      const cleanups = []

      const slide = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: q('.work__pin')[0],
          pin: true,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            gsap.set(q('.work__bar i'), { scaleX: self.progress })
            // O painel atual é o último que já chegou à metade da tela
            const middle = window.innerWidth / 2
            const index = panels.reduce((last, panel, i) => (panel.getBoundingClientRect().left < middle ? i : last), 0)
            counter.textContent = String(index + 1).padStart(2, '0')
          },
        },
      })

      // O primeiro painel já começa na tela: a captura dele só desce quando a galeria anda
      const firstLeft = parseFloat(getComputedStyle(track).paddingLeft)

      panels.forEach((panel, i) => {
        const view = panel.querySelector('.browser__view')
        const img = view.querySelector('img')
        const info = panel.querySelectorAll('.work__index, .work__name, .work__desc, .project-tags, .work__cta')

        gsap.to(img, {
          y: () => Math.min(0, view.clientHeight - img.offsetHeight),
          ease: 'none',
          scrollTrigger: {
            trigger: panel,
            containerAnimation: slide,
            start: i === 0 ? `left ${firstLeft}px` : 'left 70%',
            end: 'right 30%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        })

        gsap.from(panel.querySelector('.browser'), {
          scale: 0.86,
          rotationY: -12,
          transformPerspective: 1400,
          opacity: 0.25,
          ease: 'none',
          scrollTrigger: {
            trigger: panel,
            containerAnimation: slide,
            start: 'left 100%',
            end: 'left 35%',
            scrub: true,
          },
        })

        gsap.from(info, {
          x: 90,
          opacity: 0,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: {
            trigger: panel,
            containerAnimation: slide,
            start: 'left 92%',
            end: 'left 35%',
            scrub: true,
          },
        })

        // Teclado: ao focar um link fora da tela, rola até o painel dele
        const onFocus = () => {
          const st = slide.scrollTrigger
          const ratio = (panel.offsetLeft - window.innerWidth * 0.08) / distance()
          const y = st.start + gsap.utils.clamp(0, 1, ratio) * (st.end - st.start)
          const smoother = ScrollSmoother.get()
          if (smoother) smoother.scrollTop(y)
          else window.scrollTo(0, y)
        }
        panel.addEventListener('focusin', onFocus)
        cleanups.push(() => panel.removeEventListener('focusin', onFocus))
      })

      return () => cleanups.forEach((fn) => fn())
    })

    // Sem pin (tablet, celular): cada projeto entra ao rolar e a captura desce junto
    mm.add(`${MOTION_OK} and (max-width: 1024px), ${MOTION_OK} and (max-height: 599px)`, () => {
      q('.work__panel').forEach((panel) => {
        const view = panel.querySelector('.browser__view')
        const img = view.querySelector('img')

        gsap.from(panel, {
          y: 60,
          opacity: 0,
          duration: 1.1,
          scrollTrigger: { trigger: panel, start: 'top 88%' },
        })

        gsap.to(img, {
          y: () => Math.min(0, view.clientHeight - img.offsetHeight),
          ease: 'none',
          scrollTrigger: {
            trigger: view,
            start: 'top 85%',
            end: 'bottom 15%',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
      })
    })

    return () => mm.revert()
  }, { scope })

  return (
    <section id="projetos" className="work" ref={scope}>
      <div className="work__pin">
        <div className="interface work__head">
          <div>
            <p className="eyebrow" data-scramble>{p.eyebrow}</p>
            <h2 className="section-title" data-split="lines">
              {p.title} <span>{p.titleHighlight}</span>
            </h2>
            <p className="work__subtitle">{p.subtitle}</p>
          </div>
          <div className="work__meter" aria-hidden="true">
            <span className="work__count"><span className="work__current">01</span> / {String(projects.length).padStart(2, '0')}</span>
            <span className="work__bar"><i /></span>
          </div>
        </div>

        <div className="work__track">
          {projects.map((project, i) => {
            const text = p.projects[project.id]
            return (
              <article className="work__panel" key={project.id}>
                <div className="work__info">
                  <span className="work__index">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="work__name">{text.title}</h3>
                  <p className="work__desc">{text.description}</p>
                  <div className="project-tags">
                    {project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
                  </div>
                  <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn-secondary work__cta">
                    {p.visit} <i className="bi bi-arrow-up-right" aria-hidden="true"></i>
                  </a>
                </div>
                <ProjectShot project={project} title={text.title} viewLabel={p.viewProject} />
              </article>
            )
          })}
          <div className="work__end">
            <Link to="/projetos" state={{ showMore: true }} className="work__all" data-cursor={p.viewProject}>
              <span>{p.seeAll}</span>
              <i className="bi bi-arrow-right" aria-hidden="true"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Portfolio
