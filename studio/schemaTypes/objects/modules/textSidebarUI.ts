import {defineField} from 'sanity'
import {FiColumns} from 'react-icons/fi'

export default defineField({
  name: 'textSidebarUI',
  title: 'Texte + Sidebar UI',
  type: 'object',
  icon: FiColumns,
  fields: [
    defineField({name: 'text', type: 'localeBlockContent', title: 'Texte principal'}),
    defineField({
      name: 'sidebar',
      title: 'Sidebar',
      type: 'array',
      of: [{type: 'localeBlockContent'}],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Texte + Sidebar UI', subtitle: 'Texte + Sidebar UI'}
    },
  },
})
