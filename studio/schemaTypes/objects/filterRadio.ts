import {defineArrayMember, defineField} from 'sanity'
import {BsUiRadios} from 'react-icons/bs'

export default {
  name: 'filterRadio',
  title: 'Filtre — 2 options radio',
  type: 'object',
  icon: BsUiRadios,
  fields: [
    defineField({
      name: 'radioKey',
      title: 'Type de filtre',
      type: 'string',
      options: {
        list: [
          {title: 'Artiste', value: 'artist'},
          {title: 'Tag', value: 'tag'},
          {title: 'Chercheur', value: 'chercheur'},
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
      title: '2 options',
      type: 'array',
      description: 'Sélectionnez exactement 2 items à proposer comme boutons radio.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'artist'}, {type: 'tag'}, {type: 'chercheur'}],
        }),
      ],
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value || (value as unknown[]).length !== 2) {
            return 'Sélectionnez exactement 2 options.'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {radioKey: 'radioKey'},
    prepare({radioKey}: any) {
      return {title: `Filtre — ${radioKey || '?'} ◉`, subtitle: '2 choix radio'}
    },
  },
}
