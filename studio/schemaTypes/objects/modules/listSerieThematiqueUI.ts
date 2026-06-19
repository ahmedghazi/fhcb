import {defineField} from 'sanity'
import {baseLanguage} from '../../locale/supportedLanguages'
import {TbArticle} from 'react-icons/tb'

export default defineField({
  name: 'listSerieThematiqueUI',
  title: 'List Série Thématique UI',
  type: 'object',
  icon: TbArticle,
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
        title: selection.title || 'List Série Thématique UI',
        subtitle: 'List Série Thématique UI',
      }
    },
  },
})
