import { LanguageProvider } from './context/LanguageContext'

import Layout from './components/Layout'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Portfolio from './components/Portfolio'
import Especialidades from './components/Especialidades'
import Contato from './components/Contato'

import SobrePage from './pages/SobrePage'
import ProjetosPage from './pages/ProjetosPage'
import ServicosPage from './pages/ServicosPage'
import ContatoPage from './pages/ContatoPage'
import NotFoundPage from './pages/NotFoundPage'

function HomePage() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Portfolio />
      <Especialidades />
      <Contato />
    </main>
  )
}

const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/sobre', element: <SobrePage /> },
  { path: '/projetos', element: <ProjetosPage /> },
  { path: '/servicos', element: <ServicosPage /> },
  { path: '/contato', element: <ContatoPage /> },
  { path: '*', element: <NotFoundPage /> },
]

const TITLE_KEYS = {
  '/': 'home',
  '/sobre': 'sobre',
  '/projetos': 'projetos',
  '/servicos': 'servicos',
  '/contato': 'contato',
}

const titleFor = (pathname) => TITLE_KEYS[pathname] ?? 'notFound'

function App() {
  return (
    <LanguageProvider>
      <Layout routes={routes} titleFor={titleFor} />
    </LanguageProvider>
  )
}

export default App
