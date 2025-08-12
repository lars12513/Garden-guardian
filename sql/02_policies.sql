-- 02_policies.sql
alter table profiles enable row level security;
alter table plants enable row level security;
alter table plant_care_info enable row level security;
alter table user_plants enable row level security;
alter table plant_yearplan enable row level security;
alter table plant_events enable row level security;
alter table push_subscriptions enable row level security;

-- Simple policies
create policy "public read plants" on plants for select using (true);
create policy "public read plant_care_info" on plant_care_info for select using (true);

create policy "user can read own user_plants" on user_plants for select using (auth.uid() = user_id);
create policy "user can insert own user_plants" on user_plants for insert with check (auth.uid() = user_id);
create policy "user can update own user_plants" on user_plants for update using (auth.uid() = user_id);
create policy "user can delete own user_plants" on user_plants for delete using (auth.uid() = user_id);

create policy "user can read own events" on plant_events for select using (
  exists (select 1 from user_plants up where up.id = plant_events.user_plant_id and up.user_id = auth.uid())
);
create policy "user can insert own events" on plant_events for insert with check (
  exists (select 1 from user_plants up where up.id = plant_events.user_plant_id and up.user_id = auth.uid())
);

create policy "user can read own yearplan" on plant_yearplan for select using (
  exists (select 1 from user_plants up where up.id = plant_yearplan.user_plant_id and up.user_id = auth.uid())
);
create policy "user can update own yearplan" on plant_yearplan for update using (
  exists (select 1 from user_plants up where up.id = plant_yearplan.user_plant_id and up.user_id = auth.uid())
);
create policy "user can insert own yearplan" on plant_yearplan for insert with check (
  exists (select 1 from user_plants up where up.id = plant_yearplan.user_plant_id and up.user_id = auth.uid())
);

create policy "user can manage own push subscriptions" on push_subscriptions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
