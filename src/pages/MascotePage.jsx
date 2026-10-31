import { useRef, useState } from 'react'
import Castor from '../components/mascot/Castor'

// Só existe em desenvolvimento (npm run dev): serve para ver cada animação do castor
const ACTIONS = [
  ['wave', 'Acenar'],
  ['smile', 'Sorrir'],
  ['talk', 'Falar'],
  ['think', 'Pensar'],
  ['clap', 'Bater palmas'],
  ['jump', 'Pular'],
  ['surprised', 'Surpresa'],
  ['sleep', 'Dormir'],
]

export default function MascotePage() {
  const castor = useRef(null)
  const [shades, setShades] = useState(false)

  return (
    <main className="page mascote-page">
      <div className="interface mascote-page__grid">
        <div className="mascote-page__stage">
          <Castor ref={castor} shades={shades} />
        </div>
        <div className="mascote-page__actions">
          {ACTIONS.map(([name, label]) => (
            <button type="button" className="btn-secondary" key={name} data-action={name} onClick={() => castor.current?.play(name)}>
              {label}
            </button>
          ))}
          <button type="button" className="btn-secondary" data-action="shades" onClick={() => setShades((on) => !on)}>
            Óculos escuros
          </button>
          <button type="button" className="btn-primary" data-action="stop" onClick={() => castor.current?.stop()}>
            Parar
          </button>
        </div>
      </div>
    </main>
  )
}
