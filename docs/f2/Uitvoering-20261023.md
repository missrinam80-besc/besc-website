# F2 — DEV-kern uitgevoerd, eindacceptatie open

Stand: 23 oktober 2026, na de live eindcontrole. Linda heeft de uitvoering toegestaan en de serverstappen zelf uitgevoerd op BESCSRVDEV. Dit verslag actualiseert de historische bouwstand van 22 oktober.

De eerste websiteketen is gebouwd, op afgeschermde DEV uitgerold en met herkenbare testinhoud beproefd. De staging is na de proeven gesloten. Alle tijdelijke testtoegang en publicatierollen zijn beëindigd. De volledige formele F2-acceptatie is nog open: de persoonlijke toestemmingsproef is op verzoek overgeslagen en het register bevat gedeeltelijk gedekte varianten.

## Beoordeelde releases

| Onderdeel | Bron en controles | Werkelijk uitgerolde image |
| --- | --- | --- |
| CC-publicatieketen | PR114; oorspronkelijke F2-release | Historisch `sha256:2a814cc0bbfefaff65ad21900991a0abbc1be20038da0776cc1c5e2d2886ead1` |
| CC-tijdzonecorrectie | PR115; hoofdbranch `f68a0e13bfc730d0e787bf4f0cfe56603c645254`; kwaliteit 39916670199 en imagebouw 39916670197 geslaagd | `sha256:50d71244b514035e49eab97678433816968de0f428852c043c6d63091a151c38` |
| Private website | PR1 en PR2; laatste beoordeelde hoofdbranch `27004dd39d2857c23b564554dd776956e6376eee`; kwaliteit 39808979156 en imagebouw 39808979343 geslaagd | `sha256:8cfe9f9efb256524bfc804c3494927f0949f6b8f919c1ab529f427f93f469344` |

CC telt 1.049 geslaagde tests na de tijdzonecorrectie. De website telt twaalf unitproeven en vijf browsergevallen met fictieve Auth-/CC-upstreams. Native PostgreSQL-proeven bewijzen aanvullende rechten- en racegevallen in een geïsoleerde omgeving. Iedere bewijslaag blijft herkenbaar in het register.

De ene additieve F2-migratie bracht de DEV-historie van 123 naar 124. Oude registraties en gecontroleerde bestaande gegevens bleven behouden; de oude seed bleef uitgesloten. De tijdzonecorrectie vereiste geen extra migratie.

## Live bewezen kern

- Vier vooraf aangewezen bestaande accounts kregen begrensde stagingtoegang. De tweede lezer bevestigde zichtbare testinhoud en het verdwijnen ervan. De rechtstreekse CC-beheerroute stuurde dit account terug met `geen-toegang`.
- Nieuws en events doorliepen concept, aparte beoordeling en bewuste vrijgave. Een nieuw concept en de goedkeuring daarvan lieten de bestaande snapshot exact staan. Expliciete vervanging behield hetzelfde publieke ID.
- De media kwamen uit eigen synthetische kleurpatronen. Upload, afgeleverde WebP, bytehash en metadata zijn gecontroleerd. Mediarechten-intrekking en afzonderlijke mediarecord-intrekking blokkeerden de geteste routes en open weergaven binnen zestig seconden.
- Tijdvenster en publicatie-intrekking zijn gemeten. Browser-terug en -vooruit toonden na intrekking lege of geblokkeerde inhoud.
- Een bronwijziging na indienen maakte de oude beoordeling onbruikbaar: bronversie 3 tegenover snapshotversie 2, weigering in de UI en de oude snapshot bleef `in_review`. Daarna is zij expliciet ingetrokken.
- De synthetische eventbron werd gearchiveerd bij een actieve pointer: detail geweigerd binnen 11,975 seconden, open pagina verdwenen binnen 26,661 seconden en lijst uiterlijk 37,360 seconden leeg. De meetklok startte vóór het opslaan.
- De eigen tijdelijke lezer werd ingetrokken tijdens een positieve sessie: lijst geweigerd binnen 11,736 seconden, open pagina verdwenen binnen 20,709 seconden en detail uiterlijk 34,459 seconden geweigerd. Het CC-account en voorzittersmandaat bleven behouden.
- Reflow is live bekeken op 320, 390, 768 en 1440 CSS-pixels. Beide thema’s, skiplink, navigatie en themaschakelaar zijn gebruikt. De gemeten tekstcontrastminima waren 6,36 in donker en 6,95 in licht. De bredere toegankelijkheidsreview blijft afzonderlijk zichtbaar.

## Gevonden en herstelde afwijkingen

De live eventbewerking weigerde de geldige Brusselse tijd 25 oktober 2026 om 01:30. PR115 corrigeert de omzetting rond de klokwissel. Elf nieuwe regressieproeven slagen. Live opslaan en een onafhankelijke alleenlezende databasecontrole bevestigen `2026-10-24T23:30Z` tot `2026-10-25T02:30Z`; de website toont 01:30–03:30 in Brussel, met drie uur werkelijke duur.

De eerste uitrolhulp kon onder `pipefail` onterecht een verkeerde Compose-image melden: `grep -q` sloot de pijp voordat Compose klaar was met schrijven. De stop vond plaats vóór ophalen, taggen of vervangen. V2 leest eerst de volledige uitvoer en controleert daarna exact één verwachte verwijzing. Twaalf lokale simulaties slagen; Linux-root- en bestandsrechten zijn niet door de Windows-simulatie bewezen. Linda heeft V2 daarna succesvol op DEV uitgevoerd. De uitrolcontrole bevestigde behoud van configuratie, bestaande functiestanden, website en Caddy.

De eerdere serverrollbackhulpen V1 en V2 stopten vóór wijziging door onjuiste controleaannames. V3 startte de bewaarde oudere CC-image daadwerkelijk, bevestigde bereikbaarheid van de bestaande database met een alleenlezende controle, stopte en herstartte de huidige website en herstelde de exacte beoordeelde images/configuratie. Het bewijs geldt voor die gemeten releases; de latere tijdzonecorrectie heeft een eigen bewaarde terugvalimage.

## Back-up en terugval

De Cloud DEV-export, bijbehorende Storage-overdracht en geïsoleerde herstelproef zijn gekoppeld aan gecontroleerde bewijsbestanden. De rollbackmap met de websiteconfiguratie is buiten de VPS gekopieerd; alle negentien bestanden kwamen overeen met de servercontrolesommen. Geheime configuratie en sleutels blijven buiten deze repository.

De laatste CC-terugvaltag is `besc-commandcenter:f2-dst-before-20261023T074705Z`. Het afgeschermde uitrolbewijs staat op de server onder `/var/backups/besc-command-center/f2-dst-deploy/20261023T074705Z-2lTg3a`. Dit vervangt geen algemene, volledige uitvalproef van Auth, mail en alle externe diensten.

## Onafhankelijk gecontroleerde eindtoestand

De query gebruikte `begin read only; select; rollback`. De teruggelezen waarden staan in [eindcontrole-20261023.json](eindcontrole-20261023.json).

| Controle | Eindresultaat |
| --- | --- |
| Staging | Uitgeschakeld |
| Actieve stagingtesters | 0 |
| Niet-ingetrokken testvrijgaven | 0 |
| F2-testrevisies | 8; alle ingetrokken |
| Niet-ingetrokken testmedia | 0 |
| Tijdelijke publicatierollen | 0 actief; beide laatste beëindigingen geaudit |
| CC-account en geverifieerde voorzittersbinding | Behouden |
| Overige bestaande taakrollen | `consent_registrar` en `partner_editor` behouden |
| Synthetische bron | Gearchiveerd |
| Overgeslagen F2-toestemmingsproef | Doel ingetrokken; 0 verklaringen |
| Mediabucket | Privé |
| Migratiehistorie | 124 |

Het afgeschermde testbewijs blijft bewaard. De bestaande publieke website blijft beschikbaar. De uitrolcontroles bevestigen behoud van Twitch-instellingen en de vier eerder uitgeschakelde functies.

## Volledige acceptatie blijft een afzonderlijk besluit

[acceptatiebewijs-20261023.json](acceptatiebewijs-20261023.json) koppelt alle 69 oorspronkelijke gevallen aan resultaat en bewijslaag:

| Bewijsstatus | Aantal |
| --- | ---: |
| Live gecontroleerd | 16 |
| Live, expliciet beperkte scope of conservatieve tijdsbovengrens | 7 |
| Gecontroleerd binnen expliciete scope of CI | 6 |
| Gedeeltelijk gedekt | 38 |
| Door Linda overgeslagen | 1 |
| Menselijke eindacceptatie open | 1 |

Bij gedeeltelijke dekking heeft een deel van de geplande varianten bewijs. De resterende varianten staan per geval vermeld. De belangrijkste groepen zijn:

- Aanvullende live actor-, sessie-, sleutelrotatie-, redirect- en directe API/RPC-varianten; onder meer een volledige andere-organisatiematrix.
- Volledige conditionele-cache-, prefetch-, offline/pageshow-, metadata-/OG-/RSC- en storingsmatrix, plus een langdurige actieve mediastream.
- Verdere contract-, upload-, grenswaarde- en racevarianten die niet individueel aan uitgevoerd bewijs zijn gekoppeld.
- De volledige toetsenbordaanmeldroute, zoom/reduced-motionreview en volledige bundle-/sourcemap-/logcontrole.
- Algemene rechtenvrijgave voor echte inhoud en een nieuwe volledige Discord-/Twitch-/saldoketen vallen buiten het geleverde live testbewijs.
- P10, de persoonlijke toestemmingsproef, blijft op verzoek overgeslagen.

E04 blijft open tot de bevoegde eigenaar de bewezen DEV-kern en de expliciet resterende punten beoordeelt. Dit verslag geeft geen productie- of algemene beveiligingsvrijgave. De afzonderlijk open gehouden F1-varianten blijven herkenbaar; het F2-rollbackbewijs sluit die niet stilzwijgend allemaal af.
