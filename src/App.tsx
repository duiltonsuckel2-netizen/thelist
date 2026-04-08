import { useMemo, useState } from 'react'
import { Header } from './components/Header'
import { Filters } from './components/Filters'
import { PlaceCard } from './components/PlaceCard'
import { FAB } from './components/FAB'
import { AddPlaceModal } from './components/AddPlaceModal'
import { useLocalStorage } from './hooks/useLocalStorage'
import { INITIAL_PLACES } from './data/initialPlaces'
import { parsePlacesArray } from './data/validate'
import { filterPlaces } from './data/filter'
import type { CategoryFilter, CuisineFilter, Place } from './types'

const STORAGE = {
  places: 'meus-lugares.places.v1',
  visited: 'meus-lugares.visited.v1',
  hideVisited: 'meus-lugares.hideVisited.v1',
}

const parseStringArray = (raw: unknown): string[] | null =>
  Array.isArray(raw) && raw.every((v): v is string => typeof v === 'string') ? raw : null

const parseBool = (raw: unknown): boolean | null =>
  typeof raw === 'boolean' ? raw : null

export default function App() {
  const [places, setPlaces] = useLocalStorage<Place[]>(STORAGE.places, INITIAL_PLACES, {
    parse: parsePlacesArray,
  })
  const [visitedIds, setVisitedIds] = useLocalStorage<string[]>(STORAGE.visited, [], {
    parse: parseStringArray,
  })
  const [hideVisited, setHideVisited] = useLocalStorage<boolean>(STORAGE.hideVisited, false, {
    parse: parseBool,
  })

  const [category, setCategory] = useState<CategoryFilter>('todos')
  const [cuisine, setCuisine] = useState<CuisineFilter>('todas')
  const [modalOpen, setModalOpen] = useState(false)

  const visitedSet = useMemo(() => new Set(visitedIds), [visitedIds])

  const filtered = useMemo(
    () => filterPlaces({ places, category, cuisine, hideVisited, visitedSet }),
    [places, category, cuisine, hideVisited, visitedSet],
  )

  const toggleVisited = (id: string) =>
    setVisitedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const addPlace = (place: Place) => setPlaces((prev) => [place, ...prev])

  const totalVisited = places.reduce((acc, p) => (visitedSet.has(p.id) ? acc + 1 : acc), 0)

  return (
    <div className="min-h-screen text-sand-100 grain">
      {/* Glow ambiente sutil no topo */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-[420px] -z-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(196,163,90,0.10) 0%, rgba(196,163,90,0.04) 30%, transparent 65%)',
        }}
      />

      <div className="relative z-10">
        <Header total={places.length} visited={totalVisited} />

        <Filters
          category={category}
          cuisine={cuisine}
          onCategoryChange={setCategory}
          onCuisineChange={setCuisine}
          hideVisited={hideVisited}
          onToggleHideVisited={() => setHideVisited(!hideVisited)}
        />

        <main className="max-w-3xl mx-auto px-4 sm:px-10 py-10 space-y-6 pb-32">
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            filtered.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                visited={visitedSet.has(place.id)}
                onToggleVisited={toggleVisited}
              />
            ))
          )}
        </main>

        <Footer count={filtered.length} />
      </div>

      <FAB onClick={() => setModalOpen(true)} />
      <AddPlaceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={addPlace}
      />
    </div>
  )
}

function EmptyState() {
  return (
    <div className="border border-dashed border-ink-700 rounded-sm py-16 text-center">
      <p className="text-[10px] tracking-widest2 uppercase text-sand-500 mb-3">Vazio</p>
      <p className="font-display text-xl text-sand-200">
        Nenhum lugar bate com esses filtros.
      </p>
      <p className="mt-2 text-sm text-sand-400">
        Ajusta os filtros ou adiciona um novo no botão dourado ↘
      </p>
    </div>
  )
}

function Footer({ count }: { count: number }) {
  return (
    <footer className="max-w-3xl mx-auto px-6 sm:px-10 pb-16 text-center">
      <div className="hairline mb-6" />
      <p className="text-[10px] tracking-widest2 uppercase text-sand-500">
        {count} {count === 1 ? 'lugar' : 'lugares'} no recorte
      </p>
      <p className="mt-2 font-display italic text-sand-400 text-sm">
        Florianópolis · pra ir devagar
      </p>
    </footer>
  )
}
