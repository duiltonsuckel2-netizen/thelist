import { useEffect, useState, type FormEvent } from 'react'
import { CATEGORIES_FOR_FORM, CUISINES_FOR_FORM } from '../data/taxonomy'
import type { CategoryId, CuisineId, Place, PriceRange } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (place: Place) => void
}

const PRICE_OPTIONS: PriceRange[] = ['$', '$$', '$$$', '$$$$']

const EMPTY_FORM = {
  name: '',
  category: 'jantar' as CategoryId,
  cuisines: [] as CuisineId[],
  vibe: '',
  address: '',
  hours: '',
  price: '$$' as PriceRange,
  instagram: '',
  description: '',
  photoUrls: '',
}

type FormState = typeof EMPTY_FORM

export function AddPlaceModal({ open, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const toggleCuisine = (id: CuisineId) =>
    setForm((f) => ({
      ...f,
      cuisines: f.cuisines.includes(id)
        ? f.cuisines.filter((c) => c !== id)
        : [...f.cuisines, id],
    }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return

    const photos = form.photoUrls
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean)

    const place: Place = {
      id: `${slugify(form.name)}-${Date.now().toString(36)}`,
      name: form.name.trim(),
      category: form.category,
      cuisines: form.cuisines,
      vibe: form.vibe.trim(),
      address: form.address.trim() || undefined,
      hours: form.hours.trim() || undefined,
      price: form.price,
      instagram: form.instagram.trim() || undefined,
      description: form.description.trim() || undefined,
      tags: [],
      photos: photos.length > 0 ? photos : defaultPhotoSet(),
    }

    onSubmit(place)
    setForm(EMPTY_FORM)
    onClose()
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm animate-fade-in"
      />

      <div className="relative w-full sm:max-w-xl max-h-[92vh] overflow-y-auto bg-gradient-to-b from-ink-900 to-ink-950 border-t sm:border border-ink-800 sm:rounded-sm shadow-editorial animate-sheet-up">
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-ink-950/95 backdrop-blur border-b border-ink-800">
          <div>
            <p className="text-[10px] tracking-widest2 uppercase text-gold-500/80">
              Adicionar
            </p>
            <h2 className="font-display text-2xl text-sand-50">Novo lugar</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="h-9 w-9 rounded-full border border-ink-700 text-sand-300 hover:border-gold-700/60 hover:text-gold-400 transition"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          <Field label="Nome *">
            <input
              required
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="ex: Trapiche Bistrô"
              className={inputClass}
            />
          </Field>

          <Field label="Categoria">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES_FOR_FORM.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => update('category', c.id as CategoryId)}
                  className={`chip ${form.category === c.id ? 'chip-active' : ''}`}
                >
                  <span>{c.emoji}</span> {c.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Culinária (multi-seleção)">
            <div className="flex flex-wrap gap-2">
              {CUISINES_FOR_FORM.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleCuisine(c.id as CuisineId)}
                  className={`chip ${
                    form.cuisines.includes(c.id as CuisineId) ? 'chip-active' : ''
                  }`}
                >
                  <span>{c.emoji}</span> {c.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Vibe">
            <input
              value={form.vibe}
              onChange={(e) => update('vibe', e.target.value)}
              placeholder="ex: Tranquilo · Moderno · Vista"
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Endereço">
              <input
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                placeholder="Bairro / rua"
                className={inputClass}
              />
            </Field>

            <Field label="Horário">
              <input
                value={form.hours}
                onChange={(e) => update('hours', e.target.value)}
                placeholder="ex: Ter–Sáb 19h–23h"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Faixa de preço">
            <div className="flex gap-2">
              {PRICE_OPTIONS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => update('price', p)}
                  className={`chip ${form.price === p ? 'chip-active' : ''}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Instagram">
            <input
              value={form.instagram}
              onChange={(e) => update('instagram', e.target.value)}
              placeholder="@handle"
              className={inputClass}
            />
          </Field>

          <Field label="Nota / descrição">
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              rows={3}
              placeholder="Por que esse lugar tá na lista?"
              className={`${inputClass} resize-none`}
            />
          </Field>

          <Field label="URLs de fotos (uma por linha ou separadas por vírgula)">
            <textarea
              value={form.photoUrls}
              onChange={(e) => update('photoUrls', e.target.value)}
              rows={3}
              placeholder="https://..."
              className={`${inputClass} resize-none font-mono text-xs`}
            />
          </Field>

          <div className="pt-2 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs tracking-widest2 uppercase text-sand-300 hover:text-sand-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs tracking-widest2 uppercase bg-gradient-to-b from-gold-500 to-gold-700 text-ink-950 font-semibold rounded-sm shadow-gold hover:from-gold-400 hover:to-gold-600 transition"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const inputClass =
  'w-full bg-ink-850 border border-ink-700 rounded-sm px-4 py-3 text-sand-100 placeholder-sand-500 focus:outline-none focus:border-gold-700/60 focus:ring-1 focus:ring-gold-700/30 transition'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] tracking-widest2 uppercase text-sand-400 mb-2">
        {label}
      </span>
      {children}
    </label>
  )
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function defaultPhotoSet(): string[] {
  // Galeria neutra elegante caso o usuário não cole nenhuma URL
  return [
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=900&q=80&auto=format&fit=crop',
  ]
}
