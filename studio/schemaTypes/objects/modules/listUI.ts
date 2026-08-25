import {defineField} from 'sanity'
import {MdFormatListBulleted} from 'react-icons/md'
import {baseLanguage} from '../../locale/supportedLanguages'

export default defineField({
  name: 'listUI',
  title: 'Liste UI',
  type: 'object',
  icon: MdFormatListBulleted,
  fields: [
    defineField({
      name: 'titleh2',
      title: 'titre de section',
      type: 'localeString',
    }),
    defineField({
      name: 'title',
      description: 'Titre de liste',
      type: 'localeString',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{type: 'listItem'}],
    }),
    defineField({name: 'cta', type: 'cta', title: 'CTA'}),
  ],
  preview: {
    select: {
      title: `title.${baseLanguage}`,
    },
    prepare({title}) {
      return {title: title || 'Liste UI', subtitle: 'Liste UI'}
    },
  },
})
