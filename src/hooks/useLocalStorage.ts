import { useCallback, useEffect, useState } from 'react'

/**
 * useLocalStorage<T> — persistência reativa em localStorage.
 *
 * - Hidrata do storage no primeiro render (com fallback pro initial).
 * - Escreve toda mudança de volta no storage.
 * - Sincroniza entre abas via evento `storage`.
 * - SSR-safe: durante render no servidor não toca em window.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') return initialValue
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initialValue
    } catch (err) {
      console.warn(`[useLocalStorage] failed to read "${key}":`, err)
      return initialValue
    }
  }, [key, initialValue])

  const [stored, setStored] = useState<T>(readValue)

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStored((prev) => {
        const next = value instanceof Function ? value(prev) : value
        try {
          window.localStorage.setItem(key, JSON.stringify(next))
        } catch (err) {
          console.warn(`[useLocalStorage] failed to write "${key}":`, err)
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
        setStored(JSON.parse(e.newValue) as T)
      } catch {
        // ignora valores corrompidos vindos de outra aba
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [key])

  return [stored, setValue]
}
