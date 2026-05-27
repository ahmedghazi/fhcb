# cards

cards document
cards simili document
2 types de cartes, celle qui sont hydratées par un document et celle qui sont hydratées par un des champs propres au component

- # ajouter le liens tickets dans exhibition
- afficher le bouton ticket sur cardExhibition
- feuilltages
- articles
- Une image des images
- # ajouter typologie partenaire (nom, logo, mention (fr/en))
- # sidebar
- # expo/event tags
- # module Embed video
- # current exhibition
- # futur exhibitions
- # programme
- # fix header (img)
- fix header interractions
- header aside
- search scroll
- # search open focus input
- footer
- # card size (props)
- # home mise en avant basé sur la catégorie

  -- # cron qui update les current/past categories
  -- # curl -H "Authorization: Bearer TEST" http://localhost:3000/api/cron/update-exhibition-tags

- updates doc icons
- # image images
- event > feuilletage
- sync shopify
- catalog
- product page

# modules

- listFeuilletage + filtres
- listImageImages + filtres
- listSeriesThematiques + filtres
- home card video mux

# idées

exhibitions status (en coures, passée): mettre en place un cron qui met à jour le status des expositions chaque jours

- home appeler les expos actuelles. Ainsi pas de query post mount

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
