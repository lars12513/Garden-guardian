-- 04_care_details.sql
-- Oppdater/sett detaljerte stell-tekster og skadedyr/sykdom per plante (Trondheim-tilpasset).
-- Kjør trygt flere ganger: vi bruker UPSERT (ON CONFLICT DO UPDATE).

insert into plant_care_info (plant_id, care_notes, pests_diseases) values
(
  (select id from plants where name='Oliventre'),
  $$
Lys og temperatur:
- Trives best i mye lys/full sol. Tåler lett brakk vinterlys innendørs.
- Overvintring: kjølig og lyst (ca. 5–10 °C). Unngå frost.
Vanning og jord:
- God drenering er kritisk. Hold jevnt fuktig i vekstsesong, la det tørke lett opp mellom vanning.
- Vann forsiktig om vinteren (svært lite).
Næring og beskjæring:
- Svak gjødsling i vekstsesongen (april–august). Unngå sterk nitrogen-skylling.
- Beskjær lett tidlig vår for form og luft.
Annet (Trondheim):
- Sett ut etter frostfare (ofte i slutten av mai/juni). Ta inn høst eller ved lave nattetemperaturer.
$$,
  $$
Skadegjørere/sykdom:
- Skjoldlus, ullus, spinnmidd; se etter klebrige blader/sotdogg. Fjern angrepne blader, bruk såpevann/rapsolje ved behov.
- Gråskimmel ved fuktig og kjølig vær; sørg for sirkulasjon og god drenering.
- Rotråte ved overvanning og tett jord.
$$
),
(
  (select id from plants where name='Basilikum'),
  $$
Lys og temperatur:
- Varmekjær (20–25 °C), mye lys. Unngå trekk og kald vinduskarm.
Vanning og jord:
- Jevnt fuktig, men ikke våt jord. Unngå kaldt vann på røttene.
- Pottejord med god drenering.
Næring og stell:
- Svak, jevn gjødsling i vekstsesong. Topp klippen: klipp over et bladpar for buskete vekst.
Såing (Trondheim):
- Forkultiver inne mars–mai; kan dyrkes inne hele året med ekstra lys.
Høsting:
- Høst ofte, ikke mer enn 1/3 av planten om gangen.
$$,
  $$
Skadegjørere/sykdom:
- Bladlus, trips; skyll/bruk mildt såpevann ved lette angrep.
- Damping-off (spesielt småplanter) – unngå overvanning og kald trekk.
- Meldugg ved tørr luft/temperatursvingninger; fjern angrep og forbedre lufting.
$$
),
(
  (select id from plants where name='Oregano'),
  $$
Lys og jord:
- Liker mye sol, tåler tørke bedre enn våt jord.
- Nøysom – ikke overgjødsle; jord med god drenering.
Stell:
- Klipp ned tidlig vår for frisk vekst.
- Herd før utplanting (Trondheim): sett ut gradvis i mai/juni.
Høst:
- Klipp topper gjennom sesongen for smak og tettere vekst.
Overvintring:
- Flerårig; beskytt med lett dekke mot is/vinterfukt der det er utsatt.
$$,
  $$
Skadegjørere/sykdom:
- Bladlus/trips kan forekomme – plukk/spyling.
- Meldugg i stillestående luft; tynn og gi sirkulasjon.
- Rotråte ved overvanning, særlig om vinteren.
$$
),
(
  (select id from plants where name='Spinat'),
  $$
Klima og såing:
- Trives kjølig (ideelt 10–18 °C). Går lett i stokk i varme/lyseste sommer.
- Så tidlig vår (april/mai) og igjen sensommer (august) i Trondheim.
Vanning og jord:
- Jevnt fuktig jord for å unngå bitterhet og stokkløping.
- Næring: moderat, gjerne kompost før såing.
Høst:
- Høst blad etter behov; yngre blader er møre.
$$,
  $$
Skadegjørere/sykdom:
- Bladlus; skyll/nytteinsekter.
- Falsk meldugg (nedmugg) på blad; velg luftige bed, unngå overvanning på bladverk.
- Bladminerende fluer kan lage ganger i blad – plukk vekk angrepne blader.
$$
),
(
  (select id from plants where name='Chili'),
  $$
Forkultivering:
- Start tidlig (feb–mars) for å rekke modning i Trondheim. Bruk vekstlys.
Lys/temperatur:
- Trenger mye lys og varme (22–28 °C dag). Unngå under 15 °C.
Jord/vanning:
- Velldrenert næringsrik jord. Jevn fukt, ikke stående vann.
Næring/beskjæring:
- Jevn, svak gjødsling i vekst. Fjern første blomster hvis planten er liten, for bedre etablering.
Ut/inn:
- Sett ut når natta er stabilt over ~10 °C (ofte juni). Beskytt mot vind.
$$,
  $$
Skadegjørere/sykdom:
- Bladlus, spinnmidd, trips, hvitfly – sjekk undersiden av bladene.
- Gråskimmel ved høy luftfuktighet; luft godt.
- Rotråte ved overvanning – drenering er viktig.
$$
),
(
  (select id from plants where name='Koriander'),
  $$
Vekstforhold:
- Liker kjølig og jevn fukt. Går lett i stokk ved varme/lyse sommerdager.
Såing:
- Så i omganger fra vår til sensommer for jevn tilgang; unngå prikling (så i endelig potte).
Jord/næring:
- Velldrenert jord, moderat næring. Ikke overgjødsle.
Høsting:
- Klipp blader ofte. La noen planter gå i frø om du vil ha korianderfrø.
$$,
  $$
Skadegjørere/sykdom:
- Bladlus og bladminerende fluer – fjern angrepne blader.
- Meldugg i stillestående luft; gi sirkulasjon.
- Rotråte ved overvanning.
$$
),
(
  (select id from plants where name='Gulrot'),
  $$
Såing/stell (Trondheim):
- Direkteså i mai når jorda er tjenlig. Tynn jevnt for rette røtter.
- Hold jevnt fuktig, særlig ved spiring og rotvekst.
Jord:
- Dyp, steinfri og ikke for fersk gjødsel (kan gi forgreining).
Høst/lagring:
- Høst etter sort; unngå å skade røttene. Kan lagres kjølig og fuktig.
Forebygging:
- Fiberduk i mai–juni for å hindre gulrotflue.
$$,
  $$
Skadegjørere/sykdom:
- Gulrotflue (tunneler/brune spor) – bruk duk og vekstskifte.
- Alternaria-bladflekk og lagersykdommer – god hygiene og lufting.
- Skurv ved høy pH/tørr jord – jevn fukt og balansert næring.
$$
),
(
  (select id from plants where name='Potet'),
  $$
Settepoteter:
- Forspire lyst og kjølig 2–4 uker. Sett når jordtemp er ca. 7–8 °C (mai i Trondheim).
Stell:
- Hypping når skuddene er 10–15 cm. Vann ved knolldanning/tørrperioder.
Næring:
- Moderat gjødsling. Unngå for mye nitrogen (gir mye blad, lite knoller).
Høst:
- Høst etter 70–120 dager avhengig av sort og vær. Tørk av jorda og herd før lagring.
$$,
  $$
Skadegjørere/sykdom:
- Tørråte (Phytophthora infestans) – fjern syke blader, unngå vannsøl, bruk resistente sorter.
- Skurv på knoller ved tørr/jord med høy pH.
- Jordboende skadedyr (trådorm), sjelden Colorado-bille her.
$$
),
(
  (select id from plants where name='Jordbær'),
  $$
Plassering/jord:
- Full sol, veldrenert jord. Plant grunt; krona i høyde med jordoverflaten.
Stell:
- Jevn vanning, spesielt ved blomstring og bærsetting. Halmpadding holder bær rene og jorda jevn.
- Gjødsle moderat tidlig vår og litt etter høsting.
Vedlikehold:
- Fjern gamle blader etter sesong. Forny bed ca. hvert 3.–4. år.
Vinter:
- Lett dekke mot barfrost i Trondheim. Fjern dekket om våren.
$$,
  $$
Skadegjørere/sykdom:
- Gråskimmel (Botrytis) – god lufting, halmdekke, fjern råtne bær.
- Meldugg – hvitt belegg på blad; fjern angrep og gi sirkulasjon.
- Snegler, trips, bladlus – plukk, feller, eller mildt såpevann ved behov.
$$
)
on conflict (plant_id)
do update set
  care_notes = excluded.care_notes,
  pests_diseases = excluded.pests_diseases;
