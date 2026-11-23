-- events_category_id_fkey from the initial schema already uses
-- ON UPDATE CASCADE ON DELETE RESTRICT.

create index if not exists events_owner_status_idx
  on public.events(owner_id, status);

create index if not exists events_category_id_idx
  on public.events(category_id);
