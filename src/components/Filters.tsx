import { CATEGORIES, CUISINES } from '../data/taxonomy'
import type { CategoryFilter, CuisineFilter } from '../types'

interface Props {
  category: CategoryFilter
  cuisine: CuisineFilter
  onCategoryChange: (id: CategoryFilter) => void
  onCuisineChange: (id: CuisineFilter) => void
  hideVisited: boolean
  onToggleHideVisited: () => void
}

export function Filters({
  category,
  cuisine,
  onCategoryChange,
  onCuisineChange,
  hideVisited,
  onToggleHideVisited,
}: Props) {
  return (
    <div className="sticky top-0 z-30 backdrop-blur-xl bg-ink-950/85 border-b border-ink-800/60">
      <div className="max-w-3xl mx-auto px-4 sm:px-10 py-4 space-y-3">
        <Row label="Categoria">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={category === c.id}
              onClick={() => onCategoryChange(c.id)}
              className={`chip ${category === c.id ? 'chip-active' : ''}`}
            >
              <span className="text-sm leading-none">{c.emoji}</span>
              {c.label}
            </button>
          ))}
        </Row>

        <Row label="Culinária">
          {CUISINES.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={cuisine === c.id}
              onClick={() => onCuisineChange(c.id)}
              className={`chip ${cuisine === c.id ? 'chip-active' : ''}`}
            >
              <span className="text-sm leading-none">{c.emoji}</span>
              {c.label}
            </button>
          ))}
        </Row>

        <div className="pt-1 flex items-center justify-end">
          <button
            type="button"
            aria-pressed={hideVisited}
            onClick={onToggleHideVisited}
            className={`text-[10px] tracking-widest2 uppercase transition-colors ${
              hideVisited ? 'text-gold-400' : 'text-sand-400 hover:text-sand-200'
            }`}
          >
            {hideVisited ? '◉ Escondendo visitados' : '○ Esconder visitados'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[9px] tracking-widest2 uppercase text-sand-500 mb-2 pl-1">
        {label}
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {children}
      </div>
    </div>
  )
}
