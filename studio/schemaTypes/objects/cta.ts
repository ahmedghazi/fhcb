import {RxButton} from 'react-icons/rx'
import {defineField} from 'sanity'

export default defineField({
  name: 'cta',
  title: 'Cta',
  type: 'object',
  icon: RxButton,

  fields: [
    defineField({
      title: 'Lien interne',
      name: 'internal',
      type: 'linkInternal',
    }),
    defineField({
      title: 'Lien interne',
      name: 'external',
      type: 'linkExternal',
    }),
  ],
})
