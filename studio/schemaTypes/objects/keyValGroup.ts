import {defineField} from 'sanity'
// import { BsInfoSquare } from 'react-icons/bs'

export default defineField({
  name: 'keyValGroup',
  title: 'Key Val Group',
  type: 'object',
  // icon: BsInfoSquare,
  fields: [
    defineField({
      name: 'title',
      type: 'localeString',
    }),
    defineField({
      name: 'items',
      type: 'array',
      of: [{type: 'keyVal'}],
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
    },
  },
})
