import Header from '../components/Header'
import Footer from '../components/Footer'
import StarField from '../components/StarField'
import { useReveal } from '../hooks/useReveal'

const techStack = [
  {
    icon: 'bi-display',
    category: 'Front-end',
    desc: 'Interfaces modernas, responsivas e componentizadas',
    tags: ['React', 'Vue.js', 'TypeScript', 'Tailwind CSS', 'JavaScript'],
  },
  {
    icon: 'bi-server',
    category: 'Back-end',
    desc: 'APIs, lógica de negócio e integração entre sistemas',
    tags: ['PHP', 'Laravel', 'APIs RESTful', 'Node.js'],
  },
  {
    icon: 'bi-database',
    category: 'Banco de dados',
    desc: 'Modelagem, queries e manipulação eficiente de dados',
    tags: ['MySQL', 'PostgreSQL'],
  },
  {
    icon: 'bi-tools',
    category: 'Ferramentas',
    desc: 'Versionamento, testes e gestão de projetos',
    tags: ['Git', 'GitHub', 'Postman', 'Jira', 'Trello'],
  },
]

const timeline = [
  {
    type: 'formacao',
    period: '2022 — Presente',
    label: 'Formação',
    title: 'Análise e Desenvolvimento de Sistemas',
    institution: 'FATEC SENAI Mato Grosso',
    description: 'Curso voltado para fundamentos de desenvolvimento de software, lógica de programação, banco de dados e construção de aplicações.',
  },
  {
    type: 'curso',
    period: '2024',
    label: 'Curso',
    title: 'Laravel Completo',
    institution: 'Node Studio',
    description: 'Desenvolvimento de aplicações com Laravel, arquitetura MVC, criação de APIs e boas práticas.',
  },
  {
    type: 'curso',
    period: '2024',
    label: 'Curso',
    title: 'React',
    institution: 'Time to Code',
    description: 'Construção de interfaces modernas com React, componentização e integração com APIs.',
  },
  {
    type: 'curso',
    period: '2023',
    label: 'Curso',
    title: 'SQL Avançado',
    institution: 'Infinity Big Data',
    description: 'Modelagem de dados, criação de queries, joins e manipulação eficiente de dados.',
  },
  {
    type: 'curso',
    period: '2023',
    label: 'Curso',
    title: 'Programação em Python',
    institution: 'FATEC SENAI MT',
    description: 'Fundamentos de programação, lógica e estrutura de código.',
  },
  {
    type: 'curso',
    period: '2023',
    label: 'Curso',
    title: 'Git e GitHub',
    institution: 'FATEC SENAI MT',
    description: 'Versionamento de código, controle de versões e organização de projetos.',
  },
]

function TimelineItem({ item, isLast }) {
  const ref = useReveal(0.1)
  return (
    <div ref={ref} className="exp-card reveal">
      <div className="exp-left">
        <span className="exp-period">{item.period}</span>
        <span className="sobre-timeline-label">{item.label}</span>
      </div>
      <div className="exp-divider">
        <div className={`exp-dot ${item.type === 'formacao' ? 'exp-dot--accent' : ''}`} />
        {!isLast && <div className="exp-line" />}
      </div>
      <div className="exp-right">
        <h3 className="exp-role">{item.title}</h3>
        <p className="exp-company">{item.institution}</p>
        <p className="sobre-timeline-desc">{item.description}</p>
      </div>
    </div>
  )
}

function Section({ children, className = '' }) {
  const ref = useReveal(0.1)
  return (
    <div ref={ref} className={`sobre-page-section reveal ${className}`}>
      {children}
    </div>
  )
}

export default function SobrePage() {
  const introRef = useReveal(0.1)
  const photoRef = useReveal(0.15)

  return (
    <>
      <StarField />
      <Header />
      <main id="sobre" className="sobre-page">
        <div className="interface">

          {/* ── Seção 1: Intro + Foto ── */}
          <div className="sobre-page-intro">
            <div ref={introRef} className="sobre-page-intro__text reveal">
              <h1 className="section-title">Sobre <span>Mim</span></h1>
              <p>Me chamo Luiz Henrique e sou Desenvolvedor Full Stack. Minha trajetória na programação começou de forma prática e autodidata, desenvolvendo projetos por conta própria e explorando na prática como as aplicações funcionam por trás das interfaces.</p>
              <p>Boa parte da minha experiência foi construída atuando como freelancer e em projetos independentes, onde tive contato direto com todas as etapas do desenvolvimento — desde a construção das interfaces até a lógica de back-end, integração entre sistemas e resolução de problemas reais.</p>
              <p>Com o tempo, passei a atuar também em ambientes profissionais, o que reforçou ainda mais minha visão de produto, organização de código e trabalho em equipe. Hoje, tenho uma base sólida no desenvolvimento de aplicações web, com foco em criar soluções que funcionam bem na prática, são estáveis e fáceis de evoluir.</p>
            </div>
            <div ref={photoRef} className="sobre-page-intro__photo reveal">
              <img src="/img/foto-minha-sobre.jpeg" alt="Luiz Henrique" />
            </div>
          </div>

          <div className="sobre-page-divider" />

          {/* ── Seção 2: Como eu trabalho ── */}
          <Section>
            <h2 className="section-title">Como eu <span>trabalho</span></h2>
            <div className="process-grid">
              {[
                {
                  num: '01',
                  icon: 'bi-search',
                  title: 'Entender o problema',
                  desc: 'Antes de escrever qualquer linha de código, busco entender bem o que precisa ser resolvido — o contexto, os requisitos e o impacto esperado.',
                },
                {
                  num: '02',
                  icon: 'bi-diagram-2',
                  title: 'Estruturar a solução',
                  desc: 'Com o problema claro, organizo a abordagem mais simples e eficiente: arquitetura, fluxo de dados e divisão entre front-end e back-end.',
                },
                {
                  num: '03',
                  icon: 'bi-code-slash',
                  title: 'Desenvolver com qualidade',
                  desc: 'Escrevo código organizado, de fácil manutenção e com integrações consistentes — garantindo que a aplicação funcione bem em cenários reais.',
                },
                {
                  num: '04',
                  icon: 'bi-arrow-repeat',
                  title: 'Entregar e evoluir',
                  desc: 'Após a entrega, acompanho o funcionamento, corrijo problemas e contribuo com melhorias contínuas para que o produto evolua de forma estável.',
                },
              ].map((step) => (
                <div key={step.num} className="process-card">
                  <div className="process-card__top">
                    <span className="process-card__num">{step.num}</span>
                    <div className="process-card__icon">
                      <i className={`bi ${step.icon}`} />
                    </div>
                  </div>
                  <h3 className="process-card__title">{step.title}</h3>
                  <p className="process-card__desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <div className="sobre-page-divider" />

          {/* ── Seção 3: Tecnologias ── */}
          <Section>
            <h2 className="section-title">Tecnologias que <span>utilizo</span></h2>
            <p className="sobre-page-subtitle">Atuo principalmente no desenvolvimento web, utilizando tecnologias modernas tanto no front-end quanto no back-end.</p>
            <div className="tech-cards-grid">
              {techStack.map(group => (
                <div key={group.category} className="tech-card">
                  <div className="tech-card__icon">
                    <i className={`bi ${group.icon}`} />
                  </div>
                  <div className="tech-card__header">
                    <h3 className="tech-card__title">{group.category}</h3>
                    <p className="tech-card__desc">{group.desc}</p>
                  </div>
                  <div className="tech-card__tags">
                    {group.tags.map(tag => (
                      <span className="tag" key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <div className="sobre-page-divider" />

          {/* ── Seções 4 & 5: Timeline ── */}
          <Section>
            <h2 className="section-title">Formação & <span>Cursos</span></h2>
            <div className="exp-list">
              {timeline.map((item, i) => (
                <TimelineItem key={i} item={item} isLast={i === timeline.length - 1} />
              ))}
            </div>
          </Section>

          <div className="sobre-page-divider" />

          {/* ── Seção 6: Fechamento ── */}
          <Section className="sobre-page-closing">
            <p>Hoje, busco continuar evoluindo como desenvolvedor, participando de projetos desafiadores e contribuindo com soluções que gerem valor real.</p>
            <p>Estou aberto a oportunidades onde eu possa crescer, colaborar com outros profissionais e continuar desenvolvendo sistemas cada vez mais eficientes.</p>
            <a href="https://wa.me/5565993219244" target="_blank" rel="noreferrer" className="btn-primary">
              <i className="bi bi-whatsapp" /> Entre em contato
            </a>
          </Section>

        </div>
      </main>
      <Footer />
    </>
  )
}
