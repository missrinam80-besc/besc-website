# F6 Website voor expliciet vrijgegeven publieke inhoud

Deze wijziging sluit de website aan op de afzonderlijke CC-leesgrens uit Command Center PR 124. De standaardinstellingen blijven afgeschermd. Er is geen publieke opening of productieomgeving met deze code ingericht.

## Twee gescheiden standen

De bestaande DEV-stagingstand blijft aangemelde testers en expliciete testtoegang vereisen. `BESC_PUBLIC_WEBSITE_ENABLED` staat standaard uit. De publieke stand kan alleen worden voorbereid met `BESC_DEPLOYMENT_ENV=production`, expliciet goedgekeurde website- en CC-origins en zonder ingeschakelde stagingstand. Tegenstrijdige configuratie wordt geweigerd en valt niet terug naar een andere omgeving.

De publieke stand gebruikt een afzonderlijke `BESC_PUBLIC_WEBSITE_KEY` die alleen op de website-server staat. Die moet overeenkomen met het apart geregistreerde publieke kanaal in CC. De stagingkey, Supabase-servicekey, browsercookies en gebruiker-tokens worden niet als vervanging gebruikt of doorgestuurd. In CC blijft de aparte publieke leesflag standaard uit.

## Alleen de basisrelease

Home, Over BESC en Contact gebruiken de bestaande veilige paginaweergave. Nieuws, events en media volgen hun bestaande strikte contracten. De server kan alleen de vaste leesroutes onder `/api/v1/public-website` benaderen. Vrije upstreamadressen, paden buiten de beperkte leeslijst, redirect-volgen, te grote antwoorden en niet-toegestane media worden geweigerd. Een onbeschikbare bron heeft geen tekst- of stagingfallback.

Alle privé-platformreads en schrijfacties worden in de publieke stand gestopt vóór een gebruiker-token wordt opgevraagd, ook als een andere platformflag per ongeluk aan staat. De publieke shell bevat uitsluitend het basis-menu, zonder stagingclaims, uitlogformulier of verborgen platformmenu's. De website-login en Auth-callback zijn in die stand gesloten. De bestaande CC-aanmelding blijft een afzonderlijke toepassing.

De gewijzigde weergave neemt geen nog onbekende privacytekst, extra foto's, partnerlogo's, creatorprofielen of formulieren op. De eerder voorbereide inhoud moet nog via de gecontroleerde bron- en publicatieketen worden geregistreerd en aan het publieke kanaal worden toegelaten. Het bestaande BESC-logo blijft hetzelfde bestand.

## Intrekking en beschikbaarheid

De clientcontrole op actuele inhoud, zichtbaarheid, offline gaan en terugkeer naar een pagina blijft bestaan. De eerste publieke HTML mag de zojuist serverzijdig gecontroleerde inhoud tonen; daarvoor wordt geen JavaScript-aanmelding vereist. Ontbrekende of ingetrokken inhoud wordt niet uit een oude lokale kopie teruggezet. Inhoudsresponses blijven no-store. Foutweergaven krijgen noindex.

## Indexering staat apart uit

`BESC_PUBLIC_WEBSITE_INDEXING_ENABLED` staat eveneens standaard uit. Publieke leesbaarheid schakelt indexering dus niet automatisch in. Een latere expliciete indexeringsvrijgave is beperkt tot de basisroutes en geldige nieuws-/eventdetails. API's, login, account- en andere platformroutes behouden noindex. Robotsregels worden op runtimeconfiguratie beoordeeld, zodat een DEV-build niet ongemerkt indexeerbaar wordt.

Metadata en publieke presentatie zijn voorbereid. Er is geen sitemapimport, redirectimport of productie-SEO-acceptatie uitgevoerd. De 98 historische URL-besluiten blijven afzonderlijke besluiten. Privacy en het concrete hostingaanbod blijven op verzoek van de opdrachtgever uitgesteld; deze code stelt dat beleid niet vast.

## Gerichte validatie

Negen nieuwe gerichte controles toetsen modescheiding, uitsluitend de aparte serverkey, weigeren van privéreads en writes, geen fallback, antwoordgrootte/MIME, publieke presentatie, afzonderlijke indexering en de gesloten Auth-callback. De negen bestaande gerichte release-/site-inhoudcontroles zijn eveneens groen, evenals TypeScript en de geoptimaliseerde build. De bestaande CI blijft intact.

Dit is geen live-proef op een productiedatabase en geen brede handmatige acceptatieronde. De volledige keten met de echte bronselecties, alle intrekkingsvarianten, SEO, bereikbaarheid en herstel wordt op de stabiele releasekandidaat beoordeeld vóór productie.

## Apart vrij te geven

Geen migratie, serveruitrol, sleutelregistratie, publicatie of activering is uitgevoerd. Cloud DEV blijft behouden. Het uiteindelijke hostaanbod, databasekeuze, exacte productiedomeinen, definitieve inhoud en eventuele latere indexering vragen hun eigen concrete uitvoering en akkoord van de opdrachtgever.
