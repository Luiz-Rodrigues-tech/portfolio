import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

const lines = [
  { tokens: [{ t: 'const', c: 'kw' }, { t: ' desenvolvedor', c: 'var' }, { t: ' = {', c: 'base' }] },
  { tokens: [{ t: '  nome', c: 'prop' }, { t: ': ', c: 'base' }, { t: '"Luiz Henrique da Cruz Rodrigues"', c: 'str' }, { t: ',', c: 'base' }] },
  { tokens: [{ t: '  cargo', c: 'prop' }, { t: ': ', c: 'base' }, { t: '"Desenvolvedor Full-Stack"', c: 'str' }, { t: ',', c: 'base' }] },
  { tokens: [{ t: '  formacao', c: 'prop' }, { t: ': ', c: 'base' }, { t: '"ADS — FATEC SENAI MT"', c: 'str' }, { t: ',', c: 'base' }] },
  { tokens: [{ t: '  backend', c: 'prop' }, { t: ': [', c: 'base' }, { t: '"PHP"', c: 'str' }, { t: ', ', c: 'base' }, { t: '"Laravel"', c: 'str' }, { t: ', ', c: 'base' }, { t: '"APIs RESTful"', c: 'str' }, { t: ', ', c: 'base' }, { t: '"MySQL"', c: 'str' }, { t: ', ', c: 'base' }, { t: '"PostgreSQL"', c: 'str' }, { t: '],', c: 'base' }] },
  { tokens: [{ t: '  frontend', c: 'prop' }, { t: ': [', c: 'base' }, { t: '"Vue.js"', c: 'str' }, { t: ', ', c: 'base' }, { t: '"React"', c: 'str' }, { t: ', ', c: 'base' }, { t: '"Angular"', c: 'str' }, { t: ', ', c: 'base' }, { t: '"Tailwind CSS"', c: 'str' }, { t: '],', c: 'base' }] },
  { tokens: [{ t: '  mobile', c: 'prop' }, { t: ': ', c: 'base' }, { t: '"Flutter"', c: 'str' }, { t: ',', c: 'base' }] },
  { tokens: [{ t: '  idiomas', c: 'prop' }, { t: ': ', c: 'base' }, { t: '"Inglês técnico (leitura e escrita)"', c: 'str' }, { t: ',', c: 'base' }] },
  { tokens: [{ t: '  disponivel', c: 'prop' }, { t: ': ', c: 'base' }, { t: 'true', c: 'kw' }, { t: ',', c: 'base' }] },
  { tokens: [{ t: '}', c: 'base' }] },
]

function TerminalLine({ tokens, visible, isCurrentLine, charIndex }) {
  if (!visible && !isCurrentLine) return null

  let content
  if (isCurrentLine) {
    // Renderiza só até charIndex caracteres, token por token
    const parts = []
    let charsLeft = charIndex
    for (let i = 0; i < tokens.length; i++) {
      const tok = tokens[i]
      if (charsLeft <= 0) break
      const slice = tok.t.slice(0, charsLeft)
      parts.push(<span key={i} className={`term-${tok.c}`}>{slice}</span>)
      charsLeft -= tok.t.length
    }
    content = <>{parts}<span className="term-cursor" /></>
  } else {
    content = tokens.map((tok, i) => (
      <span key={i} className={`term-${tok.c}`}>{tok.t}</span>
    ))
  }

  return (
    <div className="term-line">
      <span className="term-prompt">{'>'}</span>
      {content}
    </div>
  )
}

export default function Sobre() {
  const { t } = useLanguage()
  const a = t.about
  const sectionRef = useRef(null)

  const [lineIdx, setLineIdx]     = useState(-1)
  const [charIdx, setCharIdx]     = useState(0)
  const [doneLines, setDoneLines] = useState([])
  const [triggered, setTriggered] = useState(false)

  // IntersectionObserver
  useEffect(() => {
    if (triggered) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTriggered(true); obs.disconnect() } },
      { threshold: 0.2 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [triggered])

  // Typewriter por linha
  useEffect(() => {
    if (!triggered) return
    setTimeout(() => setLineIdx(0), 400)
  }, [triggered])

  useEffect(() => {
    if (lineIdx < 0 || lineIdx >= lines.length) return
    const lineText = lines[lineIdx].tokens.map(tk => tk.t).join('')
    setCharIdx(0)

    const speed = 28
    let ch = 0
    const iv = setInterval(() => {
      ch++
      setCharIdx(ch)
      if (ch >= lineText.length) {
        clearInterval(iv)
        setDoneLines(d => [...d, lineIdx])
        setTimeout(() => {
          if (lineIdx + 1 < lines.length) {
            setLineIdx(lineIdx + 1)
          }
        }, 60)
      }
    }, speed)
    return () => clearInterval(iv)
  }, [lineIdx])

  return (
    <section id="sobre" className="sobre" ref={sectionRef}>
      <div className="interface">
        <div className={`section-header sobre-header ${triggered ? 'sobre-header--in' : ''}`}>
          <h2 className="section-title">{a.title} <span>{a.titleHighlight}</span></h2>
        </div>

        {/* Terminal */}
        <div className={`terminal-card ${triggered ? 'terminal-card--in' : ''}`}>
          {/* Barra do terminal */}
          <div className="terminal-bar">
            <span className="term-dot term-dot--red" />
            <span className="term-dot term-dot--yellow" />
            <span className="term-dot term-dot--green" />
            <span className="terminal-title">developer.js</span>
          </div>

          {/* Código */}
          <div className="terminal-body">
            {lines.map((line, i) => (
              <TerminalLine
                key={i}
                tokens={line.tokens}
                visible={doneLines.includes(i)}
                isCurrentLine={lineIdx === i && !doneLines.includes(i)}
                charIndex={charIdx}
              />
            ))}
            {lineIdx < 0 && <span className="term-cursor" />}
          </div>
        </div>

      </div>
    </section>
  )
}
