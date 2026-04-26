import { Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'

import Header from './components/Header'
import Hero from './components/Hero'
import Portfolio from './components/Portfolio'
import Especialidades from './components/Especialidades'
import Contato from './components/Contato'
import Footer from './components/Footer'
import StarField from './components/StarField'

import SobrePage from './pages/SobrePage'
import ProjetosPage from './pages/ProjetosPage'
import ServicosPage from './pages/ServicosPage'
import ContatoPage from './pages/ContatoPage'

function HomePage() {
  return (
    <>
      <StarField />
      <Header />
      <main>
        <Hero />
        <Portfolio />
        <Especialidades />
        <Contato />
      </main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/"          element={<HomePage />} />
        <Route path="/sobre"     element={<SobrePage />} />
        <Route path="/projetos"  element={<ProjetosPage />} />
        <Route path="/servicos"  element={<ServicosPage />} />
        <Route path="/contato"   element={<ContatoPage />} />
      </Routes>
    </LanguageProvider>
  )
}

export default App
