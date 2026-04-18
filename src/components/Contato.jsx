import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useReveal } from '../hooks/useReveal'

function Contato() {
  const { t } = useLanguage()
  const c = t.contact
  const [form, setForm] = useState({ nome: '', email: '', mensagem: '' })
  const headerRef = useReveal()
  const contentRef = useReveal(0.1)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const texto = `Olá, Luiz! Me chamo *${form.nome}* (${form.email}).\n\n${form.mensagem}`
    window.open(`https://wa.me/5565993219244?text=${encodeURIComponent(texto)}`, '_blank')
    setForm({ nome: '', email: '', mensagem: '' })
  }

  return (
    <section id="contato" className="contato">
      <div className="interface">
        <div ref={headerRef} className="section-header reveal">
          <h2 className="section-title">{c.title} <span>{c.titleHighlight}</span></h2>
        </div>
        <div ref={contentRef} className="contato-inner reveal">
          <div className="contato-info">
            <div className="contato-info-item">
              <i className="bi bi-envelope"></i>
              <div>
                <span>{c.emailLabel}</span>
                <a href="mailto:luizhhuu@gmail.com">luizhhuu@gmail.com</a>
              </div>
            </div>
            <div className="contato-info-item">
              <i className="bi bi-github"></i>
              <div>
                <span>{c.githubLabel}</span>
                <a href="https://github.com/Luiz-Rodrigues-tech" target="_blank" rel="noreferrer">
                  github.com/Luiz-Rodrigues-tech
                </a>
              </div>
            </div>
            <div className="contato-info-item">
              <i className="bi bi-linkedin"></i>
              <div>
                <span>{c.linkedinLabel}</span>
                <a href="https://www.linkedin.com/in/luiz-rodrigues-tech" target="_blank" rel="noreferrer">
                  linkedin.com/in/luiz-rodrigues-tech
                </a>
              </div>
            </div>
          </div>

          <form className="contato-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nome">{c.labelName}</label>
              <input id="nome" name="nome" type="text" placeholder={c.placeholderName} value={form.nome} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">{c.labelEmail}</label>
              <input id="email" name="email" type="email" placeholder={c.placeholderEmail} value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="mensagem">{c.labelMessage}</label>
              <textarea id="mensagem" name="mensagem" placeholder={c.placeholderMessage} rows={5} value={form.mensagem} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn-primary btn-full">
              {c.btnSend} <i className="bi bi-send"></i>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contato
