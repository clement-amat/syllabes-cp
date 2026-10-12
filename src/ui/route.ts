import { useCallback, useEffect, useState } from 'react'

export type Route = { screen: 'home' } | { screen: 'create' } | { screen: 'play'; id: string }

export function parseRoute(hash: string): Route {
  const path = hash.replace(/^#/, '')
  if (path === '/new') return { screen: 'create' }
  const play = path.match(/^\/session\/(.+)$/)
  if (play) return { screen: 'play', id: decodeURIComponent(play[1]) }
  return { screen: 'home' }
}

export function toHash(route: Route): string {
  switch (route.screen) {
    case 'home':
      return '#/'
    case 'create':
      return '#/new'
    case 'play':
      return `#/session/${encodeURIComponent(route.id)}`
  }
}

export function useRoute(): [Route, (route: Route) => void] {
  const [hash, setHash] = useState(() => window.location.hash)

  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = useCallback((route: Route) => {
    window.location.hash = toHash(route)
    setHash(window.location.hash)
  }, [])

  return [parseRoute(hash), navigate]
}
