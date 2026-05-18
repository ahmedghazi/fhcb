import {defineField} from 'sanity'
import {baseLanguage} from '../locale/supportedLanguages'
// import { BsInfoSquare } from 'react-icons/bs'

export default defineField({
  name: 'keyValGroup',
  title: 'List Titre + Texte',
  type: 'object',
  // icon: BsInfoSquare,
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'localeString',
    }),
    defineField({
      name: 'items',
      title: 'Partenaires',
      type: 'array',
      of: [{type: 'keyVal'}, {type: 'reference', to: [{type: 'partenaire'}]}],
    }),
  ],
  preview: {
    select: {
      title: `title.${baseLanguage}`,
    },
  },
})
