# Werkpakketten en oplevering

Uitvoering start pas na expliciete goedkeuring. De volgorde is een afhankelijkheidsvolgorde, geen toegezegde kalenderdeadline. Lokale bouw kan doorgaan terwijl een afzonderlijke live toegangspoort openstaat; die live stap blijft geblokkeerd.

| ID | Werk en resultaat | Afhankelijk van | Gereed wanneer |
| --- | --- | --- | --- |
| F2.0 | Baseline, toegang, concrete testers, bron-/rechtenregister en releaseplan | Akkoord op mandaat | Main/image/schema/historie vastgelegd; SSH/one.com/GitHub/Cloud DEV bruikbaar; roster en resourcecheck bevestigd |
| F2.1 | Private afzonderlijke websiterepo; Next.js-basis, lockfile, Dockerimage, huisstijl, home/navigatie en states | F2.0 voor externe aanmaak; lokale analyse voorbereid | CI bouwt; geen CC/botcredentials; beide thema's en schermmaten beoordeeld |
| F2.2 | Additief releasemodel, RLS, workflows, pointer/epoch, audit, herhaalveiligheid | F2.0 en F1 | Verse en upgrade-DB, rol-/tenant-/concurrencytests groen; oude F1-betekenis behouden |
| F2.3 | Beperkte CC-lees-API met schema, viewer/site-auth en contracttests | F2.2 | Routes geven uitsluitend veilige velden; directe SQL/API-omwegen en kwaadaardige invoer geblokkeerd |
| F2.4 | CC-bediening: vrijgave, vervangen, venster, intrekken en actuele status | F2.2, F2.3 | Exact revisieakkoord nodig; conflict begrijpelijk; geen oude aanvraag die intrekking herstelt |
| F2.5 | Website-auth, events/nieuws, beheerde media, storing en intrekkingscontrole | F2.1, F2.3, F2.4 | Hele browserketen werkt; media privé; geen uitlek/stale fallback; ≤60s intrekking geïsoleerd bewezen |
| F2.6 | Gezamenlijke CI, toegankelijkheid, privacy/races, release- en terugvalproef | F2.1–F2.5 | Relevante regressie/contract/e2e groen; deployartefacten reproduceerbaar; vorige images compatibel |
| F2.7 | Alleen DEV: handmatige back-up, exacte migraties, twee releases, staging-DNS/TLS, beperkte toelating, live proef en opruiming | F2.0 live toegang én F2.6 | Werkelijke digests/schema/flags vastgelegd; volledige ketens en negatieve proeven bewezen; herstelproef, audit en menselijke acceptatie beschikbaar |

Per pakket: code-review tegen masterplan en contract, alleen eigen gewijzigde bestanden committen, CI en passende regressie draaien, resultaten vastleggen. Nieuwe onbekende inhoud, bevoegdheid of extra dienst wordt geen stilzwijgende scope-uitbreiding. F2.7 heeft afzonderlijke CC- en website-PR's, images en terugvalstappen. Geen botrelease.

Op te leveren: werkende afgeschermde website; CC-vrijgavebediening en veilige API; exacte migratiemanifesten; schemas/fixtures gedeeld per versie; twee geslaagde containerbuilds; 1:1 testresultaten met bewijslaag; private operationele runbook/roster; publieke Git-documentatie zonder geheimen; eindverslag met afwijkingen, open punten en aanvaardingsverzoek.
