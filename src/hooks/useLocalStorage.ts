import { useCallback, useEffect, useState } from 'react'

/**
 * useLocalStorage<T> — persistência reativa em localStorage.
 *
 * - Hidrata do storage no primeiro render (com fallback pro initial).
 * - Aceita um `parse` opcional pra validar/normalizar o que veio do storage:
 *   se o parse retornar `null`, o valor é tratado como corrompido e o
 *   `initialValue` é usado.
 * - Escreve toda mudança de volta no storage.
 * - Sincroniza entre abas via evento `storage`.
 * - SSR-safe: durante render no servidor não toca em window.
 *
 * Logging só em DEV (baseline senior: zero prints em produção).
 */
export interface UseLocalStorageOptions<T> {
  parse?: (raw: unknown) => T | null
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {},
): [T, (value: T | ((prev: T) => T)) => void] {
  const { parse } = options

  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') return initialValue
    try {
      const raw = window.localStorage.getItem(key)
      if (!raw) return initialValue
      const parsed = JSON.parse(raw) as unknown
      if (parse) {
        const validated = parse(parsed)
        return validated ?? initialValue
      }
      return parsed as T
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn(`[useLocalStorage] failed to read "${key}":`, err)
      }
      return initialValue
    }
  }, [key, initialValue, parse])

  const [stored, setStored] = useState<T>(readValue)

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStored((prev) => {
        const next = value instanceof Function ? value(prev) : value
        try {
          window.localStorage.setItem(key, JSON.stringify(next))
        } catch (err) {
          if (import.meta.env.DEV) {
            console.warn(`[useLocalStorage] failed to write "${key}":`, err)
          }
        }
        return next
      })
    },
    [key],
  )

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== key || e.newValue === null) return
      try {
        const parsed = JSON.parse(e.newValue) as unknown
        if (parse) {
          const validated = parse(parsed)
          if (validated !== null) setStored(validated)
        } else {
          setStored(parsed as T)
        }
      } catch {
        // valor corrompido vindo de outra aba — ignora silenciosamente
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [key, parse])

  return [stored, setValue]
}
