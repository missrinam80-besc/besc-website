# F6 Releasebasis op DEV

De eerste release bevat Home, Over BESC, Nieuws, Events en Contact. De opdrachtgever bevestigde de positionering, de bestaande logoversie en contact via info@belgianstreamerscommunity.be. Tot nader order lopen goedkeuringen via de opdrachtgever; jaykenbe krijgt geen taken op DEV. Privacyuitwerking en het concrete hostingaanbod zijn uitgesteld. Er is geen publieke opening of productie-uitrol vrijgegeven.

## Afgeschermde preview

`BESC_RELEASE_PREVIEW_ENABLED` is standaard uit. Indien expliciet ingeschakeld toont de shell het basis-menu en gebruikt Home de bestaande sitepagina `home`. Contact gebruikt dan de sitepagina `contact`, ook wanneer de afzonderlijke formulierflag aan staat. Er wordt voor deze preview geen nieuw formulier geopend. De bestaande pagina-, publicatie-, authenticatie- en testtoegang blijven vereist. De preview wijzigt geen rollen, siteconfiguratie of inhoud in CC.

De voorbereide payloads in `content/` zijn geen runtimefallback. Ze moeten via de bestaande concept- en publicatieketen met actuele dossier-/revisiegegevens en vereist bronbewijs worden vastgelegd. De homepage is route `/` met pagina-slug `home`. Onbeschikbare inhoud blijft onbeschikbaar. Er worden geen UUID's verzonnen en geen dossiers blind opnieuw aangemaakt.

## Productieadressen voorbereiden

`NODE_ENV=production` betekent ook op de DEV-server een geoptimaliseerde build. Daarom bepaalt de nieuwe, serverzijdige `BESC_DEPLOYMENT_ENV` de doelomgeving, standaard `dev`. DEV blijft beperkt tot de bestaande DEV-origins, met localhost uitsluitend buiten een production build.

Bij `BESC_DEPLOYMENT_ENV=production` zijn expliciete HTTPS-origins nodig. De website-URL moet exact overeenkomen met `BESC_APPROVED_PRODUCTION_WEBSITE_ORIGIN`; de CC-URL met `BESC_APPROVED_PRODUCTION_CC_ORIGIN`. Beide staan standaard leeg. Credentials in de URL, een pad, query, fragment, afwijkende poort, localhost en de bekende DEV-origins worden geweigerd. De waarden komen uitsluitend uit beheerde serverconfiguratie, nooit uit een gebruikersformulier of request-header. Geen actuele productiedomeinen zijn met deze wijziging gekozen.

Deze configuratievoorbereiding maakt de website niet publiek. Inhoud vraagt nog steeds een geldig viewer-token en de bestaande staging-/publicatiecontroles. De stagingbanner, noindex en robotsblokkade blijven behouden. CC heeft voor een latere publieke opening een afzonderlijke, begrensde leesroute nodig voor alleen vrijgegeven revisies en media. Die is niet gebouwd of geactiveerd door deze wijziging.

## Beperkte validatie

De nieuwe gerichte controles toetsen adresgrenzen, het niet doorsturen van viewer-token of publicatiesleutel naar een verkeerde origin, behoud van authenticatie, het basis-menu en het ontbreken van een lokale tekstfallback. De bestaande controles voor site-inhoud en stagingredirects zijn eveneens uitgevoerd. TypeScript en de geoptimaliseerde build slagen. Er is geen live login, databasewijziging, deploy of brede handmatige acceptatie uitgevoerd. Bestaande CI blijft intact.

## Nog open

De daadwerkelijke inhoudsregistratie, activering van de DEV-preview, productiedatabasekeuze, hosting, publieke leesroute, publieke SEO en productiebeelden vereisen hun eigen concrete voorbereiding en vrijgave. De database blijft voorlopig Cloud DEV. De repositories en serveruitrollen voor CC, website en bot blijven gescheiden.
