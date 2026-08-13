import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons'
import {baseLanguage} from '../locale/supportedLanguages'
import slug from '../fields/slug'

export default defineType({
  name: 'rebond',
  title: 'Rebond',
  type: 'document',
  icon: TagIcon,
  groups: [
    {
      default: true,
      name: 'editorial',
      title: 'Editorial',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      group: 'editorial',
    }),
    defineField({
      name: 'items',
      group: 'editorial',
      description: 'Documents + ordre ',
      type: 'array',
      of: [
        {
          type: 'string',
          options: {
            list: [
              {title: 'Artiste', value: 'artist'},
              {title: 'Artiste(s) Lié(s)', value: 'artist-related'},
              {title: 'Livre(s) lié(s)', value: 'book-related'},
              {title: 'Expo(s) liée(s)', value: 'exhibition-related'},
              {
                title: 'Expo(s) liée(s) en cours/à venir',
                value: 'exhibition-related-current-and-futur',
              },
              {title: 'Expo(s) lié(s) passés', value: 'exhibition-related-past'},
              {title: 'Événement(s) à venir', value: 'futur-event'},
              {title: 'Article(s) lié(s)', value: 'article-related'},
              {title: 'Ressource(s) lié(s)', value: 'ressources-related'},
            ],
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: `title`,
    },
  },
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
})
