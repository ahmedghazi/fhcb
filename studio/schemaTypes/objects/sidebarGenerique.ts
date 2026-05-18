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
      title: 'MÉCÉNAT',
      type: 'array',
      of: [{type: 'keyVal'}, {type: 'reference', to: [{type: 'partenaire'}]}],
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
