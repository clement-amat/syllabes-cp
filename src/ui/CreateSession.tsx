import { useEffect, useId, useMemo, useState } from 'react'
import {
  PATTERNS,
  drawSyllables,
  isValidCount,
  possibleSyllables,
  replaceSyllable,
  type Pattern,
} from '../domain/generator'
import { newId, type Session } from '../domain/session'
import { SoundPicker } from './SoundPicker'

interface Props {
  onSave: (session: Session, play: boolean) => void
  onCancel: () => void
}

const defaultName = () => `Séance du ${new Date().toLocaleDateString('fr-FR')}`

export function CreateSession({ onSave, onCancel }: Props) {
  const nameId = useId()
  const countId = useId()
  const [name, setName] = useState('')
  const [selection, setSelection] = useState<Set<string>>(() => new Set())
  const [patterns, setPatterns] = useState<Pattern[]>(['CV'])
  const [countInput, setCountInput] = useState('10')
  const [draw, setDraw] = useState<string[]>([])

  const pool = useMemo(() => possibleSyllables([...selection], patterns), [selection, patterns])
  const count = Number(countInput)
  const countOk = isValidCount(count, pool.length)

  useEffect(() => {
    setDraw(countOk ? drawSyllables(pool, count) : [])
  }, [pool, count, countOk])

  const togglePattern = (pattern: Pattern, on: boolean) =>
    setPatterns(PATTERNS.map((p) => p.id).filter((id) => (id === pattern ? on : patterns.includes(id))))

  const save = (play: boolean) =>
    onSave(
      {
        id: newId(),
        name: name.trim() || defaultName(),
        createdAt: new Date().toISOString(),
        graphemes: [...selection],
        patterns,
        syllables: draw,
      },
      play,
    )

  const canSave = countOk && draw.length === count

  return (
    <main className="page create">
      <header className="page-header">
        <h1>Nouvelle séance</h1>
      </header>

      <section className="panel">
        <label htmlFor={nameId} className="panel-title">
          Nom
        </label>
        <input
          id={nameId}
          className="input"
          placeholder={defaultName()}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </section>

      <section className="panel">
        <h2 className="panel-title">Sons déjà vus</h2>
        <SoundPicker selection={selection} onChange={setSelection} />
      </section>

      <section className="panel">
        <h2 className="panel-title">Types de syllabes</h2>
        <div className="patterns">
          {PATTERNS.map((p) => (
            <label key={p.id} className="pattern">
              <input
                type="checkbox"
                checked={patterns.includes(p.id)}
                onChange={(e) => togglePattern(p.id, e.target.checked)}
              />
              <span>
                {p.label}
                <span className="muted"> — {p.examples}</span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="count-row">
          <label htmlFor={countId} className="panel-title">
            Nombre de syllabes
          </label>
          <input
            id={countId}
            className="input count"
            type="number"
            min={1}
            max={Math.max(pool.length, 1)}
            value={countInput}
            onChange={(e) => setCountInput(e.target.value)}
          />
          <CountMessage available={pool.length} count={count} selectionSize={selection.size} />
        </div>

        {draw.length > 0 && (
          <div className="preview">
            <div className="preview-header">
              <h2 className="panel-title">Aperçu</h2>
              <span className="muted">Cliquer sur une syllabe pour la remplacer.</span>
              <button type="button" className="button ghost" onClick={() => setDraw(drawSyllables(pool, count))}>
                Nouveau tirage
              </button>
            </div>
            <ol className="preview-list">
              {draw.map((syllable, index) => (
                <li key={`${index}-${syllable}`}>
                  <button
                    type="button"
                    className="preview-syllable"
                    title="Remplacer"
                    disabled={pool.length === draw.length}
                    onClick={() => setDraw(replaceSyllable(draw, index, pool))}
                  >
                    {syllable}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>

      <footer className="action-bar">
        <button type="button" className="button ghost" onClick={onCancel}>
          Annuler
        </button>
        <button type="button" className="button" disabled={!canSave} onClick={() => save(false)}>
          Enregistrer
        </button>
        <button type="button" className="button primary" disabled={!canSave} onClick={() => save(true)}>
          Enregistrer et lancer
        </button>
      </footer>
    </main>
  )
}

function CountMessage({ available, count, selectionSize }: { available: number; count: number; selectionSize: number }) {
  if (selectionSize === 0) return <p className="muted">Choisissez les sons déjà vus.</p>
  if (available === 0)
    return <p className="warning">Aucune syllabe possible : ajoutez une voyelle ou un autre type de syllabe.</p>
  if (!Number.isInteger(count) || count < 1) return <p className="warning">Indiquez un nombre entier à partir de 1.</p>
  if (count > available)
    return (
      <p className="warning">
        Seulement {available} syllabe{available > 1 ? 's' : ''} possible{available > 1 ? 's' : ''} : ajoutez des sons ou
        baissez le nombre.
      </p>
    )
  return (
    <p className="muted">
      {available} syllabe{available > 1 ? 's' : ''} possible{available > 1 ? 's' : ''}.
    </p>
  )
}
