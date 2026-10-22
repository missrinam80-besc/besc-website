# Bronnen en bewijsgrenzen

Datum voorbereiding: 22 oktober 2026. [bronnen.json](bronnen.json) bevat bronpaden, hashes en bestandsgrootte. Hashes binden deze gelezen bestanden; de hash van een extract bewijst op zichzelf geen volledige gelijkheid met het Word-document. Documentinstructies zijn broninhoud, geen zelfstandige uitvoeringsopdracht.

## Direct gelezen

Masterplanextract en eerdere fit-gap met F2 als eerste event-/nieuwswebsiteketen; bestaande website-scope, stijlgids en inventaris; actuele CC-main e38adfd5704ba0fbf553f04564f1a5a646bcd50d, F1-publicatiemigratie, contractfixture, acceptatieverslag, Compose en voorbeeld-Caddyconfig. D:/CODING/besc-website bevat voorbereiding en extracties, geen bestaande website-app of Gitrepo. GitHub-repolijst bevatte op het controlemoment geen besc-website; dit is een momentopname, geen claim over toekomstige toestand.

## Gebruikersbewijs en besluiten

Linda accepteerde de F1-kern met drie afzonderlijke open punten. Na PR113/merge e38adfd volgden een geslaagde DEV-deploy en bevestiging dat beide vervolgcontroles in orde waren. Het eerdere F1-verslag in Git zegt nog dat de meldingspatch moet worden gedeployed; deze latere chatbevestiging actualiseert dat deel. De digest 1d0f1317… uit het eerdere verslag hoort bij de vorige release en wordt hier niet als huidige digest gebruikt. Geen nieuwe server- of Cloud-inspectie in deze voorbereidingsronde.

Voor F2 bevestigde Linda staging op BESCSRVDEV, website-dev.belgianstreamerscommunity.be, DNS bij one.com en voorlopig crew/vrijwilligers als testers. Dat bewijst geen SSH-/DNS-sessie of concrete accountroster. Oude website-inventaris is van 3 oktober, niet opnieuw als actuele inhoud geverifieerd. Nieuwe juridische feiten, sponsorclaims en programma-activiteiten worden niet uit dit plan verzonnen.

## Technische primaire referenties

- [Next.js self-hosting](https://nextjs.org/docs/app/guides/self-hosting): uitgangspunten voor eigen container en proxy; versies en securityadviezen bij bouwen opnieuw controleren. Geen automatische CC-upgrade uit dit document.
- [Supabase server-side clients](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs): server-/browser-authscheiding; huidige projectconfig en scopes eerst controleren.
- [Caddy automatic HTTPS](https://caddyserver.com/docs/automatic-https): TLS bij de bestaande edge, na gecontroleerde host/DNS-inrichting.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/): engineeringdoel AA, met handmatige en automatische proeven; geen certificering door een groen script.

De beveiligingskeuzes, proposed 60s-intrekkingsgrens en acht werkpakketten zijn ontwerpvoorstellen voor F2. De referenties bewijzen niet dat BESC die al heeft geïmplementeerd. one.com-bedieningsstappen worden pas na inspectie van de werkelijke beheerinterface vastgelegd; geen ongecontroleerde scherminstructies.

## Aanvulling na gebruikersbesluit

Na de eerste voorbereiding vroeg Linda expliciet een aparte private websiterepository. Deze is vervolgens aangemaakt en via GitHub als private gecontroleerd. De eerdere constatering dat besc-website nog niet bestond is dus historisch. Dit besluit keurt geen applicatiebouw of live F2-uitvoering goed.
