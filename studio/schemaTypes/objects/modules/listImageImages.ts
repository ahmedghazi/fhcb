import {defineField} from 'sanity'
import {baseLanguage} from '../../locale/supportedLanguages'
import {MdOutlineImage} from 'react-icons/md'

export default defineField({
  name: 'listImageImages',
  title: 'List Image Images UI',
  type: 'object',
  icon: MdOutlineImage,
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
        {type: 'filterRadio'},
      ],
    }),
    defineField({name: 'cta', type: 'cta', title: 'CTA'}),
  ],
  preview: {
    select: {title: `title.${baseLanguage}`},
    prepare(selection) {
      return {title: selection.title || 'List Image Images UI', subtitle: 'List Image Images UI'}
    },
  },
})
