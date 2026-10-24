# F4 — routes en bouwvolgorde

Alle nieuwe routes hieronder zijn voorstellen, nog niet geïmplementeerd. De huidige staging blijft gesloten. Het bestaande logo, semantische stijl, licht/donker, header/footer, CSP en hostgebonden sessie blijven uitgangspunt.

| Route | Scherm / eigen handeling |
| --- | --- |
| /creators | Alleen actuele vrijgegeven profielkaarten; filters op gekozen discipline/taal/platform, geen volgersranglijst |
| /creators/[slug] | Gekozen profielvelden, veilige platformlinks, avatar/alt/credit; geen email/private metingen |
| /samenwerkingen en /samenwerkingen/[slug] | Eén profiel per organisatie met afzonderlijk bevestigde rollen |
| /esports | Gefilterde bevestigde esportsrol, geen apart duplicaatregister |
| /vrijwilligers | Informatie en actuele vacatures; lege toestand als er geen bevestigde vacatures zijn |
| /vrijwilligers/vacatures/[slug] | Beoordeelde vacature, taken/verwachtingen en sluitingsmoment |
| /vrijwilligers/vacatures/[slug]/aanmelden | Eigen ingelogde aanvraag, minimale motivatie/beschikbaarheid, ontvangst pas na duurzame opslag |
| /samenwerken/aanvragen | Eigen samenwerkingsvoorstel; geen automatische partner-/sponsorstatus |
| /mijn-besc | Eigen profiel-/verklaring-/aanvraagoverzicht zonder interne CC-rol |
| /mijn-besc/profiel | Eigen beperkte profielwijziging als nieuw voorstel, geen directe live wijziging |
| /mijn-besc/aanvragen | Eigen ontvangst en toegestane status; interne beoordeling/notities nooit zichtbaar |
| /mijn-besc/toestemmingen | Exacte doeltekst/veldscope persoonlijk kiezen en intrekken |
| /over-besc, /contact, /privacy | Alleen beoordeelde statische revisies; geen ongecontroleerde historische tekst |

## Bouwvolgorde

1. Nieuwe versiecontracten en server-only client naast ongewijzigde F2 news/event-client.
2. Eén creator als eerste verticale keten, inclusief eigen toegang, concept, reviewer, vrijgave en intrekking.
3. Partner/esportsprojecties en private aanvraag.
4. Vacature en eigen sollicitatie.
5. Mijn BESC-overzicht samenbrengen en historische portaalroutes behouden.
6. Beoordeelde informatiepagina’s, bronmigratie en expliciete redirectvoorstellen.
7. Afzonderlijke websiteimage, noodzakelijke basischecks en uitgestelde volledige acceptatiematrix.

## Ontwerpvoorwaarden

Alle velden hebben labels, foutfocus en begrijpelijke status. Toon afzonderlijk: nog geen gegevens, geen toegang, verlopen/ingetrokken, storing, concept en ontvangen. Geen succes na uitsluitend een verzonden request. Vorm en kaart tonen geen interne technische rol- of databasenaam.

Navigatie toont alleen gebouwde en inhoudelijk bruikbare onderdelen. Academy, Originals, Cares, NEXT UP, toernooien en shop worden niet als actieve werking ingevuld met fictie. Mobiel, toetsenbord en licht/donker horen bij gedeelde componenten; uitgebreide browseracceptatie blijft vóór productie.
