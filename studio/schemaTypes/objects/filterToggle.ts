import {defineField} from 'sanity'
import {BsCheckSquare} from 'react-icons/bs'

export default {
  name: 'filterToggle',
  title: 'Filtre — Checkbox simple',
  type: 'object',
  icon: BsCheckSquare,
  fields: [
    defineField({
      name: 'filterKey',
      title: 'Type de filtre',
      type: 'string',
      options: {
        list: [{title: 'En stock', value: 'inStock'}],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'filterLabel',
      title: 'Label',
      type: 'localeString',
    }),
  ],
  preview: {
    select: {filterKey: 'filterKey'},
    prepare({filterKey}: any) {
      return {title: `Filtre — ${filterKey || '?'} ☑`, subtitle: 'Checkbox simple'}
    },
  },
}
