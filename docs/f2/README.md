> Actuele status: de afgeschermde DEV-kern is uitgevoerd en na de proeven gesloten. Zie [uitvoerings- en sluitingsbewijs van 23 oktober](Uitvoering-20261023.md) en [alle 69 resultaatgevallen](acceptatiebewijs-20261023.json). Menselijke eindacceptatie en expliciet resterende varianten staan open. De oorspronkelijke voorbereiding hieronder blijft als scopebasis herkenbaar.

# F2 — eerste websiteketen: voorbereidingspakket

**Status: voorbereid ter goedkeuring, niet uitgevoerd.** Datum: 22 oktober 2026. Dit pakket bevat de afgebakende opdracht, contracten, werkvolgorde, acceptatieproeven en het voorgestelde uitvoeringsmandaat. Het bevat geen werkende website of migratie-SQL. De pakketcontrole bewijst alleen de samenhang van de voorbereiding.

F2 levert een afzonderlijke, afgeschermde website op **website-dev.belgianstreamerscommunity.be**, naast het CC op **BESCSRVDEV**. Het CC blijft de bron voor events, nieuws, beoordeling en publicatie. De bestaande publieke website blijft staan. Crew en vrijwilligers zijn de door Linda aangewezen testgroep; concrete bestaande accounts moeten vóór toelating gecontroleerd en vastgelegd worden.

## Goedkeuring en uitvoering

Het voorstel is F2 na één expliciet akkoord per werkpakket te bouwen, testen en gecontroleerd op DEV uit te voeren, binnen [het uitvoeringsmandaat](Uitvoeringsmandaat.md). Er is nu geen uitvoeringsakkoord geregistreerd. **Zelfstandige live uitvoering is nog niet startklaar:** SSH-toegang, een bruikbare DNS-beheersessie bij one.com en het concrete testerregister zijn nog niet geverifieerd. Geen wachtwoorden of sleutels in chat of Git.

## Leesroute

1. [Scope en besluiten](Scope-en-besluiten.md): wat vaststaat, wat wordt voorgesteld en wat later komt.
2. [Werkpakketten](Werkpakketten.md): acht onderdelen met afhankelijkheden en oplevercriteria.
3. [Website en inhoud](Website-en-inhoud.md): schermen, merkstijl en inhoudsmigratie.
4. [Architectuur en beveiliging](Architectuur-en-beveiliging.md), [publicatiecontract](Publicatiecontract.md) en [data en migraties](Data-en-migraties.md).
5. [Acceptatie](Acceptatie.md) en [alle geplande proefgevallen](acceptatiegevallen.json).
6. [Uitvoering en terugval](Uitvoering-en-terugval.md): toegang, releasevolgorde en herstel.
7. [Bronnen en bewijs](Bronnen-en-bewijs.md), [manifest](manifest.json) en [goedkeuringsformulier](goedkeuringsformulier.json).

De JSON-schema's onder contracts/ beschrijven het voorgestelde gegevensformaat. Ze vervangen geen rechtencontrole, HTML-sanitizer, URL-controle of integratietest. Alle voorbeeldinhoud is herkenbaar **TESTFIXTURE — NIET PUBLICEREN** en mag alleen naar de afgeschermde DEV-website.

Controleer de voorbereiding offline met `node docs/f2/validate-preparation.cjs`. Dit controleert de nog-niet-goedgekeurde status, werkpakketafhankelijkheden, geplande gevallen, lokale links, API-referenties en de gebruikte beperkte schemawoordenlijst tegen negen fixtures. Het is geen algemene JSON Schema-validator en voert geen netwerk-, applicatie- of databasetest uit. De implementatie moet standaardvalidators en echte grens-/beveiligingstests gebruiken.

## Afzonderlijke websiterepository

Op Linda's verzoek is dit pakket ondergebracht in de nieuwe private repository [besc-website](https://github.com/missrinam80-besc/besc-website). Die aanmaak is bevestigd; de website-app en F2-live uitvoering blijven niet gestart. Oudere stappen die repositoryaanmaak nog voorstellen, gelden als vervuld voor uitsluitend deze repositoryaanmaak.
