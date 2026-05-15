import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons'
import {baseLanguage} from '../locale/supportedLanguages'
import slug from '../fields/slug'

export default defineType({
  name: 'tag',
  title: 'Tag',
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
      type: 'localeString',
      group: 'editorial',
    }),
    slug,
  ],
  preview: {
    select: {
      title: `title.${baseLanguage}`,
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
