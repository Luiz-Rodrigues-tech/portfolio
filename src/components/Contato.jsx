import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'

const contactItems = [
  {
    icon: 'bi-envelope',
    label: 'E-mail',
    value: 'luizhhuu@gmail.com',
    href: 'mailto:luizhhuu@gmail.com',
    desc: 'Resposta rápida para projetos e oportunidades',
  },
  {
    icon: 'bi-github',
    label: 'GitHub',
    value: 'github.com/Luiz-Rodrigues-tech',
    href: 'https://github.com/Luiz-Rodrigues-tech',
    desc: 'Veja meus projetos e códigos',
  },
  {
    icon: 'bi-linkedin',
    label: 'LinkedIn',
    value: 'linkedin.com/in/luiz-rodrigues-tech',
    href: 'https://www.linkedin.com/in/luiz-rodrigues-tech',
    desc: 'Conecte-se comigo profissionalmente',
  },
  {
    icon: 'bi-whatsapp',
    label: 'WhatsApp',
    value: '+55 (65) 99321-9244',
    href: 'https://wa.me/5565993219244',
    desc: 'Contato direto para conversas rápidas',
  },
]

function Contato() {
  const [form, setForm] = useState({ nome: '', email: '', mensagem: '' })
  const headerRef = useReveal()
  const infoRef = useReveal(0.08)
  const formRef = useReveal(0.12)

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
          <h2 className="section-title">Entre em <span>Contato</span></h2>
          <p className="contato-subtitle">
            Se você precisa desenvolver um sistema, melhorar uma aplicação existente ou integrar serviços, posso te ajudar a construir uma solução funcional e bem estruturada.
          </p>
        </div>

        <div className="contato-inner">

          {/* Info */}
          <div ref={infoRef} className="contato-info reveal">
            {contactItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noreferrer"
                className="contato-info-item"
              >
                <i className={`bi ${item.icon}`} />
                <div>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <p className="contato-info-item__desc">{item.desc}</p>
                </div>
              </a>
            ))}

            <div className="contato-response">
              <i className="bi bi-clock" />
              <span>Tempo médio de resposta: <strong>até 24h</strong></span>
            </div>
          </div>

          {/* Form */}
          <div ref={formRef} className="reveal">
            <p className="contato-form-intro">
              Estou disponível para novos projetos, freelances e oportunidades em desenvolvimento web. Se quiser trocar uma ideia ou discutir uma solução, é só me chamar.
            </p>
            <form className="contato-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nome">Nome</label>
                <input
                  id="nome" name="nome" type="text"
                  placeholder="Seu nome"
                  value={form.nome} onChange={handleChange} required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email" name="email" type="email"
                  placeholder="seu@email.com"
                  value={form.email} onChange={handleChange} required
                />
              </div>
              <div className="form-group">
                <label htmlFor="mensagem">Mensagem</label>
                <textarea
                  id="mensagem" name="mensagem"
                  placeholder="Me conte um pouco sobre o seu projeto, ideia ou necessidade"
                  rows={5} value={form.mensagem} onChange={handleChange} required
                />
              </div>
              <button type="submit" className="btn-primary btn-full">
                Enviar mensagem <i className="bi bi-arrow-right" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Contato
