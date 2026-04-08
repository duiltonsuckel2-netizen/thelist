import type { CategoryId, CuisineId, Place, PriceRange } from '../types'

const VALID_CATEGORIES: ReadonlySet<CategoryId> = new Set<CategoryId>([
  'cafe',
  'brunch',
  'almoco',
  'jantar',
  'drinks',
  'experiencia',
  'cultura',
])

const VALID_CUISINES: ReadonlySet<CuisineId> = new Set<CuisineId>([
  'japonesa',
  'pizza',
  'italiana',
  'francesa',
  'asiatica',
  'brasileira',
  'frutos-do-mar',
  'cafe-especial',
  'hamburger',
  'mexicana',
  'vegano',
  'bar-petiscos',
  'doceria',
  'outro',
])

const VALID_PRICES: ReadonlySet<PriceRange> = new Set<PriceRange>([
  '$',
  '$$',
  '$$$',
  '$$$$',
  'gratis',
])

const isString = (v: unknown): v is string => typeof v === 'string'
const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every(isString)

/**
 * Valida e normaliza um Place vindo do localStorage.
 * Retorna `null` se a shape é inválida — chamador decide o fallback.
 */
export function parsePlace(raw: unknown): Place | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>

  if (!isString(r.id) || !r.id) return null
  if (!isString(r.name) || !r.name) return null
  if (!isString(r.category) || !VALID_CATEGORIES.has(r.category as CategoryId)) {
    return null
  }
  if (!isString(r.price) || !VALID_PRICES.has(r.price as PriceRange)) return null

  const cuisines: CuisineId[] = isStringArray(r.cuisines)
    ? (r.cuisines.filter((c) => VALID_CUISINES.has(c as CuisineId)) as CuisineId[])
    : []

  const tags: string[] = isStringArray(r.tags) ? r.tags : []
  const photos: string[] = isStringArray(r.photos) ? r.photos.filter(isSafeUrl) : []

  return {
    id: r.id,
    name: r.name,
    category: r.category as CategoryId,
    cuisines,
    vibe: isString(r.vibe) ? r.vibe : '',
    address: isString(r.address) ? r.address : undefined,
    hours: isString(r.hours) ? r.hours : undefined,
    closed: isString(r.closed) ? r.closed : undefined,
    price: r.price as PriceRange,
    highlight: isString(r.highlight) ? r.highlight : undefined,
    instagram: isString(r.instagram) ? r.instagram : undefined,
    description: isString(r.description) ? r.description : undefined,
    tags,
    photos,
  }
}

export function parsePlacesArray(raw: unknown): Place[] | null {
  if (!Array.isArray(raw)) return null
  const parsed = raw.map(parsePlace).filter((p): p is Place => p !== null)
  return parsed
}

/**
 * Aceita só URLs http(s) absolutas.
 * Bloqueia javascript:, data:, file:, e qualquer coisa exótica.
 */
export function isSafeUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Normaliza handle de Instagram. Aceita "@foo", "foo", ou URL completa.
 * Retorna o handle puro (sem @) ou null se inválido.
 */
export function parseInstagramHandle(raw: string): string | null {
  const cleaned = raw.trim().replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
  const handle = cleaned.replace(/\/$/, '')
  if (!/^[a-zA-Z0-9._]{1,30}$/.test(handle)) return null
  return handle
}
