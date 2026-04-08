import { useState } from 'react'
import type { Place } from '../types'
import { CATEGORY_BY_ID, CUISINE_BY_ID } from '../data/taxonomy'
import { PhotoCarousel } from './PhotoCarousel'

interface Props {
  place: Place
  visited: boolean
  onToggleVisited: (id: string) => void
  onEdit: (place: Place) => void
}

export function PlaceCard({ place, visited, onToggleVisited, onEdit }: Props) {
  const [open, setOpen] = useState(false)
  const category = CATEGORY_BY_ID[place.category]

  return (
    <article
      className={`group relative overflow-hidden rounded-sm border bg-gradient-to-b from-ink-900 to-ink-950 transition-all duration-500 animate-fade-up ${
        visited
          ? 'border-ink-800/70 opacity-70'
          : 'border-ink-800 hover:border-gold-700/40'
      }`}
    >
      {/* Linha dourada superior em hover */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* HEADER ROW (preview) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-5 sm:px-7 py-6"
        aria-expanded={open}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CategoryBadge label={category?.label ?? ''} emoji={category?.emoji ?? ''} />

            <h3
              className={`mt-3 font-display text-2xl sm:text-3xl leading-tight ${
                visited ? 'text-sand-300 line-through decoration-gold-700/40' : 'text-sand-50'
              }`}
            >
              {place.name}
            </h3>

            <p className="mt-2 text-[10px] sm:text-[11px] tracking-widest2 uppercase text-sand-400">
              {place.vibe}
            </p>

            <div className="mt-4 flex items-center gap-3 text-sand-300 text-sm">
              <span className="font-medium tracking-wider text-gold-400">
                {priceLabel(place.price)}
              </span>
              <span className="text-ink-600">·</span>
              <span className="text-[10px] tracking-widest2 uppercase text-sand-400">
                {open ? '▲ recolher' : '▼ detalhes + fotos'}
              </span>
            </div>
          </div>

          <VisitedToggle
            visited={visited}
            onClick={(e) => {
              e.stopPropagation()
              onToggleVisited(place.id)
            }}
          />
        </div>
      </button>

      {/* EXPANDED */}
      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 sm:px-7 pb-7 space-y-5 animate-fade-in">
            <div className="hairline" />

            <PhotoCarousel photos={place.photos} alt={place.name} />

            {place.description && (
              <p className="text-sand-200 text-[15px] leading-relaxed font-light">
                {place.description}
              </p>
            )}

            <DetailGrid place={place} />

            {place.highlight && (
              <div className="flex items-start gap-3 border-l-2 border-gold-500 pl-4 py-1">
                <span className="text-gold-400 text-lg leading-none mt-0.5">★</span>
                <p className="text-sand-100 text-sm italic font-display">
                  {place.highlight}
                </p>
              </div>
            )}

            <ExternalLinks place={place} />

            {place.cuisines.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {place.cuisines.map((id) => {
                  const c = CUISINE_BY_ID[id]
                  if (!c) return null
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 rounded-full border border-gold-700/40 bg-gold-700/10 px-2.5 py-1 text-[10px] tracking-wide uppercase text-gold-300"
                    >
                      <span className="text-[11px] leading-none">{c.emoji}</span>
                      {c.label}
                    </span>
                  )
                })}
              </div>
            )}

            {place.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {place.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-ink-700 bg-ink-850 px-2.5 py-1 text-[10px] tracking-wide text-sand-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => onEdit(place)}
                className="text-[10px] tracking-widest2 uppercase text-sand-400 hover:text-gold-400 transition"
              >
                ✎ Editar lugar
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

/**
 * Links externos do card: Instagram (handle direto se existir, ou busca pelo
 * nome se faltar) + Google Maps (sempre presente — busca pelo nome + endereço).
 */
function ExternalLinks({ place }: { place: Place }) {
  const igHref = place.instagram
    ? `https://instagram.com/${place.instagram.replace('@', '')}`
    : `https://www.google.com/search?q=${encodeURIComponent(`${place.name} Florianópolis instagram`)}`

  const igLabel = place.instagram ?? 'Buscar no Instagram'

  const mapsQuery = encodeURIComponent(
    [place.name, place.address, 'Florianópolis'].filter(Boolean).join(' '),
  )
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2">
      <a
        href={igHref}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 text-xs tracking-wide text-gold-400 hover:text-gold-300 transition"
      >
        <span>◐</span> {igLabel}
      </a>
      <a
        href={mapsHref}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 text-xs tracking-wide text-gold-400 hover:text-gold-300 transition"
      >
        <span>◎</span> Google Maps
      </a>
    </div>
  )
}

function CategoryBadge({ label, emoji }: { label: string; emoji: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-700/40 bg-gold-700/10 px-2.5 py-1 text-[10px] tracking-widest2 uppercase text-gold-300">
      <span className="text-[11px] leading-none">{emoji}</span>
      {label}
    </span>
  )
}

function VisitedToggle({
  visited,
  onClick,
}: {
  visited: boolean
  onClick: (e: React.MouseEvent) => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={visited}
      aria-label={visited ? 'Marcar como não visitado' : 'Marcar como visitado'}
      className={`shrink-0 h-11 w-11 rounded-full border flex items-center justify-center transition-all duration-300 ${
        visited
          ? 'border-gold-500 bg-gradient-to-b from-gold-500 to-gold-700 text-ink-950 shadow-gold scale-100'
          : 'border-ink-600 bg-ink-850 text-ink-600 hover:border-gold-700/60 hover:text-gold-500 active:scale-95'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-5 w-5 transition-transform duration-500 ${
          visited ? 'scale-100 rotate-0' : 'scale-90 -rotate-12'
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 13l4 4L19 7" />
      </svg>
    </button>
  )
}

function DetailGrid({ place }: { place: Place }) {
  const cozinha = place.cuisines.length
    ? place.cuisines.map((c) => CUISINE_BY_ID[c]?.label).filter(Boolean).join(' · ')
    : '—'

  // Cozinha sempre aparece (vira "—" quando vazio); demais só quando preenchidos.
  const items: Array<{ label: string; value: string }> = [{ label: 'Cozinha', value: cozinha }]
  if (place.address) items.push({ label: 'Endereço', value: place.address })
  if (place.hours) items.push({ label: 'Horário', value: place.hours })
  if (place.closed) items.push({ label: 'Fecha', value: place.closed })

  return (
    <dl className="grid grid-cols-2 gap-x-5 gap-y-4">
      {items.map((it) => (
        <div key={it.label}>
          <dt className="text-[9px] tracking-widest2 uppercase text-sand-500">{it.label}</dt>
          <dd className="mt-1 text-[13px] text-sand-100 leading-snug">{it.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function priceLabel(price: Place['price']): string {
  if (price === 'gratis') return 'Gratuito'
  return price
}
