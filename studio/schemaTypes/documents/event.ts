import {defineField, defineType} from 'sanity'
import {baseLanguage} from '../locale/supportedLanguages'
import {BsCalendar2Event} from 'react-icons/bs'
import slug from '../fields/slug'
import modulesListExhibitionEvent from '../objects/modules/modulesListExhibitionEvent'
import rebondsTypeField from '../misc/rebondsTypeField'

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
      name: 'viewCard',
      title: 'Vue Carte',
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
      name: 'pastille',
      type: 'localeString',
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
      of: modulesListExhibitionEvent,
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

    rebondsTypeField,
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
        subtitle: `/event/${slug.current} - ${date}`,
        media: image,
      }
    },
  },
})
