import { describe, expect, it } from 'vitest'
import {
  isSafeUrl,
  parseInstagramHandle,
  parsePlace,
  parsePlacesArray,
} from './validate'

describe('isSafeUrl', () => {
  it('aceita https', () => {
    expect(isSafeUrl('https://example.com/foo.jpg')).toBe(true)
  })

  it('aceita http', () => {
    expect(isSafeUrl('http://example.com/foo.jpg')).toBe(true)
  })

  it('aceita URLs com query strings (incluindo vírgulas)', () => {
    expect(isSafeUrl('https://images.unsplash.com/photo-1?w=900,q=80')).toBe(true)
  })

  it('rejeita javascript:', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false)
  })

  it('rejeita data:', () => {
    expect(isSafeUrl('data:text/html,<script>alert(1)</script>')).toBe(false)
  })

  it('rejeita file:', () => {
    expect(isSafeUrl('file:///etc/passwd')).toBe(false)
  })

  it('rejeita string vazia', () => {
    expect(isSafeUrl('')).toBe(false)
  })

  it('rejeita texto solto', () => {
    expect(isSafeUrl('não é url')).toBe(false)
  })

  it('rejeita não-string', () => {
    expect(isSafeUrl(42)).toBe(false)
    expect(isSafeUrl(null)).toBe(false)
    expect(isSafeUrl(undefined)).toBe(false)
    expect(isSafeUrl({})).toBe(false)
  })
})

describe('parseInstagramHandle', () => {
  it('aceita handle simples', () => {
    expect(parseInstagramHandle('grisbaremirante')).toBe('grisbaremirante')
  })

  it('remove @ inicial', () => {
    expect(parseInstagramHandle('@grisbaremirante')).toBe('grisbaremirante')
  })

  it('extrai handle de URL completa', () => {
    expect(parseInstagramHandle('https://instagram.com/grisbaremirante')).toBe(
      'grisbaremirante',
    )
  })

  it('extrai handle de URL com www', () => {
    expect(parseInstagramHandle('https://www.instagram.com/grisbaremirante/')).toBe(
      'grisbaremirante',
    )
  })

  it('aceita pontos e underscores', () => {
    expect(parseInstagramHandle('@cafe.decor')).toBe('cafe.decor')
    expect(parseInstagramHandle('@izakaya_nankin')).toBe('izakaya_nankin')
  })

  it('rejeita caracteres inválidos', () => {
    expect(parseInstagramHandle('@<script>')).toBe(null)
    expect(parseInstagramHandle('foo bar')).toBe(null)
  })

  it('rejeita string vazia', () => {
    expect(parseInstagramHandle('')).toBe(null)
  })

  it('rejeita handle longo demais', () => {
    expect(parseInstagramHandle('a'.repeat(31))).toBe(null)
  })
})

describe('parsePlace', () => {
  const valid = {
    id: 'test',
    name: 'Test Place',
    category: 'jantar',
    cuisines: ['japonesa'],
    vibe: 'Modern',
    price: '$$',
    tags: ['cool'],
    photos: ['https://example.com/x.jpg'],
  }

  it('aceita objeto válido', () => {
    const result = parsePlace(valid)
    expect(result).not.toBeNull()
    expect(result?.name).toBe('Test Place')
    expect(result?.cuisines).toEqual(['japonesa'])
  })

  it('rejeita null', () => {
    expect(parsePlace(null)).toBeNull()
  })

  it('rejeita non-object', () => {
    expect(parsePlace('string')).toBeNull()
    expect(parsePlace(42)).toBeNull()
  })

  it('rejeita objeto sem id', () => {
    expect(parsePlace({ ...valid, id: undefined })).toBeNull()
  })

  it('rejeita category inválida', () => {
    expect(parsePlace({ ...valid, category: 'foo' })).toBeNull()
  })

  it('rejeita price inválido', () => {
    expect(parsePlace({ ...valid, price: '€€€' })).toBeNull()
  })

  it('normaliza cuisines vazio quando ausente', () => {
    const result = parsePlace({ ...valid, cuisines: undefined })
    expect(result?.cuisines).toEqual([])
  })

  it('filtra cuisines inválidas', () => {
    const result = parsePlace({ ...valid, cuisines: ['japonesa', 'foo', 'pizza'] })
    expect(result?.cuisines).toEqual(['japonesa', 'pizza'])
  })

  it('filtra fotos com URLs inseguras', () => {
    const result = parsePlace({
      ...valid,
      photos: ['https://ok.com/a.jpg', 'javascript:alert(1)', 'http://ok.com/b.jpg'],
    })
    expect(result?.photos).toEqual(['https://ok.com/a.jpg', 'http://ok.com/b.jpg'])
  })

  it('aceita campos opcionais ausentes', () => {
    const result = parsePlace(valid)
    expect(result?.address).toBeUndefined()
    expect(result?.hours).toBeUndefined()
  })
})

describe('parsePlacesArray', () => {
  it('rejeita não-array', () => {
    expect(parsePlacesArray(null)).toBeNull()
    expect(parsePlacesArray({})).toBeNull()
    expect(parsePlacesArray('foo')).toBeNull()
  })

  it('aceita array vazio', () => {
    expect(parsePlacesArray([])).toEqual([])
  })

  it('filtra entradas inválidas, mantém válidas', () => {
    const valid = {
      id: 'a',
      name: 'A',
      category: 'cafe',
      cuisines: [],
      vibe: '',
      price: '$',
      tags: [],
      photos: [],
    }
    const result = parsePlacesArray([valid, null, { broken: true }, valid])
    expect(result).toHaveLength(2)
    expect(result?.[0]?.name).toBe('A')
  })
})
