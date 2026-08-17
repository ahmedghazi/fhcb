import {defineField} from 'sanity'

import {ImPageBreak} from 'react-icons/im'
export default defineField({
  name: 'hrUI',
  title: 'Ligne séparatrice UI',
  type: 'object',
  icon: ImPageBreak,
  fields: [defineField({name: 'title', type: 'string', title: 'Titre'})],
  preview: {
    prepare() {
      return {title: 'Ligne séparatrice UI', subtitle: 'Ligne séparatrice UI'}
    },
  },
})
