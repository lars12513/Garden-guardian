# Garden Guardian (Trondheim-tilpasset)

En enkel webapp for å holde styr på vanning, gjødsling og stell av planter – delt med familien og integrert med Supabase, web push-varsler og Google Kalender (via ICS).

**Hovedfunksjoner**
- Trykk-knapp for «Vannet nå» og «Gjødslet nå» per plante
- Sett egne intervaller (dager) for vanning og gjødsling per plante
- Pop-up informasjonsvindu per plante med stell, skadedyr/sykdommer og årshjul (redigerbare måneder)
- Neste anbefalte månedsoppgave vises direkte på plantekortet
- Tilpasset Trondheim (standard årshjul + du kan redigere månedspunktene selv)
- Delbar nettside (innlogging via magic link), web push-varsler, og eksport til Google Kalender via ICS
- Kan utvides med nye planter senere

## Kom i gang (helt kort)
1) **Last ned ZIP-en** og pakk ut.
2) **Lag et nytt Supabase-prosjekt.** Kopiér `Project URL` og `anon key` inn i `.env.local`.
3) **Kjør SQL**-filene i rekkefølge i Supabase SQL editor:  
   `sql/01_schema.sql` → `sql/02_policies.sql` → `sql/03_seed_trondheim.sql`
4) **Edge Functions:** I Supabase CLI-konsollen, deploy:  
   ```bash
   supabase functions deploy push-cron
   supabase functions deploy webpush-register
   supabase functions deploy ics-export
   ```
   Sett miljøvariabler for funksjonene (se under).
5) Lokalt:  
   ```bash
   npm i
   npm run dev
   ```

## Miljøvariabler
Lag en `.env.local` i rotmappa med:
```
VITE_SUPABASE_URL=din_supabase_url
VITE_SUPABASE_ANON_KEY=din_anon_key

# VAPID-nøkler for Web Push (lag med web-push CLI)
VITE_VAPID_PUBLIC_KEY=BNxxxxx...

# På server: sett i Supabase funksjons-miljø
# (bruk `supabase secrets set --env-file supabase/.env` eller i dashboard)
VAPID_PUBLIC_KEY=BNxxxxx...
VAPID_PRIVATE_KEY=xxxxx...
```
Lag VAPID-nøkler (lokalt):
```bash
npx web-push generate-vapid-keys
```

## Google Kalender (ICS)
Vi bruker en ICS-feed du kan abonnere på i Google Kalender.
- Åpne appen, gå til **Profil → Kalenderfeed** og kopier feed-URL (generert per bruker).
- I Google Kalender: «Andre kalendere» → «+» → «Fra URL» → lim inn.

## Push-varsler
- Nettleseren vil be om tillatelse. Godkjenn.  
- Appen registrerer en push-subscription hos Supabase via edge function `webpush-register`.  
- En planlagt funksjon `push-cron` kjører (f.eks. hver morgen) og sender varsler for planter som er forfalte.

### Aktivering av cron i Supabase
I Supabase Dashboard → Edge Functions → Schedules, opprett en schedule, f.eks.
```
Every day at 08:00 Europe/Oslo
Function: push-cron
```

## Deploy til GitHub Pages / Vercel / Netlify
- Denne appen er standard Vite + React. Kjør `npm run build` og deploy dist/.
- Husk miljøvariabler i hosting-plattformen.

## Struktur
```
/src       - React-kildekode
/sql       - Database-skjema, RLS og frødata
/supabase  - Edge Functions (Deno) for push og ICS
/public    - service worker for web push
```

Lykke til! Si fra om du vil at jeg skal koble dette direkte mot din Supabase.
