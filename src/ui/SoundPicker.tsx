import { useId, useState } from 'react'
import { CATALOG, type Sound, type SoundKind } from '../domain/catalog'

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()

const matches = (sound: Sound, query: string) =>
  query === '' ||
  normalize(sound.label).includes(query) ||
  sound.graphemes.some((g) => normalize(g.spelling).includes(query))

const TITLES: Record<SoundKind, string> = { vowel: 'Voyelles', consonant: 'Consonnes' }

interface Props {
  selection: ReadonlySet<string>
  onChange: (selection: Set<string>) => void
}

export function SoundPicker({ selection, onChange }: Props) {
  const [query, setQuery] = useState('')
  const searchId = useId()
  const filter = normalize(query)
  const visible = CATALOG.filter((sound) => matches(sound, filter))

  const toggle = (ids: string[], on: boolean) => {
    const next = new Set(selection)
    ids.forEach((id) => (on ? next.add(id) : next.delete(id)))
    onChange(next)
  }

  return (
    <div className="picker">
      <div className="picker-tools">
        <label htmlFor={searchId} className="sr-only">
          Rechercher un son
        </label>
        <input
          id={searchId}
          type="search"
          className="input search"
          placeholder="Rechercher un son : ch, ou, an…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="muted">
          {selection.size} graphie{selection.size > 1 ? 's' : ''} choisie{selection.size > 1 ? 's' : ''}
        </span>
        <button type="button" className="button ghost" disabled={selection.size === 0} onClick={() => onChange(new Set())}>
          Tout désélectionner
        </button>
      </div>

      {visible.length === 0 && <p className="muted">Aucun son ne correspond à « {query} ».</p>}

      {(['vowel', 'consonant'] as const).map((kind) => {
        const sounds = visible.filter((sound) => sound.kind === kind)
        if (sounds.length === 0) return null
        return (
          <section key={kind} className="family" aria-label={TITLES[kind]}>
            <h3 className="family-title">{TITLES[kind]}</h3>
            <div className="tiles">
              {sounds.map((sound) => (
                <SoundTile key={sound.id} sound={sound} selection={selection} onToggle={toggle} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

interface TileProps {
  sound: Sound
  selection: ReadonlySet<string>
  onToggle: (ids: string[], on: boolean) => void
}

function SoundTile({ sound, selection, onToggle }: TileProps) {
  const ids = sound.graphemes.map((g) => g.id)
  const chosen = ids.filter((id) => selection.has(id)).length
  const state = chosen === 0 ? 'false' : chosen === ids.length ? 'true' : 'mixed'

  if (sound.graphemes.length === 1) {
    const [g] = sound.graphemes
    return (
      <button
        type="button"
        className="tile tile-single"
        aria-pressed={state === 'true'}
        aria-label={`Son ${sound.label}`}
        onClick={() => onToggle(ids, state !== 'true')}
      >
        <span className="spelling">{g.spelling}</span>
        {g.hint && <span className="hint">{g.hint}</span>}
      </button>
    )
  }

  return (
    <div className="tile tile-group" data-state={state}>
      <button
        type="button"
        className="tile-header"
        aria-pressed={state}
        aria-label={`Son ${sound.label} : toutes les graphies`}
        onClick={() => onToggle(ids, state !== 'true')}
      >
        son {sound.label}
      </button>
      <div className="spellings">
        {sound.graphemes.map((g) => (
          <button
            key={g.id}
            type="button"
            className="chip"
            aria-pressed={selection.has(g.id)}
            aria-label={`${g.spelling}${g.hint ? ` (${g.hint})` : ''}, son ${sound.label}`}
            onClick={() => onToggle([g.id], !selection.has(g.id))}
          >
            <span className="spelling">{g.spelling}</span>
            {g.hint && <span className="hint">{g.hint}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
