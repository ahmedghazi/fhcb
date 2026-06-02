import {defineField, defineType} from 'sanity'
import {baseLanguage} from '../locale/supportedLanguages'
import {LuGalleryHorizontal} from 'react-icons/lu'
import slug from '../fields/slug'
import modulesList from '../objects/modules/modulesList'
import imageFields from '../misc/imageFields'

export default defineType({
  type: 'document',
  name: 'exhibition',
  title: 'Exposition',
  icon: LuGalleryHorizontal,
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
  // orderings: [
  //   {
  //     title: 'Trier par theme ASC',
  //     name: 'themeAsc',
  //     by: [{field: 'tagType', direction: 'asc'}],
  //   },
  //   {
  //     title: 'Trier par theme DESC',
  //     name: 'themeDesc',
  //     by: [{field: 'tagType', direction: 'desc'}],
  //   },
  // ],
  initialValue: {
    location: 'inside',
  },
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
      name: 'links',
      title: 'Liens',
      description: 'Tickets, ...',
      type: 'array',
      of: [{type: 'linkExternal'}],
      group: 'editorial',
    }),

    defineField({
      name: 'artists',
      title: 'Artistes',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'artist'}]}],
      group: 'editorial',
    }),

    defineField({
      name: 'dates',
      type: 'array',
      title: 'Dates',
      group: 'editorial',
      of: [{type: 'fhcbDate'}],
    }),

    defineField({
      name: 'pastille',
      type: 'localeString',
      group: 'editorial',
    }),
    defineField({
      name: 'location',
      type: 'string',
      options: {
        list: [
          {title: 'À la fondation', value: 'inside'},
          {title: 'Hors les murs', value: 'outside'},
          {title: 'Itinérante', value: 'itinerant'},
        ],
      },
      group: 'editorial',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'tag'}]}],
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
          to: [{type: 'pageModulaire'}, {type: 'event'}, {type: 'exhibition'}, {type: 'product'}],
        },
      ],
      group: 'editorial',
    }),
  ],

  preview: {
    select: {
      title: `title.${baseLanguage}`,
      subtitle: 'slug.current',
      image: 'imageCover',
      tags: `tags.0.title.${baseLanguage}`,
    },
    prepare(selection) {
      const {title, subtitle, image, tags} = selection
      // console.log(images)
      return {
        title: `${title} [${tags}]`,
        subtitle: `/exhibition/${subtitle}`,
        media: image,
      }
    },
  },
})
