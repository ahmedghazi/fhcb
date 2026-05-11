Documents Index

- pageModulaire
- expostion
- evenement
- product
- article

# global

- settings
- - bandeau contextuel
- - - text: localeString
- - - link: linkInternal/linkExternal
- - - dateExpiration: date

# documents/pageModulaire

- seo: seo
- title: localeString
- slug: slug
- imageCover: image
- tags[tag]
- modules: array of modules
- rebonds: array of pages, events, expos, products

# documents/exhibition (Exposition)

- seo: seo
- title: localeString
- slug: slug
- artists: artist
- imageClef: image
- dates: [du / au]
- tags[tag]
- modules: array of modules
- rebonds: array of pages, events, expos, products

# documents/event (événement)

- seo: seo
- title: localeString
- slug: slug
- artists: artist
- imageClef: image
- dates: [du / au]
- tags[tag]
- modules: array of modules
- rebonds: array of pages, events, expos, products

‌

# documents/librairie

- seo: seo
- title: localeString
- slug: slug
- mise en avant: [product]
- sliderSelection: [product]
- items: [product]

# documents/product

- seo: seo
- title: string
- slug: slug
- artist: artist
- editeir: string
- tags[tag]
- imageCover: image
- images: [image]
- text: localeBlockContent
- metadata: [keyVal]
- langue: string
- artist: #artist
- prix: string
- qty: number
- rebonds: array of pages, events, expos, products

# documents/artiste

- name: string

## objects/blockContent

- chapo
- quotation

## objects/modules

- listsUI
- - items: [list]
- - cta
- listUI
- - items: listItem
- - cta
- listItem:
  - title: localeString
  - content: localeString
  - link: linkInternal/linkExternal
- imageTextUI:
  - image: image
  - text: localeString
  - direction
- imagesUI: one or many
  - items: array of images(with caption)
- textUI:
  - text: localeBlockContent
- textSidebardUI:
  - text: localeBlockContent
  - sidebar:
  - - items: [localeBlockContent]
- sliderCardUI:
  - title: localeString
  - items: array of cards
  - card: Page,Product,Event,Expo
  - cta
- gridCardUI:
  - title: localeString
  - items: array of cards
  - card: Page,Product,Event,Expo
  - cta
- videoUI:
  - video: url
  - caption: localeString
- programmeUI:
  - title: localeString
  - items: [expostion, event]
