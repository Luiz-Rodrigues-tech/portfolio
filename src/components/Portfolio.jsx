import { useState, useEffect, useCallback } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useReveal } from '../hooks/useReveal'

const projectImages = [
  '/pdf/Rejuvenesce.png',
  '/pdf/Leonel_Gessos.png',
  '/pdf/Equali_Consultoria.png',
  '/pdf/Izadora.png',
  '/pdf/EnglishFast.png',
]

const projectTags = [
  ['Laravel', 'Vue.js', 'Tailwind CSS'],
  ['Laravel', 'Vue.js', 'Tailwind CSS'],
  ['React', 'JavaScript', 'CSS'],
  ['React', 'JavaScript', 'CSS'],
  ['React', 'JavaScript', 'CSS'],
]

const projectLinks = [
  'https://rejuvenesceestetica.com.br',
  'https://leonelgesso.com.br',
  'https://red-chough-671278.hostingersite.com',
  'https://izadoraportfolio.com',
  'https://lightcoral-caterpillar-755231.hostingersite.com',
]

function ProjectPreview({ image, title, live, viewLabel }) {
  const pngSrc = image.replace('.pdf', '.png').replace('Equali Consultoria', 'Equali_Consultoria')
  const [usePng, setUsePng] = useState(true)
  const [touched, setTouched] = useState(false)

  return (
    <div
      className={`carousel-preview${touched ? ' touch-active' : ''}`}
      onTouchStart={() => setTouched(true)}
      onTouchEnd={() => setTouched(false)}
    >
      {usePng ? (
        <img
          src={pngSrc}
          alt={title}
          className="carousel-img-scroll-img"
          onError={() => setUsePng(false)}
          draggable={false}
        />
      ) : (
        <iframe
          src={`${image}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
          title={title}
          className="carousel-iframe"
          scrolling="no"
        />
      )}
      <a href={live} target="_blank" rel="noreferrer" className="carousel-overlay">
        <span>
          <i className="bi bi-box-arrow-up-right"></i> {viewLabel}
        </span>
      </a>
    </div>
  )
}

function Portfolio() {
  const { t } = useLanguage()
  const p = t.portfolio
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [dir, setDir] = useState('next')
  const [animKey, setAnimKey] = useState(0)
  const headerRef   = useReveal()
  const carouselRef = useReveal(0.1)

  const next = useCallback(() => {
    setDir('next')
    setAnimKey(k => k + 1)
    setCurrent(i => (i + 1) % projectImages.length)
  }, [])

  const prev = useCallback(() => {
    setDir('prev')
    setAnimKey(k => k + 1)
    setCurrent(i => (i - 1 + projectImages.length) % projectImages.length)
  }, [])

  const goTo = useCallback((i) => {
    setDir(i > current ? 'next' : 'prev')
    setAnimKey(k => k + 1)
    setCurrent(i)
  }, [current])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [paused, next])

  const image   = projectImages[current]
  const tags    = projectTags[current]
  const live    = projectLinks[current]
  const project = p.projects[current]

  return (
    <section id="projetos" className="portfolio">
      <div className="interface">
        <div ref={headerRef} className="section-header reveal">
          <h2 className="section-title">{p.title} <span>{p.titleHighlight}</span></h2>
        </div>

        <div
          ref={carouselRef}
          className="carousel reveal"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button className="carousel-btn carousel-prev" onClick={prev} aria-label={p.prev}>
            <i className="bi bi-chevron-left"></i>
          </button>

          <div
            key={animKey}
            className={`carousel-card carousel-card--${dir}`}
          >
            <ProjectPreview image={image} title={project.title} live={live} viewLabel={p.viewProject} />
            <div className="carousel-info">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tags">
                {tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}
              </div>
              <a href={live} target="_blank" rel="noreferrer" className="btn-primary carousel-cta">
                <i className="bi bi-box-arrow-up-right"></i> {p.visit}
              </a>
            </div>
          </div>

          <button className="carousel-btn carousel-next" onClick={next} aria-label={p.next}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>

        <div className="carousel-dots">
          {projectImages.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot ${i === current ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`${p.title} ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Portfolio
