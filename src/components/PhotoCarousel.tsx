import { useRef, useState, type TouchEvent } from 'react'
import { SmartImage } from './SmartImage'

interface Props {
  photos: string[]
  alt: string
}

export function PhotoCarousel({ photos, alt }: Props) {
  const [index, setIndex] = useState(0)
  const startX = useRef<number | null>(null)
  const deltaX = useRef(0)

  const goTo = (i: number) => {
    if (photos.length === 0) return
    const next = ((i % photos.length) + photos.length) % photos.length
    setIndex(next)
  }

  const onTouchStart = (e: TouchEvent) => {
    startX.current = e.touches[0]?.clientX ?? null
    deltaX.current = 0
  }
  const onTouchMove = (e: TouchEvent) => {
    if (startX.current === null) return
    deltaX.current = (e.touches[0]?.clientX ?? 0) - startX.current
  }
  const onTouchEnd = () => {
    if (Math.abs(deltaX.current) > 40) {
      goTo(index + (deltaX.current < 0 ? 1 : -1))
    }
    startX.current = null
    deltaX.current = 0
  }

  if (photos.length === 0) return null

  return (
    <div className="relative">
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-sm bg-ink-800"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {photos.map((src, i) => (
          <SmartImage
            key={`${src}-${i}`}
            src={src}
            alt={`${alt} — foto ${i + 1}`}
            fallbackSeed={`${alt}-${i}`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {/* Gradient overlay sutil pra dar profundidade */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />

        {/* Navegação lateral (desktop) */}
        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Foto anterior"
              className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-ink-950/60 backdrop-blur text-sand-100 hover:bg-ink-950/85 transition"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Próxima foto"
              className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-ink-950/60 backdrop-blur text-sand-100 hover:bg-ink-950/85 transition"
            >
              ›
            </button>
          </>
        )}

        {/* Contador */}
        <div className="absolute top-3 right-3 text-[10px] tracking-widest2 uppercase text-sand-100/90 bg-ink-950/60 backdrop-blur px-2 py-1 rounded-sm">
          {index + 1} / {photos.length}
        </div>
      </div>

      {/* Dots */}
      {photos.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Foto ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === index ? 'w-6 bg-gold-500' : 'w-1.5 bg-ink-600 hover:bg-ink-600'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
