import {defineArrayMember, defineField} from 'sanity'
import {BsCircle} from 'react-icons/bs'

export default {
  name: 'filterRadio',
  title: 'Filtre — Radio',
  type: 'object',
  icon: BsCircle,
  fields: [
    defineField({
      name: 'radioKey',
      title: 'Type de filtre',
      type: 'string',
      options: {
        list: [
          {title: 'Artiste', value: 'artist'},
          {title: 'Tag', value: 'tag'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'radioLabel',
      title: 'Label du groupe (optionnel)',
      type: 'localeString',
    }),
    defineField({
      name: 'radioOptions',
      title: 'Options',
      type: 'array',
      description: 'Sélectionnez les artistes ou tags à proposer en filtre',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'artist'}, {type: 'tag'}],
        }),
      ],
      validation: (Rule) => Rule.min(1).error('Ajoutez au moins une option'),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Filtre — Radio', subtitle: '⚪'}
    },
  },
}
