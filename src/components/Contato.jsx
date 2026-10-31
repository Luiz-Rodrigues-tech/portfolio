import { useRef, useState } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { useLanguage } from '../context/LanguageContext'

const WHATSAPP_NUMBER = '5565993219244'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const LIMITS = { nome: 80, email: 120, mensagem: 1500 }

// Remove caracteres de controle do que vai para a URL do WhatsApp
const clean = (value, max) =>
  value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max)

function validate({ nome, email, mensagem }, c) {
  const errors = {}
  if (clean(nome, LIMITS.nome).length < 2) errors.nome = c.errorName
  if (!EMAIL_PATTERN.test(clean(email, LIMITS.email))) errors.email = c.errorEmail
  if (clean(mensagem, LIMITS.mensagem).length < 10) errors.mensagem = c.errorMessage
  return errors
}

function Contato() {
  const { t } = useLanguage()
  const c = t.contact
  const [form, setForm] = useState({ nome: '', email: '', mensagem: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const formRef = useRef(null)
  const statusRef = useRef(null)
  const { contextSafe } = useGSAP({ scope: formRef })

  const contactItems = [
    { icon: 'bi-envelope', label: 'E-mail', value: 'luizhhuu@gmail.com', href: 'mailto:luizhhuu@gmail.com', desc: c.descEmail },
    { icon: 'bi-github', label: 'GitHub', value: 'github.com/Luiz-Rodrigues-tech', href: 'https://github.com/Luiz-Rodrigues-tech', desc: c.descGithub },
    { icon: 'bi-linkedin', label: 'LinkedIn', value: 'linkedin.com/in/luiz-rodrigues-tech', href: 'https://www.linkedin.com/in/luiz-rodrigues-tech', desc: c.descLinkedin },
    { icon: 'bi-whatsapp', label: 'WhatsApp', value: '+55 (65) 99321-9244', href: `https://wa.me/${WHATSAPP_NUMBER}`, desc: c.descWhatsapp },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((current) => ({ ...current, [name]: value }))
    setSent(false)
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const shake = contextSafe((names) => {
    if (prefersReducedMotion()) return
    names.forEach((name) => {
      gsap.fromTo(
        `[name="${name}"]`,
        { x: -8 },
        { x: 0, duration: 0.7, ease: 'elastic.out(1.2, 0.25)', clearProps: 'x' },
      )
    })
  })

  const celebrate = contextSafe(() => {
    if (prefersReducedMotion() || !statusRef.current) return
    gsap.from(statusRef.current, { y: 16, opacity: 0, duration: 0.7 })
    gsap.fromTo('.contato-form .btn-primary', { scale: 0.96 }, { scale: 1, duration: 0.9, ease: 'elastic.out(1.1, 0.4)', clearProps: 'scale' })
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const found = validate(form, c)
    setErrors(found)

    const invalid = Object.keys(found)
    if (invalid.length) {
      shake(invalid)
      formRef.current?.querySelector(`[name="${invalid[0]}"]`)?.focus()
      return
    }

    const greeting = c.whatsappGreeting(clean(form.nome, LIMITS.nome), clean(form.email, LIMITS.email))
    const texto = `${greeting}\n\n${clean(form.mensagem, LIMITS.mensagem)}`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener,noreferrer')
    setForm({ nome: '', email: '', mensagem: '' })
    setSent(true)
    requestAnimationFrame(celebrate)
  }

  const fieldProps = (name) => ({
    id: name,
    name,
    value: form[name],
    onChange: handleChange,
    maxLength: LIMITS[name],
    required: true,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${name}-erro` : undefined,
  })

  return (
    <section id="contato" className="section">
      <div className="interface">

        <div className="section-header">
          <p className="eyebrow" data-scramble>{c.eyebrow}</p>
          <h2 className="section-title" data-split="lines">{c.title} <span>{c.titleHighlight}</span></h2>
          <p className="section-lead" data-split="lines">{c.subtitle}</p>
        </div>

        <div className="contato-inner">
          <div className="contato-info" data-batch>
            {contactItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="contato-info-item"
              >
                <i className={`bi ${item.icon}`} aria-hidden="true" />
                <div>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <p className="contato-info-item__desc">{item.desc}</p>
                </div>
                <i className="bi bi-arrow-up-right contato-info-item__arrow" aria-hidden="true" />
              </a>
            ))}

            <div className="contato-response">
              <i className="bi bi-clock" aria-hidden="true" />
              <span>{c.responseTime} <strong>{c.responseValue}</strong></span>
            </div>
          </div>

          <div data-reveal="up">
            <p className="contato-form-intro">{c.intro}</p>
            <form className="contato-form" onSubmit={handleSubmit} noValidate ref={formRef}>
              <div className="form-group">
                <label htmlFor="nome">{c.labelName}</label>
                <input {...fieldProps('nome')} type="text" autoComplete="name" placeholder={c.placeholderName} />
                {errors.nome && <p className="form-error" id="nome-erro">{errors.nome}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="email">{c.labelEmail}</label>
                <input {...fieldProps('email')} type="email" autoComplete="email" placeholder={c.placeholderEmail} />
                {errors.email && <p className="form-error" id="email-erro">{errors.email}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="mensagem">{c.labelMessage}</label>
                <textarea {...fieldProps('mensagem')} rows={5} placeholder={c.placeholderMessage} />
                {errors.mensagem && <p className="form-error" id="mensagem-erro">{errors.mensagem}</p>}
              </div>
              <button type="submit" className="btn-primary btn-full">
                {c.btnSend} <i className="bi bi-arrow-right" aria-hidden="true" />
              </button>
              <div aria-live="polite">
                {sent && <p className="form-success" ref={statusRef}><i className="bi bi-check2-circle" aria-hidden="true" /> {c.sent}</p>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contato
