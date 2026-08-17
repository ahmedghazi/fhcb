All edits done and verified. Here are the URLs, one per doc type:

Fixes (recurrence of the "too many artists" bug):

Product — http://localhost:3000/publications/henri-cartier-bresson-images-a-la-sauvette-nouvelle-edition (and the other 3 HCB products sharing the same rebond doc: henri-cartier-bresson-les-europeens-nouvelle-edition, susan-meiselas-nicaragua, lettres-d-amour-a-la-photographie-daido-moriyama) — swapped artist-related → artist on their shared rebond, same fix as before.
New scenario use cases added:

Exhibition — http://localhost:3000/exhibition/les-europeens — added a second rebondsAuto entry with exhibition-discover-past (Block 2, "À découvrir aussi").
PageModulaire — http://localhost:3000/missions — added a second rebondsAuto entry with exhibition-discover-current-or-futur (Block 2, "À découvrir en ce moment"). Its existing Block 1 entry (exhibition-current/exhibition-futur) also now benefits from the in-site-only fix from earlier.
Already had working use cases from the migration (no edit needed, checked clean):

Artist — http://localhost:3000/artist/marjaana-kella (Block 1 via rebondsAuto; Block 2 automatic via getRandomArtists, no CMS config needed)
Event — http://localhost:3000/event/nicaragua-regards-sur-une-revolution (verified: not affected by the artist-related bug — Susan Meiselas doesn't have HCB's dense cross-references)
No use case possible:

Library — http://localhost:3000/librairie is a static listing page with no rebondsAuto/rebonds mechanism at all — nothing to attach or demonstrate here without building a new feature first.

Block 1 — Contenu lié (Overall 81%)

Exhibition > 75%
Event > 85%
Artist > 70%
Product > 75%
PageModulaire (incl. Prix) > 80%
Library > N/A (no mechanism)

Block 2 — À découvrir aussi (Overall ~86%)

Exhibition > 100% (done, live on les-europeens)
Event > N/A (no spec row)
Artist > 80%
Product > 65%
PageModulaire > 100% (done, live on missions)
Library > N/A

Overall ≈ 81% (Block 1 avg ~77% across 5 applicable types, Block 2 avg ~86% across 4 applicable types — Library excluded from both, Event excluded from Block 2 since the spec has no row for it).
