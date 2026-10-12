import { describe, expect, it } from 'vitest'
import { drawSyllables, possibleSyllables, replaceSyllable } from './generator'

const sorted = (ids: string[], patterns: Parameters<typeof possibleSyllables>[1]) =>
  possibleSyllables(ids, patterns).sort()

describe('possibleSyllables', () => {
  it('builds CV syllables', () => {
    expect(sorted(['m', 'l', 'a', 'i'], ['CV'])).toEqual(['la', 'li', 'ma', 'mi'])
  })

  it('applies hard and soft c / g', () => {
    expect(sorted(['c-k', 'c-s', 'a', 'i'], ['CV'])).toEqual(['ca', 'ci'])
    expect(sorted(['g-g', 'gu', 'a', 'e'], ['CV'])).toEqual(['ga', 'gue'])
    expect(sorted(['qu', 'i', 'ou'], ['CV'])).toEqual(['qui'])
  })

  it('builds VC and CVC with allowed codas only', () => {
    expect(sorted(['a', 'l', 'm', 'x'], ['VC'])).toEqual(['al', 'ax'])
    expect(sorted(['e', 's', 'r'], ['VC'])).toEqual(['er'])
    expect(sorted(['m', 'a', 'l', 'x'], ['CV', 'CVC'])).toEqual(['la', 'lal', 'lax', 'ma', 'mal', 'max'])
  })

  it('builds CCV clusters except dl, tl, vl', () => {
    expect(sorted(['b', 't', 'l', 'r', 'a'], ['CCV'])).toEqual(['bla', 'bra', 'tra'])
  })

  it('builds lone vowels without duplicates across patterns', () => {
    expect(sorted(['a', 'ille', 'm'], ['V', 'V'])).toEqual(['a'])
  })
})

describe('drawSyllables', () => {
  const pool = ['ma', 'mi', 'la', 'li']

  it('draws the exact count without duplicates', () => {
    const draw = drawSyllables(pool, 3)
    expect(draw).toHaveLength(3)
    expect(new Set(draw).size).toBe(3)
  })

  it('rejects impossible counts', () => {
    expect(() => drawSyllables(pool, 5)).toThrow(RangeError)
    expect(() => drawSyllables(pool, 0)).toThrow(RangeError)
  })
})

describe('replaceSyllable', () => {
  it('replaces with an unused syllable, or keeps the draw when none is left', () => {
    expect(replaceSyllable(['ma', 'mi'], 0, ['ma', 'mi', 'la'])).toEqual(['la', 'mi'])
    expect(replaceSyllable(['ma', 'mi'], 0, ['ma', 'mi'])).toEqual(['ma', 'mi'])
  })
})
