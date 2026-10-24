# CC-contract en eigen toegang

De voorgestelde `besc-platform-publication-v1`-union staat naast `besc-website-publication-v1` voor events/nieuws. Nieuwe velden niet toevoegen aan de oude strikte schema’s. Kopieën onder `contracts/` zijn bytegelijk aan het CC-voorbereidingscontract; wijzigingen krijgen expliciete versie-/hashreview in beide repositories.

De website leest businessdata uitsluitend via beperkte CC-API’s. Auth gebruikt de bestaande Supabase Auth-identiteit en hostgebonden websitecookie; dat is geen toestemming om business-tabellen of private schema’s rechtstreeks te lezen. Geen CC-servicekey, databasepassword of Twitch-token in de website.

F2-staging vereist actieve interne/portaalcontext via `f2_account`; dat is onvoldoende voor extern Mijn BESC zonder intern lidmaatschap. F4 moet een aparte, object-/sitegebonden eigen context bouwen en de werkelijke Auth-/account-contacttrigger bekijken. Geen member-grant als technische oplossing en geen email-match om iemand een bestaand profiel te laten claimen. Staging blijft alleen voor expliciet toegelaten testers.

Publieke contracten bevatten alleen opaque ID, revisie, type/tijd/slug en toegelaten publieksvelden. Eigen/private routes gebruiken de gebruikerssessie en actuele eigendoms-/delegatiecontrole, niet alleen een serverkey. De server leidt organisatie/site/eigenaar af. JSON-schema’s controleren vorm; URL-host/credentials, veilige tekst, actuele sessie, toestemming en mediarechten blijven serververplichtingen.

Voor writes: same-origin/CSRF, strikte payload, duurzame misbruiklimiet, request-ID en payloadhash. Het CC bewaart payload en ontvangst atomair met de behandelgeschiedenis. Retry geeft dezelfde ontvangst of conflict; een storing geeft geen succes en geen stille dubbele inzending. Geen uploads/embeds in de eerste intake en geen automatische emailuitnodiging.

De methoden en eigen responsgrenzen staan in `contracts/api-operations.json`. Een doelversie in een profielvoorstel is geen persoonlijke instemming; die wordt afzonderlijk bevestigd met expliciet `accepted=true`, de exacte versie en veldscope. Een ingediende aanvraag geeft geen publicatie- of rolbesluit.

Voor reads: no-store, geen stale fallback bij ingetrokken toegang, begrensde payload en maximaal 50 per pagina. Intrekking raakt kaarten/detail/zoekresultaten/media en open actieve weergave. Het doel is maximaal 60 seconden voor BESC-beheerde actieve weergave, nog geen bewezen F4-resultaat. Bestaande F3-private metingen blijven buiten de publicatie-/Mijn BESC-projecties.
