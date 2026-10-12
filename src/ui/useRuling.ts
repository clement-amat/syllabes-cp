import { useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react'

interface Refs {
  stage: RefObject<HTMLElement | null>
  text: RefObject<HTMLElement | null>
  baseline: RefObject<HTMLElement | null>
}

const CAPITAL_HEIGHT_IN_LINES = 3

function measureGlyphHeight(text: HTMLElement): number {
  const style = getComputedStyle(text)
  const context = document.createElement('canvas').getContext('2d')
  if (!context) return 0
  context.font = style.font
  const capitals = style.textTransform === 'uppercase'
  const height = context.measureText(capitals ? 'H' : 'x').actualBoundingBoxAscent
  return capitals ? height / CAPITAL_HEIGHT_IN_LINES : height
}

export function useRuling(enabled: boolean, refs: Refs, deps: unknown[]): CSSProperties | undefined {
  const [ruling, setRuling] = useState<{ unit: number; baseline: number } | null>(null)

  useLayoutEffect(() => {
    if (!enabled) {
      setRuling(null)
      return
    }
    let active = true
    const measure = () => {
      const stage = refs.stage.current
      const text = refs.text.current
      const baseline = refs.baseline.current
      if (!active || !stage || !text || !baseline) return
      const unit = measureGlyphHeight(text)
      if (unit <= 0) return
      setRuling({
        unit,
        baseline: baseline.getBoundingClientRect().top - stage.getBoundingClientRect().top,
      })
    }
    measure()
    document.fonts.ready.then(measure)
    const observer = new ResizeObserver(measure)
    if (refs.stage.current) observer.observe(refs.stage.current)
    return () => {
      active = false
      observer.disconnect()
    }
  }, [enabled, ...deps])

  if (!enabled || !ruling) return undefined
  return { '--unit': `${ruling.unit}px`, '--baseline': `${ruling.baseline}px` } as CSSProperties
}
