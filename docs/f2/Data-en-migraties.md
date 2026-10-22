# Data, migraties en invarianten

## Bestaande basis

Cloud DEV heeft volgens gecontroleerd F1-uitvoeringsbewijs 123 geregistreerde migraties. De oude seed 20261001110000 blijft uitgesloten. Voor iedere F2-live migratie opnieuw alleenlezend vergelijken: historie, bronhashes, schema, relevante rijtoestanden, rechten en F1-intrekkingen. Een nieuw verschil is geen reden om historie te repareren of blind door te gaan.

F1 heeft immutable publicatiepayloads met revisie/hash en statussen draft, in_review, changes_requested, approved_for_publication, withdrawn. Het heeft een interne preview, geen websitevrijgave. Een goedgekeurde oude snapshot blijft bruikbaar tijdens een nieuw concept; nieuwe inhoud erft geen akkoord. Een nog in beoordeling zijnde snapshot mag na bronwijziging niet worden goedgekeurd. Bronarchivering, intrekking en vervallen noodzakelijke toestemming/mediarechten blokkeren uitlevering.

## Voorgestelde uitbreidingen

| Object | Minimale inhoud en grens |
| --- | --- |
| publication_sites | Organisatiebinding, stabiele site-ID, stagingkanaal, canonieke host, actief-vlag; geen clientkeuze van organisatie |
| publication_site_viewers | Bestaand account, site, gecontroleerde crew/vrijwilligersbinding, toelater, begin/einde, audit; afgeschermd |
| publication_entries | Willekeurige public_id, site/type/locale/slug, exacte geselecteerde F1-revisie, epoch, vrijgavetijd en optioneel eindtijd, ingetrokken toestand |
| publication_release_events | Onveranderlijke vrijgave-/vervang-/intrekkingshistorie met actor, revisie/hash, expected epoch en reden; private IDs blijven intern |
| publication_operation_receipts | Actor + operatie + request-ID + invoerhash; dezelfde request herhalen geeft dezelfde uitkomst, gewijzigde inhoud geeft conflict |
| publication_media | Opaque public_media_id, private derivativepad/byteshash, type/afmetingen, documentrechtbinding, intrekking; geen openbare bucket |

Namen zijn ontwerpkeuzes, nog geen bestaande tabellen. Gebruik samengestelde organisatie-FK's en restrictieve deletes, niet alleen losse UUID-verwijzingen. Unieke slug per site/type/locale; één actuele pointer per entry; geen versienummer uit max()+1 zonder serialisatie. Audit sluit aan op de bestaande F1-aanpak; geen tweede onafhankelijk governance-/toestemmingsregister.

## Rechten en transacties

Alle tabellen RLS, geen anon-grants of directe clientmutaties. Lezer ziet uitsluitend het veilige resultaat na expliciete site-/accountcontrole. Alleen publication_editor bereidt inhoud; publication_reviewer beoordeelt en voert als afzonderlijke bewuste actie de stagingvrijgave/vervanging uit. Beiden mogen binnen hun bestaande intrekkingsbevoegdheid terugtrekken. Een voorzitter of technisch admin zonder deze taakrol krijgt geen omweg. In F2 wordt geen nieuwe formele bevoegdheid of productiepublisherrol afgeleid.

Nieuwe mutaties via een afzonderlijke F2-workflowfunctie met vastgezette search_path, expliciete grants, identiteits-/rolcontrole en inputallowlist. Eerst de bestaande private.f1_lock(), daarna locks op site/entry/revisie in vaste volgorde. Geen oude migratiebestanden herschrijven. Controleer actuele F1-geldigheid plus exact expected revision, payloadhash en entry-epoch binnen de transactie. Replayed vrijgave na intrekking blijft ingetrokken; expliciete herpublicatie vereist nieuwe actuele opdracht. Doorlooptijd van mediareads begrenzen zodat een begonnen stream de intrekkingsgrens niet omzeilt.

Aanmaken concept verandert pointer niet. Review verandert pointer niet. Vrijgave selecteert alleen exact goedgekeurde snapshot; vervanging is atomisch. Een ingeplande revisie is vóór het begin niet uitleverbaar; op eindtijd verdwijnt zij automatisch via de centrale serverklokcontrole. Geen extra Cron of queue voor de eerste tijdvensters. Geen verborgen fallback naar oude snapshot na intrekking van de actuele.

## Migratieslots en uitvoering

M-F2-01: schema, constraints, RLS en grants. M-F2-02: beveiligde workflows en safe readprojecties, raceguards. M-F2-03: beperkte mediatoegang indien een aparte migratie nodig is. Dit zijn planningsslots: tijdens bouwen werkelijke migraties via supabase migration new maken, inhoud reviewen en exacte hashes vastleggen. Geen vooraf verzonnen tijdstempels of claim dat precies drie bestanden nodig zijn.

Eerst volledige opbouw en upgrade van de F1-baseline in geïsoleerde PostgreSQL met hetzelfde hoofdversieniveau; concurrency- en tenanttests. Daarna handmatige DEV-export inclusief Database/Auth-grens, Storage en secretsmetadata, afgeschermde off-server kopie en geïsoleerde herstelproef. Geen back-upbestanden in Git. Exacte goedgekeurde migraties met gevalideerde TLS en gecontroleerde historie uitvoeren; geen db reset, algemene db push, seed of history repair. Bij fout huidige toestand alleenlezend vaststellen voordat herstart überhaupt wordt overwogen.

Voorkeur: additief en compatibel met vorige CC-image. Terugval schakelt vrijgave uit en zet images terug; geen destructieve down-migratie of wissen van audit. Databaserestore alleen als expliciet noodzakelijke herstelactie met bewaakte schrijfstop en afzonderlijk besluit, omdat nieuwe gegevens verloren kunnen gaan.
