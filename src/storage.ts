import { isFont, type Font } from './domain/font'
import type { Session } from './domain/session'

const SESSIONS_KEY = 'syllabes-cp:sessions'
const FONT_KEY = 'syllabes-cp:font'
const RULED_KEY = 'syllabes-cp:ruled'

export interface Storage {
  readonly persistent: boolean
  list(): Session[]
  save(session: Session): void
  remove(id: string): void
  font(): Font | null
  saveFont(font: Font): void
  ruled(): boolean
  saveRuled(ruled: boolean): void
}

const isStringList = (value: unknown) => Array.isArray(value) && value.every((x) => typeof x === 'string')

const isSession = (value: unknown): value is Session => {
  const s = value as Session
  return (
    typeof s === 'object' &&
    s !== null &&
    typeof s.id === 'string' &&
    typeof s.name === 'string' &&
    typeof s.createdAt === 'string' &&
    isStringList(s.graphemes) &&
    isStringList(s.patterns) &&
    isStringList(s.syllables) &&
    s.syllables.length > 0
  )
}

function probe(): globalThis.Storage | null {
  try {
    const storage = window.localStorage
    const key = 'syllabes-cp:probe'
    storage.setItem(key, key)
    storage.removeItem(key)
    return storage
  } catch {
    return null
  }
}

export function createStorage(): Storage {
  let backend = probe()

  const read = (key: string): unknown => {
    try {
      const raw = backend?.getItem(key)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  const write = (key: string, value: unknown) => {
    try {
      backend?.setItem(key, JSON.stringify(value))
    } catch {
      backend = null
    }
  }

  const stored = read(SESSIONS_KEY)
  let sessions: Session[] = Array.isArray(stored) ? stored.filter(isSession) : []
  const storedFont = read(FONT_KEY)
  let font: Font | null = isFont(storedFont) ? storedFont : null
  let ruled = read(RULED_KEY) === true

  return {
    get persistent() {
      return backend !== null
    },
    list: () => [...sessions],
    save(session) {
      sessions = [session, ...sessions.filter((s) => s.id !== session.id)]
      write(SESSIONS_KEY, sessions)
    },
    remove(id) {
      sessions = sessions.filter((s) => s.id !== id)
      write(SESSIONS_KEY, sessions)
    },
    font: () => font,
    saveFont(next) {
      font = next
      write(FONT_KEY, next)
    },
    ruled: () => ruled,
    saveRuled(next) {
      ruled = next
      write(RULED_KEY, next)
    },
  }
}
