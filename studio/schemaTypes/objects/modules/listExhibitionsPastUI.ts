import {defineField} from 'sanity'
import {baseLanguage} from '../../locale/supportedLanguages'
import {FiGrid} from 'react-icons/fi'

export default defineField({
  name: 'listExhibitionsPastUI',
  title: 'List Expositions Passées UI',
  type: 'object',
  icon: FiGrid,
  fields: [
    defineField({name: 'title', type: 'localeString', title: 'Titre'}),
    defineField({
      name: 'items',
      type: 'string',
      title: 'Type de contenu',
      description: 'Détermine quelles expositions sont affichées.',
      options: {
        list: [
          {title: 'Expositions en cours', value: 'exhibitions-current'},
          {title: 'Expositions passées', value: 'exhibitions-past'},
          {title: 'Expositions à venir', value: 'exhibitions-futur'},
          {title: 'Expositions hors-les-murs', value: 'exhibitions-out-of-the-box'},
        ],
      },
      hidden: true,
    }),
    defineField({
      name: 'filterTags',
      type: 'array',
      title: 'Filtrer par tags',
      description:
        'Restreindre les éléments affichés aux documents portant ces tags. Laisser vide pour tout afficher.',
      of: [{type: 'reference', to: [{type: 'tag'}]}],
    }),

    defineField({
      name: 'filters',
      title: 'Filtres',
      type: 'array',
      description: 'Filtres client-side (tri, recherche, tag).',
      of: [{type: 'filterSort'}, {type: 'filterSearch'}, {type: 'filterList'}, {type: 'filterRadio'}],
      hidden: ({parent}) => parent?.items !== 'exhibitions-past',
    }),
    defineField({name: 'cta', type: 'cta', title: 'CTA'}),
  ],
  preview: {
    select: {title: `title.${baseLanguage}`},
    prepare(selection) {
      return {
        title: selection.title || 'List Expositions Passées UI',
        subtitle: 'List Expositions Passées UI',
      }
    },
  },
})
