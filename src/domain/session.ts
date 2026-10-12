import type { Pattern } from './generator'

export interface Session {
  id: string
  name: string
  createdAt: string
  graphemes: string[]
  patterns: Pattern[]
  syllables: string[]
}

export const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
