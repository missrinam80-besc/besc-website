# F2-uitvoering — 22 oktober 2026

Linda heeft volledige F2-uitvoering goedgekeurd, inclusief het voorbereidingspakket in deze private websiterepository. Zij voert de serverstappen zelf uit in Termius. Het oorspronkelijke voorbereidingspakket is de scopebasis; de status hieronder is actueler dan de historische tekst “voorbereid/niet goedgekeurd”.

## Gebouwd en geïsoleerd gecontroleerd

Afzonderlijke Next.js-website met BESC-huisstijl, zelfgehoste OFL-fonts, licht/donker, login voor bestaande accounts, home, events/nieuws, detailweergave, minimale health en noindex. De website gebruikt Supabase uitsluitend voor Auth; bedrijfsinhoud en media gaan via de beperkte CC-API. Er zijn geen database-, service_role- of botcredentials in de website. De scripts krijgen per aanvraag een CSP-nonce. Cookies zijn hostgebonden en httpOnly; aanmeldlinks maken geen nieuwe accounts aan. Er is geen echte aanmeldmail door deze bouwproeven verstuurd.

Tien consumentencontracttests, TypeScript en productiebuild slagen. Vier echte standalone-browserproeven met fictieve Auth-/CC-upstreams slagen: anonimiteit, toegelaten lezer op meerdere schermmaten, donkere weergave met axe, intrekking en veilige uitval. De definitieve synthetische intrekking is gemeten op 20.903 ms, binnen de voorgestelde 60 seconden. Een tijdelijke fixture-schrijfwedstrijd is hersteld door atomische statebestanden; de meting is daarna opnieuw zonder die fout uitgevoerd. Dit is geen live Cloud-Auth- of proxyacceptatie.

De afzonderlijke container is lokaal gebouwd en gestart als niet-root met alleenleesbaar bestandssysteem. Zonder stagingconfiguratie worden geen publicaties getoond; de healthresponse is minimaal. Deze containerproef ging vooraf aan de laatste CSP-wijziging; de definitieve container wordt opnieuw door CI gebouwd en getest. Er is geen serverdeploy verricht.

Het CC-onderdeel staat afzonderlijk in PR114: beveiligde vrijgavebediening/API, exacte revisies, tijdvenster, intrekking, eindige testerbinding, private media en audit. Lokale CC-regressie en native PostgreSQL 17.11-/raceproeven slagen; CI-controles en release zijn afzonderlijk te volgen. Het eerdere F1-schema wordt nog steeds als tussenstand gecontroleerd.

## Live poorten die nog openstaan

Alle 69 acceptatiegevallen blijven als oorspronkelijke proefdefinities beschikbaar. Dit verslag vervangt geen per-geval live bewijs. Voor F2.7 ontbreken nog: de actuele Termius-voorcontrole, volledige verse cloudcatalogusvergelijking, handmatige nieuwe back-up/off-server kopie/herstelproef, exacte goedgekeurde migratie, afzonderlijke serverimages, one.com-staging-DNS, actuele Caddy/TLS-controle, concrete crew-/vrijwilligersaccountbinding, live event- én nieuwsketen, media-/toestemmingsintrekking en gecontroleerde serverrollback. De basiscontrole in het Supabase-dashboard bevestigde alleenlezend historie123, oude seed uitgesloten, F2 nog niet toegepast en auth.sessions aanwezig.

De bestaande publieke website blijft staan. Geen F2-live activering, botdeploy, saldo-overname of automatische beloningen is uitgevoerd. F1-open varianten blijven afzonderlijk herkenbaar. F2 wordt pas volledig aanvaard na de resterende live proeven en menselijke eindacceptatie.
