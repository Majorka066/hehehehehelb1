import type { EventStatus } from '../types/event'

export const eventStatusLabels: Record<EventStatus, string> = {
  registration_open: 'Идёт регистрация',
  few_places: 'Мало мест',
  registration_closed: 'Регистрация закрыта',
}
