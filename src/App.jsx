import { LanguageProvider } from './context/LanguageContext'
import Header from './components/Header'
import Hero from './components/Hero'
import Especialidades from './components/Especialidades'
import Sobre from './components/Sobre'
import Portfolio from './components/Portfolio'
import Contato from './components/Contato'
import Footer from './components/Footer'
import StarField from './components/StarField'
import Experiencia from './components/Experiencia'

function App() {
  return (
    <LanguageProvider>
      <StarField />
      <Header />
      <main>
        <Hero />
        <Especialidades />
        <Portfolio />
        <Sobre />
        <Experiencia />
        <Contato />
      </main>
      <Footer />
    </LanguageProvider>
  )
}

export default App
