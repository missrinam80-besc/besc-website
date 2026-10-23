> Vervolg: de private samenwerkingsintake en eigen opvolging zijn lokaal gebouwd. Zie [Implementatie intake](Implementatie-intake.md). Overige F4-onderdelen blijven gepland; er is niets live geactiveerd.

> Bouwupdate: de eerste creatorketen is nu lokaal gebouwd. Zie [Implementatie creator](Implementatie-creator.md). Onderstaande voorbereiding, contractvoorstellen en geplande acceptatiegevallen blijven de historische scope; zij bewijzen geen volledige F4-uitvoering.

# F4 — websitevoorbereiding

Status: volledig voorbereidingspakket voor review, nog geen F4-applicatiecode of live wijziging. Hoofdplan en gedeeld rechten-/datamodel staan in de afzonderlijke CC-repository onder `docs/f4/README.md`. Deze repository bevat de website-uitwerking en gecontroleerde kopieën van de voorgestelde contracten. Geen gedeelde codebase of credentials.

- [Routes, schermen en bouwvolgorde](Routes-en-bouwvolgorde.md).
- [CC-contract, eigen toegang en privacy](Contract-en-eigen-toegang.md).
- [Overdracht, release en uitgestelde acceptatie](Oplevering-en-acceptatie.md).
- [Pakketmanifest](manifest.json), [contract](contracts/platform-contract.json), [publieke DTO-schema’s](contracts/public.schema.json), [private invoerschema’s](contracts/intake.schema.json) en [fictieve fixtures](contracts/fixtures.json).

Pakketcontrole: `node docs/f4/validate-preparation.mjs`. Valideert alleen document-/contractvoorbereiding; geen app-, browser-, Cloud- of provideracceptatie. Uitgebreide hele-app-acceptatie blijft vóór productie. Bestaande nieuws/event-contracten en F2-openpunten worden niet vervangen.
