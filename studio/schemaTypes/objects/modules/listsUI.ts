import {defineField} from 'sanity'
import {MdFormatListNumbered} from 'react-icons/md'
import {baseLanguage} from '../../locale/supportedLanguages'

export default defineField({
  name: 'listsUI',
  title: 'Listes UI',
  type: 'object',
  icon: MdFormatListNumbered,
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'localeString',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{type: 'listUI'}],
    }),
    defineField({name: 'cta', type: 'cta', title: 'CTA'}),
  ],
  preview: {
    select: {
      title: `title.${baseLanguage}`,
    },
    prepare({title}) {
      return {title: title, subtitle: 'Listes UI'}
    },
  },
})
