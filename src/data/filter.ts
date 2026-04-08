import type { CategoryFilter, CuisineFilter, Place } from '../types'

export interface FilterArgs {
  places: Place[]
  category: CategoryFilter
  cuisine: CuisineFilter
  hideVisited: boolean
  visitedSet: ReadonlySet<string>
}

/**
 * Filtra a lista de lugares aplicando as três dimensões juntas (AND):
 * categoria, culinária e visibilidade de visitados.
 *
 * Pure function — fácil de testar e memoizar.
 */
export function filterPlaces({
  places,
  category,
  cuisine,
  hideVisited,
  visitedSet,
}: FilterArgs): Place[] {
  return places.filter((p) => {
    if (category !== 'todos' && p.category !== category) return false
    if (cuisine !== 'todas' && !p.cuisines.includes(cuisine)) return false
    if (hideVisited && visitedSet.has(p.id)) return false
    return true
  })
}
