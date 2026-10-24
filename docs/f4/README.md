> Actuele afsluiting (24 oktober 2026): [F4-bouw en DEV-oplevering](Afronding-DEV-20261024.md). Websitevrijgave en volledige productieacceptatie blijven open. Onderstaande voorbereiding en tussenstanden zijn historische momentopnamen.

Actuele bouwstatus: [contact](Implementatie-contact.md) en [F4-opleverkandidaat](Oplevering-F4.md). Review en live vrijgave blijven afzonderlijk.

> Vervolg: informatiepagina’s, bronbehandeling en tijdelijke stagingredirects zijn lokaal gebouwd. Zie [Implementatie inhoud](Implementatie-inhoud.md). De 98 URL’s en drie concepten blijven ongereviewd; niets is live geïmporteerd of gepubliceerd.

> Vervolg: partnerdelegatie en eigen profielvoorstellen zijn lokaal gebouwd. Zie [Implementatie delegatie](Implementatie-delegatie.md). Geen live toegang, migratie of uitrol uitgevoerd.

> Vervolg: vacatures en vacaturegebonden sollicitaties zijn lokaal gebouwd. Zie [Implementatie vacatures](Implementatie-vacatures.md). Geen live migratie, uitrol of activering uitgevoerd.

> Vervolg: partner- en esportsvermeldingen zijn lokaal gebouwd. Zie [Implementatie partners](Implementatie-partners.md). Geen live migratie, publicatie of uitrol uitgevoerd.

> Vervolg: de private samenwerkingsintake en eigen opvolging zijn lokaal gebouwd. Zie [Implementatie intake](Implementatie-intake.md). Overige F4-onderdelen blijven gepland; er is niets live geactiveerd.

> Bouwupdate: de eerste creatorketen is nu lokaal gebouwd. Zie [Implementatie creator](Implementatie-creator.md). Onderstaande voorbereiding, contractvoorstellen en geplande acceptatiegevallen blijven de historische scope; zij bewijzen geen volledige F4-uitvoering.

# F4 — websitevoorbereiding

Status: volledig voorbereidingspakket voor review, nog geen F4-applicatiecode of live wijziging. Hoofdplan en gedeeld rechten-/datamodel staan in de afzonderlijke CC-repository onder `docs/f4/README.md`. Deze repository bevat de website-uitwerking en gecontroleerde kopieën van de voorgestelde contracten. Geen gedeelde codebase of credentials.

- [Routes, schermen en bouwvolgorde](Routes-en-bouwvolgorde.md).
- [CC-contract, eigen toegang en privacy](Contract-en-eigen-toegang.md).
- [Overdracht, release en uitgestelde acceptatie](Oplevering-en-acceptatie.md).
- [Pakketmanifest](manifest.json), [contract](contracts/platform-contract.json), [publieke DTO-schema’s](contracts/public.schema.json), [private invoerschema’s](contracts/intake.schema.json) en [fictieve fixtures](contracts/fixtures.json).

Pakketcontrole: `node docs/f4/validate-preparation.mjs`. Valideert alleen document-/contractvoorbereiding; geen app-, browser-, Cloud- of provideracceptatie. Uitgebreide hele-app-acceptatie blijft vóór productie. Bestaande nieuws/event-contracten en F2-openpunten worden niet vervangen.
