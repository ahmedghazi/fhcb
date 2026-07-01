import {defineField} from 'sanity'
import {baseLanguage} from '../../locale/supportedLanguages'
import {FiCalendar} from 'react-icons/fi'

export default defineField({
  name: 'listEventsUI',
  title: 'List Événements UI',
  type: 'object',
  icon: FiCalendar,
  initialValue: {
    cardSize: 'sm',
  },
  fields: [
    defineField({name: 'title', type: 'localeString', title: 'Titre'}),
    defineField({
      name: 'cardSize',
      type: 'string',
      title: 'Taille de carte',
      options: {
        list: [
          {
            value: 'sm',
            title: 'Petite',
          },
          {
            value: 'md',
            title: 'Moyenne',
          },
          {
            value: 'lg',
            title: 'grande',
          },
        ],
      },
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
      name: 'excludeTags',
      type: 'array',
      title: 'Exclure par tags',
      description:
        "Exclure les éléments portant ces tags, même s'ils correspondent aux tags de filtre.",
      of: [{type: 'reference', to: [{type: 'tag'}]}],
    }),
    // defineField({
    //   name: 'filters',
    //   title: 'Filtres',
    //   type: 'array',
    //   description: 'Filtres client-side (tri, recherche, tag).',
    //   of: [
    //     {type: 'filterSort'},
    //     {type: 'filterSearch'},
    //     {type: 'filterList'},
    //     {type: 'filterCheckbox'},
    //   ],
    // }),
    defineField({name: 'cta', type: 'cta', title: 'CTA'}),
    defineField({
      name: 'linkFallback',
      type: 'cta',
      title: 'Lien de repli',
      description: "Affiché si aucun événement n'est trouvé — ex. : renvoyer vers les événements passés.",
    }),
  ],
  preview: {
    select: {title: `title.${baseLanguage}`},
    prepare(selection) {
      return {title: selection.title || 'List Événements UI', subtitle: 'List Événements UI'}
    },
  },
})
