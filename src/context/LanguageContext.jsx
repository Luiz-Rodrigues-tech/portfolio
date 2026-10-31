import { createContext, useContext, useEffect, useState } from 'react'
import translations from '../i18n/translations'

const STORAGE_KEY = 'portfolio-lang'
const HTML_LANG = { pt: 'pt-BR', en: 'en', es: 'es' }

function readStoredLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return translations[stored] ? stored : 'pt'
  } catch {
    return 'pt'
  }
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(readStoredLang)
  const t = translations[lang]

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang]
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // Navegação privada pode bloquear o storage; o idioma só não fica salvo
    }
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
