# Voorgesteld publicatiecontract

Contractnaam besc-website-publication-v1. Dit is een F2-voorstel, geen bestaande route. De F1-payload blijft besc-publication-v1; F2 voegt een afzonderlijke veilige response-envelope toe. Versies worden niet ongemerkt uitgewisseld.

## Uitlevering

| CC-route | Antwoord |
| --- | --- |
| GET /api/v1/publications/news | Begrensde lijst goedgekeurde én vrijgegeven nieuwssnapshots |
| GET /api/v1/publications/news/{slug} | Eén geldige vrijgegeven snapshot |
| GET /api/v1/publications/events | Begrensde lijst geldige events |
| GET /api/v1/publications/events/{slug} | Eén geldige eventsnapshot |
| GET /api/v1/publications/media/{public_media_id} | Alleen bytes die bij een momenteel toegankelijke publicatie horen |

Elke route vereist Authorization: Bearer viewerJWT en X-BESC-Publication-Key. Beide worden uitsluitend server → server gebruikt; de sitecredential gaat nooit naar een browserbundle, cookie of log. Sleutels afzonderlijk genereren, beperkt opslaan, gehasht vergelijken en roteerbaar maken. Geen bestaande botclient hergebruiken. Verzoeken krijgen een onschadelijk correlatienummer; foutdetails intern afschermen.

Alleen queryvelden locale, limit en cursor zijn toegestaan op lijsten; details alleen locale. Locale default nl-BE; alleen nl-BE, fr-BE, en. Geen automatisch vertaalde of ontbrekende taalinhoud verzinnen. Limit default 20, maximaal 50, uitsluitend gehele positieve getallen. Cursor is getekend en gebonden aan site, kanaal, type, locale en sortering; geen leesbare bron-ID's of ongecontroleerde SQL. Stabiele sortering published_at aflopend, public_id als tie-break. Bij wijzigingen tussen pagina's kan een nieuwe reeks nodig zijn; geen claim van een databasebrede momentopname. Duplicaten binnen een reeks voorkomen en gewijzigde cursors weigeren.

Nieuwspaden op de website zijn /nieuws en /nieuws/{slug}; events /events en /events/{slug}. Slugs zijn uniek per site, type en locale. Een public_id blijft gelijk bij een revisievervanging; interne source_id en revision_id worden niet uitgegeven. Slugwijzigingen zijn buiten de eerste vrijgaveflow; geen stilzwijgende redirects.

## Velden

De schema's in contracts/ zijn normatief voor de responsevorm: uitsluitend schema_version, type, public_id, revision, slug, locale, title, summary, body, media, published_at en bij events starts_at, ends_at, timezone, location_label, registration_url. Media bevat uitsluitend public_media_id, alt en credit. Website maakt het beschermde mediapad zelf. Externe registratie-URL alleen na https-/hostcontrole en bewust akkoord; geen eigen inschrijfformulier in F2. De vijf routes en twee vereiste authenticaties staan ook in [OpenAPI](contracts/openapi.json); lijsten zijn per type begrensd door een eigen schema.

De adapter leest de exact goedgekeurde F1-snapshot. Ontbrekende optionele summary/credit wordt een lege tekst; ontbrekende of lege registratie-URL wordt null in de response. Een F1-media-URL moet exact overeenkomen met een vooraf geregistreerd canoniek stagingmediapad en gecontroleerde byteshash; alleen dan wordt die naar public_media_id geprojecteerd. Geen URL naar willekeurige externe bytes omzetten. Deze vaste projectieregels veranderen geen inhoudelijk akkoord. Als de HTML-sanitizer inhoud zou moeten herschrijven, weiger vrijgave en laat een nieuwe veilige revisie beoordelen; serveer geen stilzwijgend gewijzigde goedgekeurde tekst.

Dates zijn tijdzonebewuste RFC3339-instanties; starts_at < ends_at, presentatie Europe/Brussels. Geen onbekende datum invullen om een schema te laten slagen: onvolledig event is niet vrijgeefbaar. Gebruik UTC voor tijdsvensters en serververgelijkingen. Geen willekeurige auteur of sponsor afleiden uit private records. HTML/URLs, bestandstoegang, datums en geldigheidsrechten worden naast JSON Schema semantisch gevalideerd.

## Fouten en cache

401 geen geldige authenticatie, 403 geen actuele toegang, 400 ongeldige invoer/cursor, 404 onbekend/niet vrijgegeven/ingetrokken/niet geldige publicatie zonder bestaansverschil, 429 begrenzing en 503 afhankelijke dienst niet bereikbaar. Veilige fout-envelope: code en request_id; geen SQL, tokens, private IDs of oorzaak waarmee bestaan kan worden afgeleid. Succes bevat alleen het schema; lijst-envelope schema_version, items en next_cursor.

Alle inhoudsresponses inclusief fouten: Cache-Control private, no-store; geen stale-if-error. Geldigheid en rechten controleren vóór enige conditionele response: geen 304 voor ingetrokken inhoud. Test dat proxy, browserrouter, prefetch en media geen eerder geldige antwoorden laten voortleven.

Gezamenlijke contracttests delen schemafixtures tussen twee afzonderlijke repos via vastgepinde contractversie, niet via een monorepo of levende databasekoppeling. Een brekende verandering vereist een nieuwe versie of compatibele overgang. CI test zowel de producent als de consument en de werkelijk gestarte containers.
