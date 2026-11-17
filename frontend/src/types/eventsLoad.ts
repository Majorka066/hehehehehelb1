import type { Event } from './event'

export type EventsLoad =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Event[]; userId: string }
