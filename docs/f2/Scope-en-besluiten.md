# Scope en besluiten

## Bevestigd

| Besluit | Bron en betekenis |
| --- | --- |
| F2 voorbereiden; uitvoering pas na goedkeuring | Linda's huidige opdracht. Geen live wijziging door deze voorbereiding. |
| Afzonderlijke websitecontainer op BESCSRVDEV | Linda bevestigde website-dev.belgianstreamerscommunity.be. Bestaande publieke website blijft tijdens F2 staan. |
| DNS bij one.com | Door Linda gemeld; beheerrechten en sessie nog niet gecontroleerd. |
| Crew en vrijwilligers als testers | Laatste aanwijzing van Linda. Bestaande accounts controleren; geen automatische toegang voor oude, onbevestigde of alleen in Discord genoemde leden. |
| Eén huisstijl, licht en donker, herkenbaar BESC | Eerdere websiteopdracht; bestaande voorbereiding opnieuw gelezen. Geen logo hertekenen. |
| F1-kern geaccepteerd op DEV | Expliciete acceptatie met drie afzonderlijk open punten; laatste deploy en twee aanvullende controles door Linda bevestigd. Geen nieuwe serverinspectie in deze voorbereidingsronde. |

## Binnen F2

Een afzonderlijke websitecodebase; eigen build en image; afgeschermde staging; home, nieuws- en eventoverzichten en detailpagina's; toegankelijk navigeren; responsive licht/donker; dezelfde bestaande accountidentiteit via Supabase Auth; beperkte CC-leesroutes; exacte goedgekeurde publicatiesnapshots; publiceren, vervangen, plannen en intrekken vanuit CC; één beheerde mediafixture; audit en herhaalveiligheid; beveiliging, cache-intrekking en gecontroleerde terugval aantonen.

Voor nieuws én event wordt een volledige keten bewezen: concept → beoordeling → exact akkoord → bewuste vrijgave naar staging → weergave → nieuwe revisie zonder geërfd akkoord → vervanging → intrekking. Goedkeuring in CC betekent niet automatisch vrijgeven naar de website.

## Buiten F2

Geen vervanging van de bestaande publieke website, wijziging van hoofddomein/www/mail-DNS of productie-uitrol. Geen volledige inhoudsmigratie, creatorregister, Mijn BESC-portaaluitbreiding, sponsorportaal, vrijwilligersintake, webshop/checkout of algemene formulieren. Geen nieuwe socialmetingen, campagne-intake, AI-publicatie, botdeploy, Streamer.bot-inrichting, saldo-overname of automatische beloningen. Geen betaalde diensten aanschaffen. Geen juridische conformiteitsverklaring.

De bestaande brede websitescope blijft behouden als richting, met F3 campagneproef, F4 platformfuncties en verdere inhoudsmigratie, F5 aanvullende koppelingen en F6 productie/websiteomschakeling. Partnerprojecties horen niet stilzwijgend bij de eerste event-/nieuwsketen.

## Voorstellen waarvoor het uitvoeringsakkoord nodig is

| Onderwerp | Voorstel |
| --- | --- |
| Websitebroncode | Private repo missrinam80-besc/besc-website is op verzoek van Linda aangemaakt en als private gecontroleerd; los van CC en Discordbot. |
| Websiteplaats | BESCSRVDEV, /opt/besc-dev/website; afzonderlijk Composeproject en image. |
| Toegang | Afgeschermde lijst van geverifieerde, actieve bestaande BESC-account-ID's voor de aangewezen crew/vrijwilligers. Geen openbaar aanmelden. |
| Rollen voor de proef | Linda tijdelijk publication_editor en publication_reviewer, alleen voor de beschreven DEV-proef; na afloop beëindigen en teruglezen. Geen andere leden extra CC-rechten geven. |
| Intrekking | Meetbare bovengrens 60 seconden voor BESC-beheerde responses en normaal actieve webweergave; nog te bouwen en te bewijzen. |
| Media | Eén eigen private stagingbucket met herkenbare synthetische afbeelding en afgeschermde uitlevering; geen algemene media- of Drive-import. |

## Open voorwaarden

De SSH-route met gecontroleerde hostidentiteit is niet bevestigd. Voor one.com is alleen de leverancier bekend; DNS-toegang is niet bewezen. Crew/vrijwilligers moeten aan actuele CC-accounts worden gekoppeld; als bestaande rollen dit niet eenduidig bewijzen, eerst een afgeschermde concrete lijst laten bevestigen. Ook DNS-recordconflicten, vrije serverruimte, huidige Caddyconfiguratie, de werkelijk draaiende CC-image en actuele databasebaseline worden pas bij de voorcontrole vastgesteld. Onbekend betekent geen toestemming of geslaagde test.
