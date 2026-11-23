import { useEffect, useState } from 'react'
import { getEvent } from '../services/events'
import type { Event } from '../types/event'

export type EventLoad =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; id: string; data: Event | null }

export function useEvent(id: string | undefined) {
  const [load, setLoad] = useState<EventLoad>({ status: 'loading' })

  useEffect(() => {
    let active = true
    if (!id) return () => { active = false }
    getEvent(id).then((data) => {
      if (active) setLoad({ status: 'success', id, data })
    }).catch((reason: unknown) => {
      if (active) setLoad({ status: 'error', message: reason instanceof Error ? reason.message : 'Не удалось загрузить мероприятие.' })
    })
    return () => { active = false }
  }, [id])

  return load.status === 'success' && load.id !== id
    ? { status: 'loading' as const }
    : load
}
