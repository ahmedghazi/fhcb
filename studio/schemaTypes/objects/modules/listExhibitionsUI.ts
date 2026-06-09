import {defineField} from 'sanity'
import {baseLanguage} from '../../locale/supportedLanguages'
import {FiGrid} from 'react-icons/fi'

export default defineField({
  name: 'listExhibitionsUI',
  title: 'List Expositions UI',
  type: 'object',
  icon: FiGrid,
  fields: [
    defineField({name: 'title', type: 'localeString', title: 'Titre'}),
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
        "Exclure les éléments portant ces tags, même s'ils correspondent aux tags de filtre. Ex. : exclure le tag « hors-les-murs » pour que ces expositions n'apparaissent que sur leur page dédiée.",
      of: [{type: 'reference', to: [{type: 'tag'}]}],
    }),
    // defineField({
    //   name: 'filters',
    //   title: 'Filtres',
    //   type: 'array',
    //   description: 'Filtres client-side (tri, recherche, tag).',
    //   of: [{type: 'filterSort'}, {type: 'filterSearch'}, {type: 'filterList'}],
    //   hidden: ({parent}) => parent?.items !== 'exhibitions-past',
    // }),
    defineField({name: 'cta', type: 'cta', title: 'CTA'}),
  ],
  preview: {
    select: {title: `title.${baseLanguage}`},
    prepare(selection) {
      return {title: selection.title || 'List Expositions UI', subtitle: 'List Expositions UI'}
    },
  },
})
