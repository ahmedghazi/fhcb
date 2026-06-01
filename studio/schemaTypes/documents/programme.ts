import {defineField, defineType} from 'sanity'
import {FiServer} from 'react-icons/fi'
import modulesList from '../objects/modules/modulesList'
import {baseLanguage} from '../locale/supportedLanguages'
import slug from '../fields/slug'
import {SiElasticstack} from 'react-icons/si'

export default defineType({
  name: 'programme',
  type: 'document',
  title: 'Programme',
  icon: SiElasticstack,
  groups: [
    {
      default: true,
      name: 'editorial',
      title: 'Editorial',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  preview: {
    select: {
      title: `title.${baseLanguage}`,
      slug: 'slug',
      homePage: 'homePage',
      media: 'imageCover',
    },
    prepare(selection) {
      const {title, slug, homePage, media} = selection
      return {
        title: title,
        subtitle: homePage ? "Page d'accueil" : `/${slug.current}`,
        media: media,
      }
    },
  },

  fields: [
    defineField({
      name: 'seo',
      type: 'seo',
      group: 'seo',
    }),

    defineField({
      name: 'title',
      type: 'localeString',
      title: 'Titre',
      description: 'Le nom de la page',
      group: 'editorial',
    }),

    slug,

    defineField({
      name: 'imageCover',
      type: 'image',
      title: 'Image de couverture',
      options: {hotspot: true},
      group: 'editorial',
    }),

    defineField({
      name: 'items',
      type: 'string',
      title: 'Type de contenu',
      description: "Détermine le type d'éléments affichés sur cette page et la taille des cartes.",
      options: {
        list: [
          {title: 'Expositions en cours', value: 'exhibitions-current'},
          {title: 'Expositions passées', value: 'exhibitions-past'},
          {title: 'Expositions à venir', value: 'exhibitions-futur'},
          {title: 'Expositions hors-les-murs', value: 'exhibitions-out-of-the-box'},
          {title: 'Événements', value: 'events'},
          {title: 'Visites commentées', value: 'guided-tours'},
        ],
      },
      group: 'editorial',
      hidden: true,
    }),

    defineField({
      name: 'filterTags',
      type: 'array',
      title: 'Filtrer par tags',
      description:
        'Restreindre les éléments affichés aux documents portant ces tags. Laisser vide pour tout afficher.',
      of: [{type: 'reference', to: [{type: 'tag'}]}],
      group: 'editorial',
      hidden: true,
    }),

    defineField({
      name: 'excludeTags',
      type: 'array',
      title: 'Exclure par tags',
      description:
        "Exclure les éléments portant ces tags, même s'ils correspondent aux tags de filtre. Ex. : sur la page « Expositions en cours », exclure le tag « hors-les-murs » pour que ces expositions n'apparaissent que sur leur page dédiée.",
      of: [{type: 'reference', to: [{type: 'tag'}]}],
      group: 'editorial',
      hidden: true,
    }),

    defineField({
      name: 'filters',
      title: 'Filtres',
      type: 'array',
      description: 'Filtres pour les expositions passées',
      of: [{type: 'filterSort'}, {type: 'filterSearch'}, {type: 'filterList'}],
      group: 'editorial',
      hidden: true,
    }),

    defineField({
      name: 'modules',
      title: 'Modules',
      type: 'array',
      description:
        'Zone modulaire — ajouter des modules listExhibitionsUI ou listEventsUI pour enrichir la page.',
      of: modulesList,
      group: 'editorial',
    }),
  ],
})
