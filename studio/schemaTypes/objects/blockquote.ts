import {defineField} from 'sanity'
import {TbBlockquote} from 'react-icons/tb'

export default defineField({
  name: 'blockquote',
  title: 'Citation',
  type: 'object',
  icon: TbBlockquote,
  preview: {
    select: {
      title: `text`,
      subtitle: `author`,
    },
  },
  fields: [
    defineField({
      name: 'text',
      type: 'text',
      title: 'Texte',
    }),
    defineField({
      name: 'author',
      title: 'Auteur',
      type: 'string',
    }),
  ],
})
