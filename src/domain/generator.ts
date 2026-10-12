import { GRAPHEMES, type Consonant, type Vowel } from './catalog'

export type Pattern = 'CV' | 'VC' | 'CVC' | 'CCV' | 'V'

export const PATTERNS: readonly { id: Pattern; label: string; examples: string }[] = [
  { id: 'CV', label: 'Consonne + voyelle', examples: 'ma, cho, lou' },
  { id: 'VC', label: 'Voyelle + consonne', examples: 'al, or, is' },
  { id: 'CVC', label: 'Consonne + voyelle + consonne', examples: 'mal, bec, tir' },
  { id: 'CCV', label: 'Deux consonnes + voyelle', examples: 'bra, pli, trou' },
  { id: 'V', label: 'Voyelle seule', examples: 'a, ou, on' },
]

const FORBIDDEN_CLUSTERS = new Set(['d+l', 't+l', 'v+l'])

const isSoft = (vowel: Vowel) => 'eéèêiy'.includes(vowel.spelling[0])

export function canPrecede(consonant: Consonant, vowel: Vowel): boolean {
  if (consonant.codaOnly) return false
  if (consonant.before === 'soft' && !isSoft(vowel)) return false
  if (consonant.before === 'hard' && isSoft(vowel)) return false
  if (consonant.allowedVowels && !consonant.allowedVowels.includes(vowel.id)) return false
  if (consonant.excludedVowels?.includes(vowel.id)) return false
  return true
}

export function possibleSyllables(ids: readonly string[], patterns: readonly Pattern[]): string[] {
  const graphemes = ids.flatMap((id) => GRAPHEMES.get(id) ?? [])
  const vowels = graphemes.filter((g): g is Vowel => g.kind === 'vowel')
  const consonants = graphemes.filter((g): g is Consonant => g.kind === 'consonant')
  const onsets = (vowel: Vowel) => consonants.filter((co) => canPrecede(co, vowel))
  const codas = (vowel: Vowel) => consonants.filter((co) => vowel.codas?.includes(co.id))
  const heads = consonants.filter((co) => co.cluster === 'head')
  const liquids = consonants.filter((co) => co.cluster === 'liquid')

  const result = new Set<string>()
  const add = (...parts: { spelling: string }[]) => result.add(parts.map((p) => p.spelling).join(''))

  for (const pattern of patterns) {
    for (const vo of vowels) {
      switch (pattern) {
        case 'V':
          if (!vo.notAlone) add(vo)
          break
        case 'CV':
          onsets(vo).forEach((on) => add(on, vo))
          break
        case 'VC':
          codas(vo).forEach((co) => add(vo, co))
          break
        case 'CVC':
          onsets(vo).forEach((on) => codas(vo).forEach((co) => add(on, vo, co)))
          break
        case 'CCV':
          heads.forEach((head) =>
            liquids
              .filter((liquid) => !FORBIDDEN_CLUSTERS.has(`${head.id}+${liquid.id}`))
              .forEach((liquid) => add(head, liquid, vo)),
          )
          break
      }
    }
  }
  return [...result]
}

export type Random = () => number

function shuffle<T>(items: readonly T[], random: Random): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export const isValidCount = (count: number, available: number) =>
  Number.isInteger(count) && count >= 1 && count <= available

export function drawSyllables(pool: readonly string[], count: number, random: Random = Math.random): string[] {
  if (!isValidCount(count, pool.length)) {
    throw new RangeError(`Cannot draw ${count} syllables out of ${pool.length}`)
  }
  return shuffle(pool, random).slice(0, count)
}

export function replaceSyllable(
  draw: readonly string[],
  index: number,
  pool: readonly string[],
  random: Random = Math.random,
): string[] {
  const unused = pool.filter((s) => !draw.includes(s))
  if (unused.length === 0) return [...draw]
  const replacement = unused[Math.floor(random() * unused.length)]
  return draw.map((s, i) => (i === index ? replacement : s))
}
