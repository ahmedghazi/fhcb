import {defineField} from 'sanity'
import {baseLanguage} from '../../locale/supportedLanguages'
import {BsCalendar3} from 'react-icons/bs'

export default defineField({
  name: 'programmeUI',
  title: 'Programme UI',
  type: 'object',
  icon: BsCalendar3,
  fields: [
    defineField({name: 'title', type: 'localeString', title: 'Titre'}),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'exhibition'}, {type: 'event'}],
        },
      ],
    }),
  ],
  preview: {
    select: {title: `title.${baseLanguage}`},
    prepare(selection) {
      return {title: selection.title || 'Programme UI', subtitle: 'Programme UI'}
    },
  },
})
