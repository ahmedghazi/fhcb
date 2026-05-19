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
      options: {
        list: [
          {title: 'Expositions en cours', value: 'exhibitions-current'},
          {title: 'Expositions à venir', value: 'exhibitions-futur'},
          {title: 'Expositions hors-les-murs', value: 'exhibitions-out-of-the-box'},
          {title: 'Événements', value: 'events'},
          {title: 'Visites commentées', value: 'guided-tours'},
        ],
      },
      group: 'editorial',
    }),
  ],
})
