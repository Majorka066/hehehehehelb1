alter table public.events
  alter column owner_id set default auth.uid();

revoke all on table public.events from anon, authenticated;
grant select, insert, update, delete on table public.events to authenticated;

create policy "events select own"
on public.events
for select
to authenticated
using ((select auth.uid()) is not null and owner_id = (select auth.uid()));

create policy "events insert own"
on public.events
for insert
to authenticated
with check ((select auth.uid()) is not null and owner_id = (select auth.uid()));

create policy "events update own"
on public.events
for update
to authenticated
using ((select auth.uid()) is not null and owner_id = (select auth.uid()))
with check ((select auth.uid()) is not null and owner_id = (select auth.uid()));

create policy "events delete own"
on public.events
for delete
to authenticated
using ((select auth.uid()) is not null and owner_id = (select auth.uid()));
