import {defineField} from 'sanity'
import {MdFormatListBulleted} from 'react-icons/md'

export default defineField({
  name: 'listUI',
  title: 'Liste UI',
  type: 'object',
  icon: MdFormatListBulleted,
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{type: 'listItem'}],
    }),
    defineField({name: 'cta', type: 'cta', title: 'CTA'}),
  ],
  preview: {
    prepare() {
      return {title: 'Liste UI', subtitle: 'Liste UI'}
    },
  },
})
