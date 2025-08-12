-- 01_schema.sql
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now()
);

create table if not exists plants (
  id bigserial primary key,
  name text not null
);

create table if not exists plant_care_info (
  plant_id bigint primary key references plants(id) on delete cascade,
  care_notes text,
  pests_diseases text
);

create table if not exists user_plants (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  plant_id bigint references plants(id) on delete cascade,
  nickname text,
  variety text,
  location text,
  watering_interval_days int not null default 3,
  fertilizing_interval_days int not null default 30,
  last_watered_at timestamp with time zone,
  last_fertilized_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

create table if not exists plant_yearplan (
  id bigserial primary key,
  user_plant_id bigint references user_plants(id) on delete cascade,
  month int not null check (month between 1 and 12),
  task text not null, -- 'så', 'prikle', 'utplanting', 'beskjæring', 'høsting', etc
  enabled boolean not null default true
);

create table if not exists plant_events (
  id bigserial primary key,
  user_plant_id bigint references user_plants(id) on delete cascade,
  type text not null check (type in ('water','fertilize')),
  at timestamp with time zone default now()
);

create table if not exists push_subscriptions (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  created_at timestamp with time zone default now(),
  unique (user_id, endpoint)
);

-- Materialized view-like helper (simple view for dashboard)
create or replace view user_plants_view as
select
  up.id as user_plant_id,
  up.*,
  p.name as plant_name
from user_plants up
join plants p on p.id = up.plant_id;

-- Functions

-- Logg event og oppdater 'last_*' felt, og generer nye forfallsoppgaver
create or replace function log_event(p_user_plant_id bigint, p_type text)
returns void language plpgsql security definer as $$
begin
  insert into plant_events(user_plant_id, type) values (p_user_plant_id, p_type);
  if p_type = 'water' then
    update user_plants set last_watered_at = now() where id = p_user_plant_id;
  elsif p_type = 'fertilize' then
    update user_plants set last_fertilized_at = now() where id = p_user_plant_id;
  end if;
end; $$;

-- Neste forfall basert på intervall og sist utført
create or replace function next_due_for(up user_plants, kind text)
returns timestamp with time zone language sql immutable as $$
  select
    case
      when kind = 'water' then coalesce(up.last_watered_at, up.created_at) + (up.watering_interval_days || ' days')::interval
      when kind = 'fertilize' then coalesce(up.last_fertilized_at, up.created_at) + (up.fertilizing_interval_days || ' days')::interval
    end;
$$;

-- Liste kommende oppgaver for en bruker (basert på session user)
create or replace function get_upcoming_tasks(days_ahead int default 30)
returns table(user_plant_id bigint, plant_name text, type text, due_at timestamptz, note text) language plpgsql
security definer set search_path = public as $$
begin
  return query
  select up.id, p.name,
    t.kind as type,
    case t.kind
      when 'water' then next_due_for(up, 'water')
      else next_due_for(up, 'fertilize')
    end as due_at,
    null::text as note
  from user_plants up
  join plants p on p.id = p.id and p.id = up.plant_id
  cross join lateral (values ('water'), ('fertilize')) as t(kind)
  where up.user_id = auth.uid()
    and case t.kind
      when 'water' then next_due_for(up, 'water')
      else next_due_for(up, 'fertilize')
    end <= now() + make_interval(days => days_ahead)
  order by due_at asc;
end; $$;

-- Reberegn (egentlig ikke nødvendig pga dynamisk beregning) – stub
create or replace function recalculate_tasks_for_user_plant(p_user_plant_id bigint)
returns void language plpgsql as $$ begin return; end; $$;
