import {defineField} from 'sanity'
import {baseLanguage} from '../../locale/supportedLanguages'
import {MdGridView} from 'react-icons/md'

export default defineField({
  name: 'gridCardUI',
  title: 'Grid Cards UI',
  type: 'object',
  icon: MdGridView,
  fields: [
    defineField({name: 'title', type: 'localeString', title: 'Titre'}),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            {type: 'pageModulaire'},
            {type: 'product'},
            {type: 'event'},
            {type: 'exhibition'},
          ],
        },
      ],
    }),
    defineField({name: 'cta', type: 'cta', title: 'CTA'}),
  ],
  preview: {
    select: {title: `title.${baseLanguage}`},
    prepare(selection) {
      return {title: selection.title || 'Grid Cards UI', subtitle: 'Grid Cards UI'}
    },
  },
})
