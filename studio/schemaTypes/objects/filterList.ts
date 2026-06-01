import {defineArrayMember, defineField} from 'sanity'
import {BsList} from 'react-icons/bs'

export default {
  name: 'filterList',
  title: 'Filtre — Liste',
  type: 'object',
  icon: BsList,
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
      description:
        'Sélectionnez les artistes ou tags à proposer. ≤ 2 options → boutons radio, > 2 options → liste A–Z.',
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
      return {title: 'Filtre — Liste', subtitle: '≡'}
    },
  },
}
