# cards

cards document
cards simili document
2 types de cartes, celle qui sont hydratées par un document et celle qui sont hydratées par un des champs propres au component

- # ajouter le liens tickets dans exhibition
- # afficher le bouton ticket sur cardExhibition
- # feuilltages
- # articles
- # Une image des images
- # ajouter typologie partenaire (nom, logo, mention (fr/en))
- # sidebar
- # expo/event tags
- # module Embed video
- # current exhibition
- # futur exhibitions
- # programme
- # fix header (img)
- fix header interractions
- # header aside
- # message contexturel avec auto kill
- message contexturel avec auto kill
- # search scroll
- # search open focus input
- # footer
- # card size (props)
- # home mise en avant basé sur la catégorie
- # filtres
- # current expo = same tag as hors les murs
- # prev exhib
- # filtes prev exhib
- page programme expo/event vide => afficher un message
- # créer les cards rebonds page
- # grid masonry
- # pb expo en cours dans https://fhcb-preprod.vercel.app/histoire-and-missions
- # slider card ajouter les doc manquant (image images, feuilletage, ...)
- # add doc chercheur (name, slug), présent dans feuilletages, image Images, et dans leurs page listes -> filtres
- # slider card même hauteur
- # filtre list (cherche automatique tous les artistes ou tag ou chercheur)
- # filtre radio
- # rebonds page racine > rebonds page
- # rebonds artiste > autres artistes (aléatoire)
- # rebonds branche = imageImages, série, ... sinon fond blanc
- # cron qui update les current/past categories
- # image images
- # feuilletage
- # single page feuilletage
- updates doc icons
- # wide reg
- # grid centered
- # rebonds article > rebonds article (même catégorie)
- # expo itinérante = inside et outside, n'apparait que dans expo passée, pas visible dans les filtres
- # expo hors les murs via le champ location
- # régler grille cartes (tailles)
- # carte expo tube, cube (check trello)
- # pastilles
- # branch hover
- # card avec 2nd btn hover (exhib, events) qui si pas past
- # date avec location
- # btn hover, all hover
- # fix search result
- # page event (comme exhib)
- # page expo hero temporalité des ui. (bouton resa)
- # card product si hors de la page librairie, affiche le tag "Livre"
- # série thématique doc sanity comme imageImages
- # forms de contact
- # search au click
- # module Ressources affiche les dernières ressources avec carte branches ressources (video auto play ) + hover
- # single event related
- cron in preprod
- add remaining cta in modules
- ne pas hardcoder les tags (branches-ressources, visite, ...). Les mettre dans global
- # nav avec logo dans le même ul
- grille rebonds branche
- # nav image(s) + aside
- # filter checkbox
- # filters shop
- # filter search x
- # module blockquote
- # slider slick
- # typo de sous menu
- # seuil de changement de grille, container fuild max width 1300px
- # component blockqote
- # champs ressource label, liste de choix
- contexte des cards (expos en cours, affiche la coulmeur + bouton), ...
- rebonds page expo, ordre
- autour de l'expo
- couple titre sous titre > 450 / 200
- # bandeau contextuel
- # pastilles expo
- # pastilles event
- page 404
- mobile font sizes
- module carte videos
- # videoCover sur les pages ressources
- # page ressources ajouter un sliderArtiste (ressources + articles)
- # module ressources doit afficher 1 / type, pas toutes les ressources.
- # add redirect from artist/hcb > /hcb, artist/mf > /mf
- filters mobile
- # compteur ressources sur les cartes branches ressource
- # rebonds expos (by tag)
- autour de l'expo vie la backoffice

## card expos

- # expo passée: itinérante, hors les murs
- # cards avec plusieurs dates (effet si card sm)
  # Si l’expo est au cube (espace principal) = carte verticale (même si image paysage)
  # Si l’expo est au tube (espace secondaire) = carte horizontale (même si image portrait)
- en cours et offSite = hors les murs + itinérante (page expos hors les murs => lg)

## Grilles

<!-- - feuilletage 1/6
- product 2/12
- expo 2/12, dans rebonds 6/12, dans programme current, hors-les-murs 12/12
- artiste 6/12, dans rebonds 2/12
- evt 2/12
- page 4/12
- branche 2/12
- ressources (feuilletage, ...) 6/12 -->

## shopify

- # sync shopify
- # catalog
- # filters shop
- # product page
- cart

## shopify

- ajouter des metas fields
- - langues, description, date de paruation, fiche technique (générique), artiste
    custom.isbn
    custom.fiche_technique
    custom.editeur
    custom.auteurs
    custom.date_de_publication
    custom.languages

# modules

- # listFeuilletage + filtres
- # listImageImages + filtres
- # listSeriesThematiques + filtres
- home card video mux
- # newsletter
- # soutenir

# idées

# exhibitions status (en coures, passée): mettre en place un cron qui met à jour le status des expositions chaque jours

- # home appeler les expos actuelles. Ainsi pas de query post mount

# questions

- programme = diff entre programme expo et programme evts
- # - PROGRAMME AUTO GÉNÉRÉ PAR TYPE
- # home: as-t-on toujours cette ordre?
- - # modules spécifique home mais qui se génèrent tout seul
- # card size, quels contexte font que la card soit en grand ou en petit?
- # diff entre card expo avec et sans fond perdu (expo en cours?)
- diff entre evt et visite commentées (est-ce un doc propre ou un type d'evt)
- cta dans les cards. Soit le texte est présent dans le doc source, soit dans un champs qui permet de convoquer les cartes. Mais pour avoir une cohérence, il faudrait que ce soit toujours le même champs qui soit utilisé. La card expo par ex est appelé à divers endroits.
- # images (légendes, credits) localizable mais pas dans la mediatheque, ou alors on crée une mediatheque tampon
- # filtre lieu dans précédente expo?
- # filtre intervenant dans feuilletages?
- # triez par ?
- # les rebonds, quels noms? ex séries thématique
- # me manque la wide regular
- # carte look 3 2 colonnes (taille de grille 4/8)?
- # card video, d'où viennent elles (page)
- pb ordre éléments entre desktop et mobile. Ex hero exhibition, card newsletter, ...

# réponses

# GO PREPROD

batch sync products

add env CRON_SECRET=test
Check cron job
curl -H "Authorization: Bearer TEST" http://localhost:3000/api/cron/update-exhibition-tags
