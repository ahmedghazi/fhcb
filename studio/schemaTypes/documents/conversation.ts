import {defineField, defineType} from 'sanity'
import {baseLanguage} from '../locale/supportedLanguages'
import slug from '../fields/slug'
import {TbMessageCircle} from 'react-icons/tb'
import modulesList from '../objects/modules/modulesList'
import linkInternalTypes from '../misc/linkInternalTypes'
import rebondsAutoField from '../misc/rebondsAutoField'
import modulesListConversationParoles from '../objects/modules/modulesListConversationParoles'

export default defineType({
  type: 'document',
  name: 'conversation',
  title: 'Paroles (Conversation)',
  icon: TbMessageCircle,
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
      type: 'localeString',
      title: 'Titre',
      description: 'Le nom de la page',
      group: 'editorial',
    }),
    slug,

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
      hidden: true,
    }),
    defineField({
      name: 'text',
      title: 'Texte',
      type: 'localeBlockContent',
      group: 'editorial',
      hidden: true,
    }),

    defineField({
      name: 'chercheur',
      title: 'Chercheur',
      type: 'reference',
      to: [{type: 'chercheur'}],
      group: 'editorial',
      hidden: true,
    }),

    defineField({
      name: 'imageCover',
      type: 'image',
      title: 'Image de couverture',
      options: {hotspot: true},
      group: 'editorial',
    }),

    defineField({
      name: 'video',
      type: 'video',
      title: 'Vidéo',
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
      hidden: true,
    }),

    defineField({
      name: 'modules',
      title: 'Modules',
      description: 'Zone de contenu Modulaire (images, textes)',
      type: 'array',
      of: modulesListConversationParoles,
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
      hidden: true,
    }),
    rebondsAutoField,
  ],

  preview: {
    select: {
      title: `title.${baseLanguage}`,
      slug: 'slug',
      image: 'imageCover',
    },
    prepare(selection) {
      const {title, slug, image} = selection
      return {
        title: title,
        subtitle: `/conversation/${slug?.current}`,
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
