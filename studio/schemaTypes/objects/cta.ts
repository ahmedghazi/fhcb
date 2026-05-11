import {RxButton} from 'react-icons/rx'
import {defineField} from 'sanity'

export default defineField({
  name: 'cta',
  title: 'Cta',
  type: 'object',
  icon: RxButton,

  fields: [
    defineField({
      name: 'internal',
      type: 'linkInternal',
    }),
    defineField({
      name: 'external',
      type: 'linkExternal',
    }),
  ],
})
