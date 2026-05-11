// import {FiImage} from 'react-icons/fi'
import {defineField} from 'sanity'

export default defineField({
  name: 'keyVal',
  title: 'Key Value',
  type: 'object',
  fields: [
    defineField({
      name: 'key',
      type: 'localeString',
      title: 'Key',
    }),
    defineField({
      name: 'val',
      type: 'localeString',
      title: 'Value',
    }),
    defineField({
      name: 'text',
      type: 'localeBlockContent',
      title: 'Text',
      hidden: true,
    }),
  ],
})
