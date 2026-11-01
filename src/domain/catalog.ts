export type SoundKind = 'vowel' | 'consonant'

export interface Vowel {
  id: string
  spelling: string
  kind: 'vowel'
  hint?: string
  codas?: readonly string[]
  notAlone?: boolean
}

export interface Consonant {
  id: string
  spelling: string
  kind: 'consonant'
  hint?: string
  before?: 'soft' | 'hard'
  allowedVowels?: readonly string[]
  excludedVowels?: readonly string[]
  cluster?: 'head' | 'liquid'
  codaOnly?: boolean
}

export type Grapheme = Vowel | Consonant

export interface Sound {
  id: string
  label: string
  kind: SoundKind
  graphemes: readonly Grapheme[]
}

const CODAS = ['l', 'r', 's', 'c-k', 'f', 'p', 'k', 'x', 'ch']
const CODAS_E = CODAS.filter((coda) => coda !== 's')
const CODAS_COMPLEX = ['l', 'r', 'f']

const v = (id: string, spelling: string, options: Partial<Vowel> = {}): Vowel => ({
  id,
  spelling,
  kind: 'vowel',
  ...options,
})

const c = (id: string, spelling: string, options: Partial<Consonant> = {}): Consonant => ({
  id,
  spelling,
  kind: 'consonant',
  ...options,
})

const vowel = (id: string, graphemes: Vowel[]): Sound => ({ id, label: id, kind: 'vowel', graphemes })

const consonant = (id: string, graphemes: Consonant[]): Sound => ({ id, label: id, kind: 'consonant', graphemes })

export const CATALOG: readonly Sound[] = [
  vowel('a', [v('a', 'a', { codas: CODAS })]),
  vowel('i', [v('i', 'i', { codas: CODAS }), v('y-i', 'y')]),
  vowel('o', [v('o', 'o', { codas: CODAS }), v('au', 'au'), v('eau', 'eau')]),
  vowel('u', [v('u', 'u', { codas: CODAS })]),
  vowel('e', [v('e', 'e', { codas: CODAS_E })]),
  vowel('é', [v('é', 'é')]),
  vowel('è', [v('è', 'è'), v('ê', 'ê'), v('ai', 'ai'), v('ei', 'ei')]),
  vowel('ou', [v('ou', 'ou', { codas: CODAS_COMPLEX })]),
  vowel('on', [v('on', 'on'), v('om', 'om')]),
  vowel('an', [v('an', 'an'), v('am', 'am'), v('en', 'en'), v('em', 'em')]),
  vowel('in', [v('in', 'in'), v('im', 'im'), v('ain', 'ain'), v('ein', 'ein'), v('un', 'un')]),
  vowel('oi', [v('oi', 'oi', { codas: CODAS_COMPLEX })]),
  vowel('eu', [v('eu', 'eu', { codas: CODAS_COMPLEX }), v('œu', 'œu')]),
  vowel('oin', [v('oin', 'oin')]),
  vowel('ill', [v('ail', 'ail'), v('eil', 'eil'), v('euil', 'euil'), v('ouil', 'ouil'), v('ille', 'ille', { notAlone: true })]),

  consonant('l', [c('l', 'l', { cluster: 'liquid' })]),
  consonant('r', [c('r', 'r', { cluster: 'liquid' })]),
  consonant('m', [c('m', 'm')]),
  consonant('n', [c('n', 'n')]),
  consonant('s', [
    c('s', 's'),
    c('c-s', 'c', { hint: 'ce, ci', before: 'soft', excludedVowels: ['eil', 'euil'] }),
    c('ç', 'ç', { hint: 'ça, ço, çu', before: 'hard' }),
  ]),
  consonant('t', [c('t', 't', { cluster: 'head' })]),
  consonant('p', [c('p', 'p', { cluster: 'head' })]),
  consonant('d', [c('d', 'd', { cluster: 'head' })]),
  consonant('v', [c('v', 'v', { cluster: 'head' })]),
  consonant('f', [c('f', 'f', { cluster: 'head' }), c('ph', 'ph')]),
  consonant('ch', [c('ch', 'ch')]),
  consonant('j', [
    c('j', 'j'),
    c('g-j', 'g', { hint: 'ge, gi', before: 'soft', excludedVowels: ['eil', 'euil'] }),
    c('ge', 'ge', { hint: 'gea, geo', allowedVowels: ['a', 'o', 'ai', 'an', 'on', 'oi'] }),
  ]),
  consonant('b', [c('b', 'b', { cluster: 'head' })]),
  consonant('k', [
    c('c-k', 'c', { hint: 'ca, co, cu', before: 'hard', cluster: 'head' }),
    c('k', 'k'),
    c('qu', 'qu', { excludedVowels: ['u', 'ou', 'au', 'eau', 'œu', 'un', 'y-i', 'oin', 'ouil'] }),
  ]),
  consonant('g', [
    c('g-g', 'g', { hint: 'ga, go, gu', before: 'hard', cluster: 'head' }),
    c('gu', 'gu', { hint: 'gue, gui', before: 'soft', excludedVowels: ['eil', 'euil'] }),
  ]),
  consonant('z', [c('z', 'z')]),
  consonant('x', [c('x', 'x', { hint: 'en fin : ax, ix', codaOnly: true })]),
  consonant('gn', [c('gn', 'gn')]),
  consonant('h', [c('h', 'h', { hint: 'muet' })]),
  consonant('w', [c('w', 'w')]),
]

export const GRAPHEMES: ReadonlyMap<string, Grapheme> = new Map(
  CATALOG.flatMap((sound) => sound.graphemes.map((g) => [g.id, g] as const)),
)
