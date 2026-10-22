# Acceptatie en bewijs

Alle gevallen in acceptatiegevallen.json staan op planned. De voorbereiding of een groen pakketcontrolescript is geen uitgevoerd applicatie-, database- of DEV-testbewijs. Tijdens uitvoering krijgt ieder geval actual_result, evidence_ref, tested_commit/image, environment, timestamp en eventuele beperking. Geïsoleerd, CI, live DEV en gebruikersbevestiging blijven afzonderlijke bewijsniveaus.

## Vrijgavepoorten

1. Lokale/schema/SQL-tests en relevante bestaande CC-regressie groen; geen ongewenste schemawijziging of seed.
2. Producent- en consumentcontracttests, echte PostgreSQL-races en container-e2e groen, inclusief onbekende velden/HTML/SSRF/tenantomwegen.
3. Visuele handmatige review en geautomatiseerde toegankelijkheidscontrole in beide thema's; een scanner alleen accepteert geen volledige toegankelijkheid.
4. Handmatige back-up compleet buiten VPS en herstelproef; recente baseline zonder onverklaard verschil; vorige images beschikbaar.
5. Op DEV: alleen toegelaten crew/vrijwilligers; event én nieuws volledig beoordelen/vrijgeven/wijzigen/intrekken; anonimiteit en rechtenintrekking bewezen; CC/bot/flags ongewijzigd buiten de bedoelde F2-wijzigingen.
6. Intrekking gemeten vanaf databasecommit met normale actieve webview en afzonderlijke HTTP-polls van lijst/detail/media. Alle paden uiterlijk binnen 60s geblokkeerd; dezelfde proef bij toestemming/media-intrekking en venstereinde. Geen 304, prefetch/routercache, proxycache of stale-on-error die inhoud terugbrengt.
7. Gecontroleerde DEV-image-terugval en opnieuw vrijgeven, inclusief oude CC-image met additieve F2-schemawijzigingen. Geen destructief schemaherstel voor gewone rollback.
8. Tijdelijke publicatierollen beëindigd, fixtures ingetrokken, audit en veilige eindtoestand gecontroleerd. Menselijke F2-acceptatie pas na eindverslag, niet automatisch na deploy.

## Rechtenmatrix voor proeven

| Actor | Lezen staging | Concept | Review/vrijgave | Intrekken |
| --- | --- | --- | --- | --- |
| Anoniem / onbekend account / andere organisatie | Nee | Nee | Nee | Nee |
| Toegelaten crew/vrijwilliger zonder taakrol | Ja, alleen veilige projectie | Nee | Nee | Nee |
| Redacteur met publication_editor | Alleen met stagingtoelating | Ja | Nee | Binnen bestaande F1-bevoegdheid |
| Reviewer met publication_reviewer | Alleen met stagingtoelating | Nee | Ja, afzonderlijke acties | Binnen bestaande F1-bevoegdheid |
| Technisch admin/voorzitter zonder publicatierol | Alleen met stagingtoelating | Nee | Nee | Nee |

Gebruik geïsoleerde synthetische actoren voor de volledige negatieve matrix. Live slechts aangewezen bestaande accounts; geen echte extra bevoegdheden afleiden. Indien geen geschikt tweede crew-/vrijwilligersaccount beschikbaar is, die live variant open rapporteren en F2 niet volledig afvinken.

## F1-openpunten behouden

Aanvullende live rolwissels, de volledige vertrouwelijke export-/notificatieketen en het terugzetten van de vorige serverimage waren afzonderlijk open. F2 moet zijn eigen leesprojectie en compatibele CC-/website-image-terugval aantonen vóór volledige acceptatie. Alleen het werkelijk uitgevoerde deel sluit een bijbehorend F1-punt of deel daarvan; niet automatisch alle export-/notificatievarianten. Niet-afhankelijke F1-varianten blijven zichtbaar open. Geen nieuwe F2-websiteacceptatie gebruiken als bewijs voor F3-campagnemetingen of productie.
