import {defineField} from 'sanity'
import {BsList} from 'react-icons/bs'

export default {
  name: 'filterList',
  title: 'Filtre — Liste',
  type: 'object',
  icon: BsList,
  fields: [
    defineField({
      name: 'filterKey',
      title: 'Type de filtre',
      type: 'string',
      options: {
        list: [
          {title: 'Artiste', value: 'artist'},
          {title: 'Tag', value: 'tag'},
          {title: 'Tag Produit', value: 'tagProduct'},
          {title: 'Chercheur', value: 'chercheur'},
          {title: 'Langue', value: 'language'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'filterLabel',
      title: 'Label du groupe (optionnel)',
      type: 'localeString',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Filtre — Liste', subtitle: '≡'}
    },
  },
}
