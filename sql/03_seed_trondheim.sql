-- 03_seed_trondheim.sql
insert into plants (name) values
  ('Oliventre'), ('Basilikum'), ('Oregano'), ('Spinat'),
  ('Chili'), ('Koriander'), ('Gulrot'), ('Potet'), ('Jordbær')
on conflict do nothing;

-- Enkel stelltekst (kan redigeres i databasen)
insert into plant_care_info (plant_id, care_notes, pests_diseases)
select p.id,
$$
Generelle råd for Trondheim:
- Beskytt mot frost, spesielt tidlig/ sent i sesongen.
- Gi jevn fuktighet (unngå å drukne).
- Gjødsle svakt og jevnt i vekstsesong.
$$,
$$
Hold øye med: snegler, bladlus, gråskimmel (Botrytis), meldugg.
Fjern sykt materiale, sørg for lufting og unngå vannsøl på bladverk.
$$
from plants p
on conflict (plant_id) do nothing;

-- Demo-brukerplanter opprettes av appen, men du kan kjøre noe slikt manuelt:
-- Merk: bytt ut UUID med din egen bruker-id om du vil teste i SQL.
-- insert into user_plants(user_id, plant_id, nickname, location, watering_interval_days, fertilizing_interval_days)
-- values ('00000000-0000-0000-0000-000000000000', (select id from plants where name='Basilikum'), 'Basilikum på kjøkken', 'Inne', 2, 21);

-- Standard årshjul per plante (eksempler til Trondheim – kan redigeres i UI)
-- Når du oppretter en user_plant i appen, bør du kopiere disse til plant_yearplan.
-- For enkelhets skyld legger vi ikke globale maler her, men du kan lage en "template" tabell senere.
