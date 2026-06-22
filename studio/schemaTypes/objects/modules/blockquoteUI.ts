import {defineField} from 'sanity'
import {TbBlockquote} from 'react-icons/tb'
import {baseLanguage} from '../../locale/supportedLanguages'

export default defineField({
  name: 'blockquoteUI',
  title: 'Citation UI',
  type: 'object',
  icon: TbBlockquote,
  preview: {
    select: {
      title: `text.${baseLanguage}`,
      subtitle: `author.${baseLanguage}`,
    },
  },
  fields: [
    defineField({
      name: 'text',
      type: 'localeText',
      title: 'Texte',
    }),
    defineField({
      name: 'author',
      title: 'Auteur',
      type: 'string',
    }),
  ],
})
