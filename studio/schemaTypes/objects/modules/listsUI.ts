import {defineField} from 'sanity'
import {MdFormatListNumbered} from 'react-icons/md'

export default defineField({
  name: 'listsUI',
  title: 'Listes UI',
  type: 'object',
  icon: MdFormatListNumbered,
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{type: 'listUI'}],
    }),
    defineField({name: 'cta', type: 'cta', title: 'CTA'}),
  ],
  preview: {
    prepare() {
      return {title: 'Listes UI', subtitle: 'Listes UI'}
    },
  },
})
