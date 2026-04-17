import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

const lines = [
  { tokens: [{ t: 'const', c: 'kw' }, { t: ' developer', c: 'var' }, { t: ' = {', c: 'base' }] },
  { tokens: [{ t: '  name', c: 'prop' }, { t: ': ', c: 'base' }, { t: '"Luiz Henrique"', c: 'str' }, { t: ',', c: 'base' }] },
  { tokens: [{ t: '  role', c: 'prop' }, { t: ': ', c: 'base' }, { t: '"Full-Stack Developer"', c: 'str' }, { t: ',', c: 'base' }] },
  { tokens: [{ t: '  education', c: 'prop' }, { t: ': ', c: 'base' }, { t: '"Análise e Desenvolvimento de Sistemas"', c: 'str' }, { t: ',', c: 'base' }] },
  { tokens: [{ t: '  stack', c: 'prop' }, { t: ': [', c: 'base' }, { t: '"PHP"', c: 'str' }, { t: ', ', c: 'base' }, { t: '"Laravel"', c: 'str' }, { t: ', ', c: 'base' }, { t: '"Vue.js"', c: 'str' }, { t: ', ', c: 'base' }, { t: '"React"', c: 'str' }, { t: ', ', c: 'base' }, { t: '"Flutter"', c: 'str' }, { t: '],', c: 'base' }] },
  { tokens: [{ t: '  focus', c: 'prop' }, { t: ': ', c: 'base' }, { t: '"Do front ao back, do design ao deploy"', c: 'str' }, { t: ',', c: 'base' }] },
  { tokens: [{ t: '  available', c: 'prop' }, { t: ': ', c: 'base' }, { t: 'true', c: 'kw' }, { t: ',', c: 'base' }] },
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
  const [statsIn, setStatsIn]     = useState(false)
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
          } else {
            setTimeout(() => setStatsIn(true), 400)
          }
        }, 60)
      }
    }, speed)
    return () => clearInterval(iv)
  }, [lineIdx])

  const stats = [
    { icon: 'bi-mortarboard', label: a.label1, value: a.label1Value },
    { icon: 'bi-code-square',  label: a.label2, value: 'Full-Stack' },
    { icon: 'bi-github',       label: a.label3, value: 'GitHub' },
  ]

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

        {/* Stats */}
        <div className={`sobre-highlights comic-highlights ${statsIn ? 'comic-highlights--in' : ''}`}>
          {stats.map((h, idx) => (
            <div
              className="highlight-item"
              key={h.label}
              style={{ transitionDelay: `${idx * 130}ms` }}
            >
              <i className={`bi ${h.icon}`} />
              <div>
                <span className="highlight-label">{h.label}</span>
                <span className="highlight-value">{h.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
