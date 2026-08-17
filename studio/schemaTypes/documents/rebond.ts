import {defineField, defineType} from 'sanity'
import {baseLanguage} from '../locale/supportedLanguages'
import {FaArrowsAltH} from 'react-icons/fa'

export default defineType({
  name: 'rebond',
  title: 'Rebond',
  type: 'document',
  icon: FaArrowsAltH,
  groups: [
    {
      default: true,
      name: 'editorial',
      title: 'Editorial',
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Nom du rebonds',
      type: 'string',
      group: 'editorial',
    }),
    defineField({
      name: 'title',
      title: 'Titre',
      description: 'Titre du rebonds affiché',
      type: 'localeString',
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
              {title: 'Artiste(s) Lié(s)', value: 'artist-related'},
              {title: 'Livre(s) lié(s)', value: 'book-related'},
              {title: 'Expo(s) liée(s)', value: 'exhibition-related'},
              {
                title: 'Expo(s) liée(s) en cours/à venir',
                value: 'exhibition-related-current-or-futur',
              },
              {title: 'Expo(s) lié(s) passés', value: 'exhibition-related-past'},
              {
                title: 'Événement(s) liée(s) en cours/à venir',
                value: 'event-related-current-or-futur',
              },
              {title: 'Article(s) lié(s)', value: 'articles-related'},
              {title: 'Ressource(s) lié(s)', value: 'ressources-related'},

              {title: 'Expo(s) à venir', value: 'exhibition-futur'},
              {title: 'Expo(s) en cours', value: 'exhibition-current'},
              {title: 'Expo(s) passés', value: 'exhibition-past'},
              {title: 'Expo(s) du même artiste', value: 'exhibition-related-by-artist'},
              {title: 'Événement(s) à venir', value: 'event-futur'},
              {title: 'Artiste', value: 'artist'},
              {
                title: 'Expo(s) passée(s) à découvrir (prio. même artiste, complété au hasard)',
                value: 'exhibition-discover-past',
              },
            ],
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      subtitle: `title.${baseLanguage}`,
      title: 'name',
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
