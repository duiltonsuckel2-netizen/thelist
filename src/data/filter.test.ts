import { describe, expect, it } from 'vitest'
import { filterPlaces } from './filter'
import type { Place } from '../types'

const place = (overrides: Partial<Place>): Place => ({
  id: 'x',
  name: 'X',
  category: 'jantar',
  cuisines: [],
  vibe: '',
  price: '$$',
  tags: [],
  photos: [],
  ...overrides,
})

const sushi = place({ id: 'sushi', category: 'jantar', cuisines: ['japonesa'] })
const pizza = place({ id: 'pizza', category: 'jantar', cuisines: ['pizza', 'italiana'] })
const cafe = place({ id: 'cafe', category: 'cafe', cuisines: ['cafe-especial'] })
const bar = place({ id: 'bar', category: 'drinks', cuisines: ['bar-petiscos'] })

const ALL = [sushi, pizza, cafe, bar]
const empty: ReadonlySet<string> = new Set()

describe('filterPlaces', () => {
  it('retorna tudo quando filtros são "todos" / "todas"', () => {
    const result = filterPlaces({
      places: ALL,
      category: 'todos',
      cuisine: 'todas',
      hideVisited: false,
      visitedSet: empty,
    })
    expect(result).toEqual(ALL)
  })

  it('filtra por categoria', () => {
    const result = filterPlaces({
      places: ALL,
      category: 'jantar',
      cuisine: 'todas',
      hideVisited: false,
      visitedSet: empty,
    })
    expect(result).toEqual([sushi, pizza])
  })

  it('filtra por culinária', () => {
    const result = filterPlaces({
      places: ALL,
      category: 'todos',
      cuisine: 'japonesa',
      hideVisited: false,
      visitedSet: empty,
    })
    expect(result).toEqual([sushi])
  })

  it('combina categoria + culinária com AND', () => {
    const result = filterPlaces({
      places: ALL,
      category: 'jantar',
      cuisine: 'pizza',
      hideVisited: false,
      visitedSet: empty,
    })
    expect(result).toEqual([pizza])
  })

  it('AND vazio quando filtros são incompatíveis', () => {
    const result = filterPlaces({
      places: ALL,
      category: 'cafe',
      cuisine: 'pizza',
      hideVisited: false,
      visitedSet: empty,
    })
    expect(result).toEqual([])
  })

  it('considera múltiplas culinárias por lugar', () => {
    const result = filterPlaces({
      places: ALL,
      category: 'todos',
      cuisine: 'italiana',
      hideVisited: false,
      visitedSet: empty,
    })
    expect(result).toEqual([pizza])
  })

  it('esconde visitados quando hideVisited=true', () => {
    const result = filterPlaces({
      places: ALL,
      category: 'todos',
      cuisine: 'todas',
      hideVisited: true,
      visitedSet: new Set(['sushi', 'cafe']),
    })
    expect(result).toEqual([pizza, bar])
  })

  it('mantém visitados quando hideVisited=false', () => {
    const result = filterPlaces({
      places: ALL,
      category: 'todos',
      cuisine: 'todas',
      hideVisited: false,
      visitedSet: new Set(['sushi', 'cafe']),
    })
    expect(result).toEqual(ALL)
  })

  it('lista vazia retorna lista vazia', () => {
    const result = filterPlaces({
      places: [],
      category: 'todos',
      cuisine: 'todas',
      hideVisited: false,
      visitedSet: empty,
    })
    expect(result).toEqual([])
  })
})
