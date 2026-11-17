import { supabase } from '../lib/supabase'
import type { Event, EventDraft } from '../types/event'

type EventRow = {
  id: string
  owner_id: string
  category_id: string
  title: string
  description: string
  starts_at: string
  ends_at: string
  location: string
  status: Event['status']
  rating: number
  created_at: string
}

const eventColumns = 'id, owner_id, category_id, title, description, starts_at, ends_at, location, status, rating, created_at'

function fromRow(row: EventRow): Event { // preobraz dannye bd v obiect react
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    startDate: row.starts_at,
    endDate: row.ends_at,
    location: row.location,
    category: row.category_id,
    status: row.status,
    rating: Number(row.rating),
  }
}

function toWrite(draft: EventDraft) {
  return {
    category_id: draft.category,
    title: draft.title.trim(),
    description: draft.description.trim(),
    starts_at: new Date(draft.startDate).toISOString(),
    ends_at: new Date(draft.endDate).toISOString(),
    location: draft.location.trim(),
    status: draft.status,
    rating: Number(draft.rating),
  }
}

export async function getEvents(): Promise<Event[]> {  // 1. take events
  const { data, error } = await supabase
    .from('events')
    .select(eventColumns)
    .order('created_at', { ascending: false })
    .overrideTypes<EventRow[], { merge: false }>()

  if (error) throw new Error(`Не удалось загрузить мероприятия: ${error.message}`)
  return data.map(fromRow)
}

export async function createEvent(draft: EventDraft): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .insert(toWrite(draft))
    .select(eventColumns)
    .single()
    .overrideTypes<EventRow, { merge: false }>()

  if (error) throw new Error(`Не удалось создать мероприятие: ${error.message}`)
  return fromRow(data)
}

export async function updateEvent(id: string, draft: EventDraft): Promise<void> {
  const { error } = await supabase
    .from('events')
    .update(toWrite(draft))
    .eq('id', id)

  if (error) throw new Error(`Не удалось сохранить изменения: ${error.message}`)
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase.from('events').delete().eq('id', id)

  if (error) throw new Error(`Не удалось удалить мероприятие: ${error.message}`)
}
