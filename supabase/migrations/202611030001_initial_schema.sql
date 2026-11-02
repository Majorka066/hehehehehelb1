create table public.event_categories (
  id text primary key,
  name text not null unique,
  constraint event_categories_id_not_blank
    check (id = btrim(id) and id <> ''),
  constraint event_categories_name_not_blank
    check (name = btrim(name) and name <> '')
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  category_id text not null references public.event_categories(id)
    on update cascade on delete restrict,
  title text not null,
  description text not null default '',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  location text not null,
  status text not null,
  rating numeric(2, 1) not null,
  created_at timestamptz not null default now(),
  constraint events_title_length
    check (char_length(btrim(title)) between 3 and 100),
  constraint events_description_not_blank
    check (btrim(description) <> ''),
  constraint events_dates_in_order
    check (ends_at > starts_at),
  constraint events_location_not_blank
    check (btrim(location) <> ''),
  constraint events_status_allowed
    check (status in ('registration_open', 'few_places', 'registration_closed')),
  constraint events_rating_in_range
    check (rating between 1 and 5)
);

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint registrations_owner_event_unique unique (owner_id, event_id)
);

alter table public.event_categories enable row level security;
alter table public.events enable row level security;
alter table public.registrations enable row level security;

revoke all on table public.event_categories from anon, authenticated;
revoke all on table public.events from anon, authenticated;
revoke all on table public.registrations from anon, authenticated;

grant select on table public.event_categories to anon, authenticated;

create policy "event categories are publicly readable"
on public.event_categories
for select
to anon, authenticated
using (true);
