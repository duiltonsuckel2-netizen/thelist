import type { CategoryFilter, CuisineFilter } from '../types'

export interface CategoryDef {
  id: CategoryFilter
  label: string
  emoji: string
}

export interface CuisineDef {
  id: CuisineFilter
  label: string
  emoji: string
}

// Categorias = tipo de rolê (single select por lugar, exceto "todos" que é só filtro)
export const CATEGORIES: CategoryDef[] = [
  { id: 'todos', label: 'Todos', emoji: '✦' },
  { id: 'cafe', label: 'Café', emoji: '☕' },
  { id: 'brunch', label: 'Brunch', emoji: '🥐' },
  { id: 'almoco', label: 'Almoço', emoji: '🍃' },
  { id: 'jantar', label: 'Jantar', emoji: '🍷' },
  { id: 'drinks', label: 'Drinks', emoji: '🍸' },
  { id: 'experiencia', label: 'Experiências', emoji: '✨' },
  { id: 'cultura', label: 'Cultura', emoji: '🎭' },
]

// Culinárias = tipo de comida (multi por lugar)
export const CUISINES: CuisineDef[] = [
  { id: 'todas', label: 'Todas', emoji: '✦' },
  { id: 'japonesa', label: 'Japonesa', emoji: '🍣' },
  { id: 'pizza', label: 'Pizza', emoji: '🍕' },
  { id: 'italiana', label: 'Italiana', emoji: '🍝' },
  { id: 'francesa', label: 'Francesa', emoji: '🇫🇷' },
  { id: 'asiatica', label: 'Asiática', emoji: '🥢' },
  { id: 'brasileira', label: 'Brasileira', emoji: '🇧🇷' },
  { id: 'frutos-do-mar', label: 'Frutos do Mar', emoji: '🦐' },
  { id: 'cafe-especial', label: 'Café Especial', emoji: '☕' },
  { id: 'hamburger', label: 'Hambúrguer', emoji: '🍔' },
  { id: 'mexicana', label: 'Mexicana', emoji: '🌮' },
  { id: 'vegano', label: 'Vegano/Saudável', emoji: '🌱' },
  { id: 'bar-petiscos', label: 'Bar & Petiscos', emoji: '🍻' },
  { id: 'doceria', label: 'Doceria', emoji: '🧁' },
  { id: 'outro', label: 'Outro', emoji: '◦' },
]

export const CATEGORY_BY_ID = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryFilter, CategoryDef>

export const CUISINE_BY_ID = Object.fromEntries(
  CUISINES.map((c) => [c.id, c]),
) as Record<CuisineFilter, CuisineDef>

export const CATEGORIES_FOR_FORM = CATEGORIES.filter((c) => c.id !== 'todos')
export const CUISINES_FOR_FORM = CUISINES.filter((c) => c.id !== 'todas')
