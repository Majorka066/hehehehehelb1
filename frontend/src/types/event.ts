export type EventStatus = 'registration_open' | 'few_places' | 'registration_closed'

export type EventCategory =
  | 'education'
  | 'technology'
  | 'culture'
  | 'career'

export type Event = {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  location: string
  category: EventCategory
  status: EventStatus
}
