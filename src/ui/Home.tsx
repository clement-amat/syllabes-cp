import { useState } from 'react'
import type { Session } from '../domain/session'

interface Props {
  sessions: Session[]
  onCreate: () => void
  onPlay: (id: string) => void
  onRemove: (id: string) => void
}

export function Home({ sessions, onCreate, onPlay, onRemove }: Props) {
  return (
    <main className="page">
      <header className="page-header">
        <h1>Syllabes</h1>
        <button type="button" className="button primary" onClick={onCreate}>
          Nouvelle séance
        </button>
      </header>

      {sessions.length === 0 ? (
        <p className="empty">Aucune séance enregistrée. Créez-en une pour commencer.</p>
      ) : (
        <ul className="sessions">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} onPlay={onPlay} onRemove={onRemove} />
          ))}
        </ul>
      )}
    </main>
  )
}

interface CardProps {
  session: Session
  onPlay: (id: string) => void
  onRemove: (id: string) => void
}

function SessionCard({ session, onPlay, onRemove }: CardProps) {
  const [confirming, setConfirming] = useState(false)
  const count = session.syllables.length
  const preview = session.syllables.slice(0, 8).join(' · ') + (count > 8 ? ' …' : '')

  return (
    <li className="session">
      <div className="session-info">
        <h2 className="session-name">{session.name}</h2>
        <p className="muted">
          {count} syllabe{count > 1 ? 's' : ''} · créée le {new Date(session.createdAt).toLocaleDateString('fr-FR')}
        </p>
        <p className="session-preview">{preview}</p>
      </div>
      <div className="session-actions">
        {confirming ? (
          <>
            <span className="muted">Supprimer ?</span>
            <button type="button" className="button danger" onClick={() => onRemove(session.id)}>
              Oui
            </button>
            <button type="button" className="button ghost" onClick={() => setConfirming(false)}>
              Non
            </button>
          </>
        ) : (
          <>
            <button type="button" className="button ghost" onClick={() => setConfirming(true)}>
              Supprimer
            </button>
            <button type="button" className="button primary" onClick={() => onPlay(session.id)}>
              Lancer
            </button>
          </>
        )}
      </div>
    </li>
  )
}
