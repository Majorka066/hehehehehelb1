insert into public.event_categories (id, name)
values
  ('education', 'Образование'),
  ('technology', 'Технологические события'),
  ('culture', 'Культура'),
  ('career', 'Карьера'),
  ('sport', 'Спорт')
on conflict (id) do update
set name = excluded.name;
