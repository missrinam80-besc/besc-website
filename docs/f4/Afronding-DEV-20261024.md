# F4 — websitebouw en DEV-oplevering afgerond

24 oktober 2026. De opdrachtgever stemde in met begrensde afsluiting van de F4-bouw en technische DEV-oplevering, afzonderlijke planning van aanvullende privacyautomatisering en vervolg volgens het oorspronkelijke traject.

## Oplevering

De websitebouw voor creatorprofielen, Mijn BESC, private contact- en samenwerkingsaanvragen, partner- en esportsvermeldingen, vacatures en sollicitaties, partnerdelegatie, informatiepagina’s, navigatie en voorbereide migratie/redirects is afgerond. CC beheert dossiers en publicatie; website en CC blijven afzonderlijke repositories met een beperkte serververbinding.

- Website PR #4 is gemerged: https://github.com/missrinam80-besc/besc-website/pull/4.
- Hoofdbranchcommit: `efae991ed9f10c311e663f91ce01fcbf2f03bf15`.
- Uitgerolde websiteimage: `sha256:f9843c93492bbf721e4cb11334e3739cfbf1da6808b505922a34567567b6dd2d`.
- Operator bevestigde gezondheid, behouden instellingen en ongewijzigde CC/Caddy/Composebestanden.
- Afgeschermd serverbewijs: `/var/backups/besc-command-center/f4-website-deploy/20261024T131115Z-rXXKTd`.
- Terugvalimage bewaard als `besc-website:f4-before-20261024T131115Z`.

De bijbehorende CC-bouw is gemerged in PR #120 en op DEV uitgerold. De database heeft 133 migratieregistraties na de zeven F4-migraties; bestaande historie en rijen zijn behouden. Acht F4-beheerfuncties in CC zijn ingeschakeld.

## Grenzen van de afsluiting

**Alle acht F4-websitefuncties blijven uit.** De bestaande staginginstelling is behouden; zij is geen vrijgave van F4-webfuncties. Deze afsluiting wijzigt geen toegang, rollen, inhoud of configuratie en opent geen publieke website.

Het register met 98 historische URL’s en drie concepten is voorbereid. Broninhoud, actualiteit, rechten, import en productieomschakeling zijn nog niet goedgekeurd of uitgevoerd. De huidige publieke website blijft staan.

Actuele doelteksten, privacy- en bewaarbehandeling, concrete behandelaars, onafhankelijke beoordelaars en toepasselijke rechten moeten vóór echt gebruik worden vastgesteld. De privacyconcepten zijn voorstellen. De aanvullende automatisering voor bewaren/verwijderen komt in afzonderlijke gedeelde planning, met nog te besluiten scope en uitvoering.

De oorspronkelijke geplande F4-gevallen en open F0–F3-bewijsgrenzen blijven staan. De uitgebreide hele-app-acceptatie en productievoorwaarden zijn niet afgetekend. De overgeslagen verse F4-databaseback-up is geen vrijstelling van latere herstel- of productievoorwaarden.

## Vervolg en historische documenten

De volgende fase is **F5: gecontroleerde uitbreiding** van noodzakelijke socialcapabilities, campagnebotfuncties, Streamer.bot-bronkoppeling en voorbereid saldobeheer. De eerste stap is de hergebruikinventaris en afbakening van ontbrekende capabilities in de afzonderlijke CC-repository. Er worden nu geen echte accounts gekoppeld, verdiensten geactiveerd of overnames uitgevoerd. Productie en eventuele Metricool-/StreamElements-overname horen bij afzonderlijke F6-besluiten.

De overige voorbereidingsdocumenten en manifesten blijven historische momentopnamen. Oude formuleringen ‘niet gebouwd’ of ‘niet uitgerold’ in die voorbereiding gelden niet als actuele opleverstatus. Dit document beschrijft de stand op 24 oktober 2026.
