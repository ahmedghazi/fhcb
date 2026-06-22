import {defineField} from 'sanity'
import {baseLanguage} from '../../locale/supportedLanguages'
import {FiBookOpen} from 'react-icons/fi'

export default defineField({
  name: 'listProductUI',
  title: 'List Product UI',
  type: 'object',
  icon: FiBookOpen,
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
        {type: 'filterToggle'},
      ],
    }),
    defineField({name: 'cta', type: 'cta', title: 'CTA'}),
  ],
  preview: {
    select: {title: `title.${baseLanguage}`},
    prepare(selection) {
      return {title: selection.title || 'List Product UI', subtitle: 'List Product UI'}
    },
  },
})
