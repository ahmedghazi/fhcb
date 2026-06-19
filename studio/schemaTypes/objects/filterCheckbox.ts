import {defineArrayMember, defineField} from 'sanity'
import {BsUiRadios} from 'react-icons/bs'

export default {
  name: 'filterCheckbox',
  title: 'Filtre — 2 options checkbox',
  type: 'object',
  icon: BsUiRadios,
  fields: [
    defineField({
      name: 'filterKey',
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
    // defineField({
    //   name: 'filterLabel',
    //   title: 'Label du groupe (optionnel)',
    //   type: 'localeString',
    // }),
    defineField({
      name: 'filterOptions',
      title: '2 options',
      type: 'array',
      description: 'Sélectionnez exactement 2 items à proposer comme boutons checkbox.',
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
    select: {checkboxKey: 'checkboxKey'},
    prepare({checkboxKey}: any) {
      return {title: `Filtre — ${checkboxKey || '?'} ◉`, subtitle: '2 choix checkbox'}
    },
  },
}
