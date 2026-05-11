import {defineField} from 'sanity'

export default defineField({
  name: 'image',
  title: 'Image',
  type: 'image',
  fields: [
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  group: 'editorial',
})
