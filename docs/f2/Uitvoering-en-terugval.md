# Uitvoering, toegang en terugval

Dit is een draaiboek, geen opdracht om nu te wijzigen. Geen klaarstaande live migratie- of deployknop in dit voorbereidingspakket. Iedere operationele instructie vermeldt straks expliciet **server, map, doel, alleenlezen of wijzigend**.

## Toegang vóór zelfstandige live uitvoering

| Toegang | Huidige stand | Voorwaarde |
| --- | --- | --- |
| GitHub | Bestaande CC-repo en main gelezen met aanwezige CLI-auth | Recht nieuwe private website-repo en workflows controleren zonder credential te tonen |
| BESCSRVDEV SSH | Niet bevestigd | Afgeschermde taaktoegang, hostfingerprint via vertrouwde bron, beperkte rechten; geen wachtwoord/sleutel in chat |
| one.com DNS | Leverancier door Linda bevestigd | Geauthenticeerde bruikbare sessie; MFA door mens indien gevraagd; eerst alleenlezen recordinspectie |
| Cloud DEV | F1 eerder gecontroleerd | Nieuwe alleenlezende bereikbaarheid/baseline; geheim via beveiligde invoer, gevalideerde TLS, geen TLS-bypass |
| Website-testers | Crew en vrijwilligers aangewezen | Concrete huidige geverifieerde accounts en eindige toelating; geen onduidelijke groepsimport |
| Supabase Auth-staging | Bestaande CC-identiteit hergebruiken | Exacte callbackhost en sessiegedrag gecontroleerd; geen wildcardredirect of hoofd-domeincookie |

Als één route ontbreekt kan de lokale bouw na akkoord doorgaan, maar de afhankelijke live stap niet. Zelfstandige uitvoering betekent geen omzeiling van menselijke login, MFA, ontbrekende bevoegdheden of verplichte toolbevestiging.

## Volgorde na goedkeuring

1. **GitHub / lokaal, alleenlezen:** current main, F1-bewijs, broncontracten en huidige releases vastleggen. **BESCSRVDEV, /opt/besc-dev/command-center, alleenlezen:** werkelijke Compose/Caddyconfig, image-ID/digest, env-vlagnamen/booleans zonder waarden, netwerken, beschikbare resources en back-uplocatie. Bestaande repo-Caddyfile bevat voorbeeldhost: nooit over de werkelijke serverconfig schrijven.
2. **one.com, DNS-beheer, alleenlezen:** exacte zone, huidig website-dev-record, wildcard/AAAA/CAA en conflicten inspecteren; server-IP rechtstreeks uit gecontroleerde hostbron. Geen A/AAAA-target verzinnen. Voeg geen AAAA toe zonder werkend IPv6-pad. Bewaar veilige recordvoor/na-registratie.
3. **Lokaal/GitHub, wijzigend na akkoord:** website-repo maken; CC- en websitebranches apart; code en tests; exacte migratiehashes en compatibiliteitsrapport. Beoordeelde PR's alleen mergen na geslaagde vereiste controles, geen branchbeveiliging omzeilen. Geen nieuw betaalde CI/hosting activeren.
4. **BESCSRVDEV / Cloud DEV, handmatig wijzigend na akkoord:** recente database-export, Storage inclusief nieuwe mediabucket en relevante secretsmetadata; off-server beveiligde kopie en geïsoleerd herstel controleren. Geen geheimen/raw dumps in Git of chat. Automatische back-upplanning niet aanzetten.
5. **Cloud DEV, wijzigend:** verse baseline opnieuw controleren, exact beoordeelde F2-migraties uitvoeren, post-commit historie/rechten/oude rijen vergelijken. Fout: stop, inspecteer bewijs en huidige toestand; geen blind herhalen. Nooit oude seed of db reset.
6. **BESCSRVDEV, /opt/besc-dev/command-center, wijzigend:** CC-image naar vastgelegde digest bijwerken met F2-stagingvrijgave eerst uit. Bestaande vier uitgeschakelde functies blijven uit, Twitchkoppeling aan; botclients en Caddy-CC-host behouden. Gezondheid en regressie controleren.
7. **BESCSRVDEV, /opt/besc-dev/website, wijzigend:** eigen Composeproject en GHCR websiteimage starten met stagingfunctie uit en deny-all; secrets uitsluitend server-side. Geen tweede Caddy op 80/443. Verbind alleen de website-upstream met een expliciet netwerk voor bestaande Caddy; geen database of algemene socket delen. Test deny-all ook direct op intern netwerk.
8. **one.com, alleen website-dev, wijzigend:** noodzakelijke stagingrecord(s) toevoegen nadat deny-all werkt. **BESCSRVDEV, werkelijke Caddyconfig onder /opt/besc-dev/command-center, wijzigend:** back-up maken, alleen de nieuwe staginghost toevoegen, configuratie valideren, atomisch herladen en CC-host opnieuw testen. Bestaande edge blijft eigenaar van TLS en poorten. DNS/TLS controleren. Geen hoofdsite, www, MX, SPF, DKIM of DMARC veranderen.
9. **CC/Cloud DEV en website, wijzigend:** eigen siteclient aanmaken, concrete testerallowlist activeren, exact benoemde tijdelijke publicatierollen voor Linda; stagingflags gecontroleerd aan. Authredirect alleen staginghost, geen wildcard. Geen productiepublicatie of nieuwe externe accounts.
10. **DEV, wijzigend met synthetische fixtures:** event/nieuws/media en alle releasekritieke proeven; meet intrekking; gecontroleerde terugval en herstel naar geteste image. Elke stap koppelen aan build/digest, schema, audit en bewijslaag. Testrollen beëindigen, publicaties intrekken, veilige eindtoestand teruglezen.
11. **Rapportage:** feitelijk resultaat, beperkingen en open F1/F2-varianten; menselijke eindacceptatie vragen. Geen stilzwijgende productieovergang.

## Terugval en stopvoorwaarden

Bij privévelduitlek, onjuiste toegang, onbetrouwbare intrekking, schema-/gegevensdrift of CC-regressie: stagingvrijgave uit, website toegang dicht; bewijs bewaren. Gewone terugval zet vorige afzonderlijke image(s)/config terug op hetzelfde additieve schema, zonder audit te wissen. Oude images vooraf met digest veiligstellen, niet afhankelijk zijn van mutable dev-tag of opruimbeleid. Website-first terugval waar APIcompatibiliteit dat toestaat; anders website dicht, dan CC terug. Caddy alleen staginghost terugdraaien, bestaande host behouden. DNS-record terug naar vastgelegde vorige toestand; cachevertraging apart verifiëren.

Een schemaherstel met dataverlies, wijziging aan hoofddomein, extra kosten, nieuwe dienst, brede rechten of onopgelost driftverschil valt buiten automatisch handelen en vereist een nieuw concreet besluit. Bij uitval van toegang geen wachtwoorden opvragen in chat; veilige handoff van alleen de geblokkeerde stap. Benoem exact welke uitvoering nog niet bewezen is.
