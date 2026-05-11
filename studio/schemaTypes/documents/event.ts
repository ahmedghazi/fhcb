import {defineField, defineType} from 'sanity'
import {baseLanguage} from '../locale/supportedLanguages'
import {BsCalendar2Event} from 'react-icons/bs'
import slug from '../fields/slug'
import modulesList from '../objects/modules/modulesList'

export default defineType({
  type: 'document',
  name: 'event',
  title: 'Événement',
  icon: BsCalendar2Event,
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
      description: 'Visible sur les pages de liste (largeur 1400px)',
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
          to: [
            {type: 'pageModulaire'},
            {type: 'event'},
            {type: 'exhibition'},
            {type: 'product'},
          ],
        },
      ],
      group: 'editorial',
    }),
  ],

  preview: {
    select: {
      title: `title.${baseLanguage}`,
      date: 'date',
      image: 'imageCover',
    },
    prepare(selection) {
      const {title, date, image} = selection
      // console.log(images)
      return {
        title: title,
        subtitle: date,
        media: image,
      }
    },
  },
})
