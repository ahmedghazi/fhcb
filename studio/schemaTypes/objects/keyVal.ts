// import {FiImage} from 'react-icons/fi'
import {defineField} from 'sanity'
import {baseLanguage} from '../locale/supportedLanguages'
import {FaListOl} from 'react-icons/fa'

export default defineField({
  name: 'keyVal',
  title: 'Image + Titre + Texte',
  type: 'object',
  icon: FaListOl,
  fields: [
    defineField({
      name: 'title',
      type: 'localeString',
      title: 'Titre',
    }),
    defineField({
      name: 'image',
      type: 'image',
    }),
    defineField({
      name: 'text',
      type: 'localeText',
      title: 'Texte',
    }),

    // defineField({
    //   name: 'text',
    //   type: 'localeBlockContent',
    //   title: 'Text',
    //   hidden: true,
    // }),
  ],
  preview: {
    select: {
      title: `title.${baseLanguage}`,
      subtitle: `text.${baseLanguage}`,
      media: 'image',
    },
  },
})
