import {defineField} from 'sanity'
import {baseLanguage} from '../../locale/supportedLanguages'
import {FiCalendar} from 'react-icons/fi'

export default defineField({
  name: 'listEventsUI',
  title: 'List Événements UI',
  type: 'object',
  icon: FiCalendar,
  fields: [
    defineField({name: 'title', type: 'localeString', title: 'Titre'}),
    defineField({
      name: 'items',
      type: 'string',
      title: 'Type de contenu',
      description: "Détermine quels événements sont affichés.",
      options: {
        list: [
          {title: 'Tous les événements', value: 'events'},
          {title: 'Visites commentées', value: 'guided-tours'},
        ],
      },
    }),
    defineField({
      name: 'filterTags',
      type: 'array',
      title: 'Filtrer par tags',
      description: "Restreindre les éléments affichés aux documents portant ces tags. Laisser vide pour tout afficher.",
      of: [{type: 'reference', to: [{type: 'tag'}]}],
    }),
    defineField({
      name: 'excludeTags',
      type: 'array',
      title: 'Exclure par tags',
      description: "Exclure les éléments portant ces tags, même s'ils correspondent aux tags de filtre.",
      of: [{type: 'reference', to: [{type: 'tag'}]}],
    }),
    defineField({
      name: 'filters',
      title: 'Filtres',
      type: 'array',
      description: 'Filtres client-side (tri, recherche, tag).',
      of: [{type: 'filterSort'}, {type: 'filterSearch'}, {type: 'filterList'}],
    }),
    defineField({name: 'cta', type: 'cta', title: 'CTA'}),
  ],
  preview: {
    select: {title: `title.${baseLanguage}`},
    prepare(selection) {
      return {title: selection.title || 'List Événements UI', subtitle: 'List Événements UI'}
    },
  },
})
