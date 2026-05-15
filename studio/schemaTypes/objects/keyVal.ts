// import {FiImage} from 'react-icons/fi'
import {defineField} from 'sanity'
import {baseLanguage} from '../locale/supportedLanguages'

export default defineField({
  name: 'keyVal',
  title: 'Key Value',
  type: 'object',
  fields: [
    defineField({
      name: 'key',
      type: 'localeString',
      title: 'Titre',
    }),
    defineField({
      name: 'val',
      type: 'localeText',
      title: 'Text',
    }),
    defineField({
      name: 'text',
      type: 'localeBlockContent',
      title: 'Text',
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: `key.${baseLanguage}`,
      subtitle: `val.${baseLanguage}`,
    },
  },
})
