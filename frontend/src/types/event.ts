export type EventStatus = 'registration_open' | 'few_places' | 'registration_closed'

export type Event = {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  location: string
  category: string
  categoryName: string
  status: EventStatus
  rating: number
}

export type EventDraft = Omit<Event, 'id' | 'rating' | 'categoryName'> & {
  rating: string
}
