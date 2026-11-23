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
  event_categories: { id: string; name: string } | null
}

export type EventFilters = {
  query: string
  status: 'all' | Event['status']
  categoryId: 'all' | string
}

export const emptyEventFilters: EventFilters = { query: '', status: 'all', categoryId: 'all' }

const eventColumns = 'id, owner_id, category_id, title, description, starts_at, ends_at, location, status, rating, created_at, event_categories(id, name)'

function fromRow(row: EventRow): Event { // preobraz dannye bd v obiect react
  if (!row.event_categories || row.event_categories.id !== row.category_id) {
    throw new Error('Категория мероприятия не найдена в ответе базы.')
  }
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    startDate: row.starts_at,
    endDate: row.ends_at,
    location: row.location,
    category: row.category_id,
    categoryName: row.event_categories.name,
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

export async function getEvents(filters: EventFilters): Promise<Event[]> { // 1. take events
  let request = supabase
    .from('events')
    .select(eventColumns)
    .order('created_at', { ascending: false })

  const query = filters.query.trim().slice(0, 100)
  if (query) request = request.ilike('title', `%${query}%`)
  if (filters.status !== 'all') request = request.eq('status', filters.status)
  if (filters.categoryId !== 'all') request = request.eq('category_id', filters.categoryId)

  const { data, error } = await request
    .overrideTypes<EventRow[], { merge: false }>()

  if (error) throw new Error(`Не удалось загрузить мероприятия: ${error.message}`)
  return data.map(fromRow)
}

export async function getEvent(id: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .select(eventColumns)
    .eq('id', id)
    .maybeSingle()
    .overrideTypes<EventRow | null, { merge: false }>()

  if (error) throw new Error(`Не удалось загрузить мероприятие: ${error.message}`)
  return data ? fromRow(data) : null
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

export async function updateEvent(id: string, draft: EventDraft): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .update(toWrite(draft))
    .eq('id', id)
    .select(eventColumns)
    .single()
    .overrideTypes<EventRow, { merge: false }>()

  if (error) throw new Error(`Не удалось сохранить изменения: ${error.message}`)
  return fromRow(data)
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase.from('events').delete().eq('id', id)

  if (error) throw new Error(`Не удалось удалить мероприятие: ${error.message}`)
}
