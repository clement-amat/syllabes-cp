export type Font = 'script' | 'cursive' | 'capitals'

export const FONTS: readonly { id: Font; label: string }[] = [
  { id: 'script', label: 'Script' },
  { id: 'cursive', label: 'Cursive' },
  { id: 'capitals', label: 'Capitales' },
]

export const isFont = (value: unknown): value is Font => FONTS.some((f) => f.id === value)
