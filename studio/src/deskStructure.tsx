// import {BiDockTop, BiDockBottom} from 'react-icons/bi'
// import {ControlsIcon} from '@sanity/icons'

import {ListItemBuilder} from 'sanity/structure'

// If you add document types to desk structure manually, you can add them to this function to prevent duplicates in the root pane
const hiddenDocTypes = (listItem: ListItemBuilder) => {
  const id = listItem.getId()

  if (!id) {
    return false
  }

  return ![
    'article',
    'partenaire',
    'artist',
    'programme',
    'pageModulaire',
    'exhibition',
    'location',
    'event',
    'product',
    'home',
    'library',
    'tag',
    'settings',
    'imageImages',
    'feuilletage',
    'serie',
    'media.tag',
    'mux.videoAsset',
  ].includes(id)
}

export const structure = (S: any) =>
  S.list()
    .title('Base')
    .items([
      S.listItem()
        .title('Réglages (header, footer, ...)')
        .schemaType('settings')
        .child(
          S.editor()
            .title('Réglages (header, footer, ...)')
            .schemaType('settings')
            .documentId('settings'),
        ),
      S.divider(),

      S.listItem().title("Page d'accueil").schemaType('home').child(
        S.editor()
          // .title('Réglages (header, footer, ...)')
          .schemaType('home')
          .documentId('home'),
      ),

      S.listItem()
        .title('Pages')
        .schemaType('pageModulaire')
        .child(S.documentTypeList('pageModulaire')),
      // S.listItem().title('Tags').schemaType('tag').child(S.documentTypeList('tag')),

      S.divider(),

      S.listItem().title('Artistes').schemaType('artist').child(S.documentTypeList('artist')),
      S.divider(),

      S.listItem()
        .title('Programme')
        .schemaType('programme')
        .child(S.documentTypeList('programme')),

      S.listItem()
        .title('Expostions')
        .schemaType('exhibition')
        .child(S.documentTypeList('exhibition')),
      S.listItem().title('Lieux').schemaType('location').child(S.documentTypeList('location')),
      S.divider(),

      S.listItem().title('Événements').schemaType('event').child(S.documentTypeList('event')),

      S.divider(),

      S.listItem()
        .title('Librairie')
        .schemaType('library')
        .child(S.editor().title('Librairie').schemaType('library').documentId('library')),

      S.listItem().title('Produits').schemaType('product').child(S.documentTypeList('product')),
      S.divider(),

      S.listItem().title('Articles').schemaType('article').child(S.documentTypeList('article')),
      S.divider(),
      S.listItem()
        .title('Une images des Images')
        .schemaType('imageImages')
        .child(S.documentTypeList('imageImages')),
      S.listItem()
        .title('feuilletage')
        .schemaType('feuilletage')
        .child(S.documentTypeList('feuilletage')),
      // S.listItem().title('Série Thématique').schemaType('serie').child(S.documentTypeList('serie')),

      S.divider(),

      S.listItem()
        .title('Partenaires')
        .schemaType('partenaire')
        .child(S.documentTypeList('partenaire')),
      S.divider(),

      S.listItem().title('Tags').schemaType('tag').child(S.documentTypeList('tag')),
      S.divider(),

      // We also need to remove the new singletons from the main list
      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ])
