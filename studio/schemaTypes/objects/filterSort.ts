import {defineArrayMember, defineField} from 'sanity'
import {BsSortAlphaDown} from 'react-icons/bs'

export default {
  name: 'filterSort',
  title: 'Filtre — Tri',
  type: 'object',
  icon: BsSortAlphaDown,
  fields: [
    defineField({
      name: 'sortOptions',
      title: 'Options de tri',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'field',
              title: 'Champ',
              type: 'string',
              options: {
                list: [
                  // {title: 'Numéro (index)', value: 'index'},
                  {title: 'Titre', value: 'title'},
                  {title: 'Date de parution', value: 'publicationDate'},
                  {title: 'Date de début', value: 'dateStart'},
                  {title: 'Date de création', value: '_createdAt'},
                  // {title: 'Intervenant', value: 'speaker'},
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'direction',
              title: 'Direction',
              type: 'string',
              options: {
                list: [
                  {title: '↑ Croissant', value: 'asc'},
                  {title: '↓ Décroissant', value: 'desc'},
                ],
                layout: 'radio',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label affiché',
              type: 'localeString',
            }),
          ],
          preview: {
            select: {label: 'label.fr', field: 'field', direction: 'direction'},
            prepare({label, field, direction}: any) {
              const dir = direction === 'asc' ? '↑' : '↓'
              return {title: label || `${field} ${dir}`}
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Filtre — Tri', subtitle: '🔀'}
    },
  },
}
