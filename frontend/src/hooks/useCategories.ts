import { useEffect, useState } from 'react'
import { getCategories } from '../services/categories'
import type { Category } from '../types/category'

type CategoriesLoad =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Category[] }

export function useCategories() {
  const [load, setLoad] = useState<CategoriesLoad>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    getCategories(controller.signal)
      .then((data) => {
        if (active) setLoad({ status: 'success', data })
      })
      .catch((error: unknown) => {
        if (!active) return

        const message = error instanceof Error
          ? error.message
          : 'Не удалось загрузить справочник категорий.'
        setLoad({ status: 'error', message })
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [attempt])

  function retry() {
    setLoad({ status: 'loading' })
    setAttempt((current) => current + 1)
  }

  return { load, retry }
}
