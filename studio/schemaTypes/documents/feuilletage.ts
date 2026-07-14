import {defineField, defineType} from 'sanity'
import {baseLanguage} from '../locale/supportedLanguages'
import slug from '../fields/slug'
import {FiBookOpen} from 'react-icons/fi'
import modulesList from '../objects/modules/modulesList'
import linkInternalTypes from '../misc/linkInternalTypes'

export default defineType({
  type: 'document',
  name: 'feuilletage',
  title: 'Feuilletage',
  icon: FiBookOpen,
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
  fields: [
    defineField({
      name: 'seo',
      type: 'seo',
      group: 'seo',
    }),

    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      group: 'editorial',
    }),
    slug,
    defineField({
      name: 'imageCover',
      type: 'image',
      title: 'Image clef',
      // fields: imageFields,
      description: 'Visible sur les pages de liste (largeur 1400px)',
      group: 'editorial',
    }),

    defineField({
      name: 'video',
      type: 'video',
      title: 'Vidéo',
      group: 'editorial',
    }),

    defineField({
      name: 'subTitle',
      title: 'Sous titre',
      type: 'localeText',
      group: 'editorial',
    }),
    defineField({
      name: 'description',
      type: 'localeText',
      group: 'editorial',
    }),
    defineField({
      name: 'artists',
      title: 'Artiste(s)',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'artist'}]}],
      group: 'editorial',
    }),
    defineField({
      name: 'exhibition',
      title: 'Exposition',
      type: 'reference',
      to: [{type: 'exhibition'}],
      group: 'editorial',
    }),

    defineField({
      name: 'chercheur',
      title: 'Chercheur',
      type: 'reference',
      to: [{type: 'chercheur'}],
      group: 'editorial',
    }),

    defineField({
      name: 'dates',
      type: 'array',
      title: 'Dates',
      group: 'editorial',
      of: [{type: 'fhcbDate'}],
      hidden: true,
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'tag'}]}],
      group: 'editorial',
    }),
    defineField({
      name: 'index',
      type: 'string',
      title: 'Index',
      description: 'Réservé aux événements avec le tag Feuilletage',
      group: 'editorial',
    }),

    defineField({
      name: 'modules',
      title: 'Modules',
      description: 'Zone de contenu Modulaire (images, textes, embed)',
      type: 'array',
      of: modulesList,
      group: 'editorial',
    }),

    defineField({
      name: 'rebonds',
      title: 'Rebonds',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: linkInternalTypes,
        },
      ],
      group: 'editorial',
    }),
  ],

  preview: {
    select: {
      title: `title.${baseLanguage}`,
      slug: 'slug',
      date: 'dates.0.du',
      index: 'index',
      image: 'imageCover',
    },
    prepare(selection) {
      const {title, slug, date, image, index} = selection
      // console.log(images)
      return {
        title: `${index ? `#${index} ` : ''}${title}`,
        subtitle: `/feuilletage/${slug.current} - ${date}`,
        media: image,
      }
    },
  },
  orderings: [
    {
      title: 'Trier par index ASC',
      name: 'indexAsc',
      by: [{field: 'index', direction: 'asc'}],
    },
    {
      title: 'Trier par index DESC',
      name: 'indexDesc',
      by: [{field: 'index', direction: 'desc'}],
    },
  ],
})
