import {defineField} from 'sanity'
import {baseLanguage} from '../../locale/supportedLanguages'
import {TbMessageCircle} from 'react-icons/tb'

export default defineField({
  name: 'listConversationUI',
  title: 'List Conversation UI',
  type: 'object',
  icon: TbMessageCircle,
  fields: [
    defineField({name: 'title', type: 'localeString', title: 'Titre'}),

    defineField({
      name: 'filters',
      title: 'Filtres',
      type: 'array',
      of: [
        {type: 'filterSort'},
        {type: 'filterSearch'},
        {type: 'filterList'},
        {type: 'filterCheckbox'},
      ],
    }),
    defineField({name: 'cta', type: 'cta', title: 'CTA'}),
  ],
  preview: {
    select: {title: `title.${baseLanguage}`},
    prepare(selection) {
      return {
        title: selection.title || 'List Conversation UI',
        subtitle: 'List Conversation UI',
      }
    },
  },
})
