import {defineField} from 'sanity'

// An ordered list of `rebond` documents, each rendered as its own auto-generated
// related-content block on the host document's page (e.g. rebondsAuto[0] = "Contenu
// lié", rebondsAuto[1] = "À découvrir aussi", ...). Array rather than fixed named
// slots so a page can have as many (or as few) auto blocks as it needs.
export default defineField({
  name: 'rebondsAuto',
  title: 'Rebonds automatiques',
  description: 'Un ou plusieurs blocs de rebonds générés automatiquement, dans cet ordre',
  type: 'array',
  of: [{type: 'reference', to: [{type: 'rebond'}]}],
  group: 'editorial',
})
