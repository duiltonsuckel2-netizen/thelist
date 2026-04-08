export type CategoryId =
  | 'cafe'
  | 'brunch'
  | 'almoco'
  | 'jantar'
  | 'drinks'
  | 'experiencia'
  | 'cultura'

export type CuisineId =
  | 'japonesa'
  | 'pizza'
  | 'italiana'
  | 'francesa'
  | 'asiatica'
  | 'brasileira'
  | 'frutos-do-mar'
  | 'cafe-especial'
  | 'hamburger'
  | 'mexicana'
  | 'vegano'
  | 'bar-petiscos'
  | 'doceria'
  | 'outro'

export type PriceRange = '$' | '$$' | '$$$' | '$$$$' | 'gratis'

export interface Place {
  id: string
  name: string
  category: CategoryId
  cuisines: CuisineId[]
  vibe: string
  address?: string
  hours?: string
  closed?: string
  price: PriceRange
  highlight?: string
  instagram?: string
  description?: string
  tags: string[]
  photos: string[]
}

export type CategoryFilter = CategoryId | 'todos'
export type CuisineFilter = CuisineId | 'todas'
