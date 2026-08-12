import {StackCompactIcon} from '@sanity/icons'
import pluralize from 'pluralize-esm'
import {BsLayoutSidebarInset} from 'react-icons/bs'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'sidebarGenerique',
  title: 'Sidebar (Générique)',
  type: 'object',
  icon: BsLayoutSidebarInset,
  fields: [
    // Groups
    defineField({
      name: 'commissariat',
      title: 'Commissariat',
      type: 'array',
      of: [{type: 'keyVal'}],
    }),
    defineField({
      name: 'coProduction',
      title: 'CO-production',
      type: 'array',
      of: [{type: 'keyVal'}, {type: 'reference', to: [{type: 'partenaire'}]}],
    }),
    defineField({
      name: 'partenaires',
      title: 'Mécénat',
      type: 'array',
      of: [{type: 'keyVal'}, {title: 'Mécène', type: 'reference', to: [{type: 'partenaire'}]}],
    }),
    defineField({
      name: 'partenairesMedia',
      title: 'Partenaire media',
      type: 'array',
      of: [{type: 'keyVal'}, {title: 'Mécène', type: 'reference', to: [{type: 'partenaire'}]}],
    }),
    defineField({
      name: 'products',
      title: 'Produits',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'product'}]}],
    }),
    defineField({
      name: 'keyVal',
      title: 'Titre + Texte libre',
      description: 'Libre',
      type: 'array',
      of: [{type: 'keyVal'}],
    }),
  ],
  preview: {
    select: {
      items: 'items',
    },
    prepare({items = []}) {
      return {
        subtitle: 'Sidebar (Générique)',
        title: items.length > 0 ? pluralize('group', items.length, true) : 'Pas de groupes',
        media: StackCompactIcon,
      }
    },
  },
})
