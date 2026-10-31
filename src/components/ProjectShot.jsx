// Moldura de navegador com a captura do site; a descida da imagem é animada por quem usa
export default function ProjectShot({ project, title, viewLabel, ...frameProps }) {
  const domain = project.live?.replace(/^https?:\/\//, '').split('/')[0]

  const image = (
    <img
      src={project.image}
      alt={project.live ? '' : title}
      width={project.width}
      height={project.height}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  )

  return (
    <div className="browser">
      <div className="browser__bar" aria-hidden="true">
        <span className="browser__dots"><i /><i /><i /></span>
        <span className="browser__url">
          {domain ? <><i className="bi bi-lock-fill" /> {domain}</> : title}
        </span>
      </div>
      {project.live ? (
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          className="browser__view"
          aria-label={`${viewLabel}: ${title}`}
          data-cursor={viewLabel}
          {...frameProps}
        >
          {image}
        </a>
      ) : (
        <div className="browser__view" {...frameProps}>{image}</div>
      )}
    </div>
  )
}
