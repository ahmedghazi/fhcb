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
  initialValue: {
    visible: true,
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'localeString',
      group: 'editorial',
    }),
    slug,
    defineField({
      name: 'tagType',
      type: 'string',
      group: 'editorial',
      options: {
        list: [
          {
            title: 'Exposition',
            value: 'exhibition',
          },
          {
            title: 'Événement',
            value: 'event',
          },
          {
            title: 'Page',
            value: 'pageModulaire',
          },
          {
            title: 'Ressource',
            value: 'ressource',
          },
        ],
      },
    }),
    defineField({
      name: 'visible',
      title: 'Visible',
      type: 'boolean',
      group: 'editorial',
    }),
  ],
  preview: {
    select: {
      title: `title.${baseLanguage}`,
      subtitle: 'tagType',
    },
  },
  orderings: [
    {
      title: 'Trier par theme ASC',
      name: 'themeAsc',
      by: [{field: 'tagType', direction: 'asc'}],
    },
    {
      title: 'Trier par theme DESC',
      name: 'themeDesc',
      by: [{field: 'tagType', direction: 'desc'}],
    },
  ],
})
