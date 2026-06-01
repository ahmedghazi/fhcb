import {defineArrayMember, defineField} from 'sanity'
import {BsSearch} from 'react-icons/bs'

export default {
  name: 'filterSearch',
  title: 'Filtre — Recherche',
  type: 'object',
  icon: BsSearch,
  fields: [
    defineField({
      name: 'searchIn',
      title: 'Champs de recherche',
      description: 'Cochez les champs dans lesquels la recherche doit opérer',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {
        list: [
          {title: 'Titre', value: 'title'},
          {title: 'Sous-titre', value: 'subTitle'},
          {title: 'Numéro (index)', value: 'index'},
          {title: 'Tags', value: 'tags'},
          {title: 'Artistes', value: 'artists'},
          {title: 'Intervenant', value: 'speaker'},
        ],
      },
      validation: (Rule) => Rule.min(1).error('Sélectionnez au moins un champ'),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Filtre — Recherche', subtitle: '🔍'}
    },
  },
}
