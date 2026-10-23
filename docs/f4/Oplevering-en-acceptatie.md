# Oplevering en acceptatie

Websitebasis: main `3c3a841a183c8f04f4e2394d41db1da5754ede01`. CC-basis: `b7ab31b63f0754fee3fb3c578d7488cb25f4dd6e`. De CC-migratiehistorie is door gebruikersuitvoer bevestigd op 126. De oude seed blijft uitgesloten. Er is nu geen nieuwe server-/Cloudinspectie of applicatiewijziging gedaan.

CC en website hebben eigen PR, build, image, env en terugval. Additieve provider vóór consument; nieuwe functies standaard uit. Behoud oude news/event-contracten en bestaande portalen. F4-preparatie is geen deploy-, toegangs- of publicatiemandaat.

De gebruiker voert serverstappen zelf uit: BESCSRVDEV; website `/opt/besc-dev/website`, CC `/opt/besc-dev/command-center`. Pas na concreet pakket en vrijgave; geen productie-DNS/websiteomschakeling. Bestaande publieke website blijft staan. Bewaar vorige images/configuratie; image-terugval is geen databaseherstel. Kleine VPS-capaciteit bij de latere uitrol opnieuw lezen.

Noodzakelijk tijdens bouw: type/lint/build, contract-/rechteigenaar-/opslagchecks voor de gewijzigde paden. Geen uitgebreide handmatige acceptatieronde bij ieder onderdeel. Alle privacy-, actor-, media-, export-, toegankelijkheids-, herstel- en inhoudsvarianten komen in één preproductiepoort.

De 38 gedeeltelijk gedekte F2-gevallen en P10 blijven in de bestaande bestanden zichtbaar; de F2 DEV-kernacceptatie wordt niet veranderd. F1- en F3-open bewijs staat in de CC-overdracht `docs/f4/open-afhankelijkheden.json`. Geen oude onzekerheid als nieuwe geslaagde proef weergeven.

Migratievoorstellen voor 98 historische URL-records staan in CC `docs/f4/content-migration-register.json`. Geen productieredirects uit onbeoordeelde mappings genereren. Bronactualiteit/mediarechten en uiteindelijke SEO-/DNS-omschakeling worden apart beoordeeld vóór F6.
