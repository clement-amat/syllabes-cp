import { useState } from 'react'
import type { Font } from '../domain/font'
import type { Session } from '../domain/session'
import type { Storage } from '../storage'
import { CreateSession } from './CreateSession'
import { Home } from './Home'
import { Player } from './Player'
import { useRoute } from './route'

export function App({ storage }: { storage: Storage }) {
  const [route, navigate] = useRoute()
  const [sessions, setSessions] = useState(() => storage.list())
  const [font, setFont] = useState<Font>(() => storage.font() ?? 'script')
  const [ruled, setRuled] = useState(() => storage.ruled())

  const goHome = () => navigate({ screen: 'home' })

  const save = (session: Session, play: boolean) => {
    storage.save(session)
    setSessions(storage.list())
    navigate(play ? { screen: 'play', id: session.id } : { screen: 'home' })
  }

  const remove = (id: string) => {
    storage.remove(id)
    setSessions(storage.list())
  }

  const changeFont = (next: Font) => {
    storage.saveFont(next)
    setFont(next)
  }

  const changeRuled = (next: boolean) => {
    storage.saveRuled(next)
    setRuled(next)
  }

  if (route.screen === 'play') {
    const session = sessions.find((s) => s.id === route.id)
    if (!session) {
      return (
        <main className="page">
          <p className="empty">Cette séance n’existe pas ou plus sur ce poste.</p>
          <button type="button" className="button primary" onClick={goHome}>
            Retour à l’accueil
          </button>
        </main>
      )
    }
    return (
      <Player
        key={session.id}
        session={session}
        font={font}
        ruled={ruled}
        onFontChange={changeFont}
        onRuledChange={changeRuled}
        onExit={goHome}
      />
    )
  }

  return (
    <>
      {!storage.persistent && (
        <p className="banner">
          La sauvegarde n’est pas disponible sur ce poste : les séances seront perdues à la fermeture de la page.
        </p>
      )}
      {route.screen === 'create' ? (
        <CreateSession onSave={save} onCancel={goHome} />
      ) : (
        <Home
          sessions={sessions}
          onCreate={() => navigate({ screen: 'create' })}
          onPlay={(id) => navigate({ screen: 'play', id })}
          onRemove={remove}
        />
      )}
    </>
  )
}
