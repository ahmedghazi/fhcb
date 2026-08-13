import {defineField} from 'sanity'

export default defineField({
  name: 'rebondsType',
  title: 'Type de rebonds',
  type: 'reference',
  to: [{type: 'rebond'}],
  group: 'editorial',
})
