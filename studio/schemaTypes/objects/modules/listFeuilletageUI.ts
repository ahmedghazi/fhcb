import {defineField} from 'sanity'
import {baseLanguage} from '../../locale/supportedLanguages'
import {FiBookOpen} from 'react-icons/fi'

export default defineField({
  name: 'listFeuilletageUI',
  title: 'List Feuilletage UI',
  type: 'object',
  icon: FiBookOpen,
  fields: [
    defineField({name: 'title', type: 'localeString', title: 'Titre'}),
    defineField({
      name: 'filters',
      title: 'Filtres',
      type: 'array',
      of: [{type: 'filterSort'}, {type: 'filterSearch'}, {type: 'filterRadio'}],
    }),
    defineField({name: 'cta', type: 'cta', title: 'CTA'}),
  ],
  preview: {
    select: {title: `title.${baseLanguage}`},
    prepare(selection) {
      return {title: selection.title || 'List Feuilletage UI', subtitle: 'List Feuilletage UI'}
    },
  },
})
