import {BsInfoSquare} from 'react-icons/bs'
import {defineField} from 'sanity'

export default defineField({
  name: 'messageContextuel',
  title: 'Message Contextuel',
  type: 'object',
  icon: BsInfoSquare,

  fields: [
    defineField({
      type: 'boolean',
      name: 'display',
      title: 'visible',
    }),
    defineField({
      type: 'date',
      name: 'date',
      title: 'Expire',
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'localeText',
    }),
    defineField({
      name: 'cta',
      type: 'cta',
    }),
  ],
})
