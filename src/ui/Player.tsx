import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { FONTS, type Font } from '../domain/font'
import type { Session } from '../domain/session'
import { useRuling } from './useRuling'

interface Props {
  session: Session
  font: Font
  ruled: boolean
  onFontChange: (font: Font) => void
  onRuledChange: (ruled: boolean) => void
  onExit: () => void
}

const NEXT_KEYS = ['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter']
const PREVIOUS_KEYS = ['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace']

export function Player({ session, font, ruled, onFontChange, onRuledChange, onExit }: Props) {
  const [index, setIndex] = useState(0)
  const total = session.syllables.length
  const isLast = index === total - 1
  const syllable = session.syllables[index]
  const stageRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const baselineRef = useRef<HTMLSpanElement>(null)
  const ruling = useRuling(ruled, { stage: stageRef, text: textRef, baseline: baselineRef }, [font, syllable])

  const next = useCallback(() => (isLast ? onExit() : setIndex((i) => i + 1)), [isLast, onExit])
  const previous = useCallback(() => setIndex((i) => Math.max(0, i - 1)), [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const onButton = event.target instanceof HTMLButtonElement
      if (onButton && (event.key === ' ' || event.key === 'Enter')) return
      if (NEXT_KEYS.includes(event.key)) {
        event.preventDefault()
        next()
      } else if (PREVIOUS_KEYS.includes(event.key)) {
        event.preventDefault()
        previous()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, previous])

  return (
    <main className={`player font-${font}${ruled ? ' ruled' : ''}`}>
      <div className="progress" aria-hidden="true">
        <div className="progress-bar" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      <div ref={stageRef} className={ruling ? 'stage ruled' : 'stage'} style={ruling}>
        <p
          ref={textRef}
          className="syllable"
          style={{ '--letters': [...syllable].length } as CSSProperties}
          aria-live="polite"
        >
          {syllable}
          <span ref={baselineRef} className="baseline-probe" />
        </p>
      </div>

      <nav className="controls" aria-label="Navigation">
        <div className="controls-side">
          <button type="button" className="button ghost" onClick={onExit}>
            Quitter
          </button>
          <FullscreenButton />
        </div>

        <div className="controls-main">
          <button type="button" className="button nav" onClick={previous} disabled={index === 0}>
            ← Précédente
          </button>
          <span className="counter">
            {index + 1} / {total}
          </span>
          <button type="button" className="button nav primary" onClick={next}>
            {isLast ? 'Terminer' : 'Suivante →'}
          </button>
        </div>

        <div className="controls-side controls-end">
          <div className="segmented" role="group" aria-label="Police">
            {FONTS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`segment font-${f.id}`}
                aria-pressed={font === f.id}
                onClick={() => onFontChange(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button type="button" className="button ghost" aria-pressed={ruled} onClick={() => onRuledChange(!ruled)}>
            Lignes
          </button>
        </div>
      </nav>
    </main>
  )
}

function FullscreenButton() {
  const [active, setActive] = useState(() => document.fullscreenElement !== null)

  useEffect(() => {
    const onChange = () => setActive(document.fullscreenElement !== null)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  if (!document.fullscreenEnabled) return null

  const toggle = () => {
    const request = active ? document.exitFullscreen() : document.documentElement.requestFullscreen()
    request.catch(() => {})
  }

  return (
    <button type="button" className="button ghost" onClick={toggle}>
      {active ? 'Fenêtre' : 'Plein écran'}
    </button>
  )
}
