import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons'
import {baseLanguage} from '../locale/supportedLanguages'
import slug from '../fields/slug'

export default defineType({
  name: 'tagProduct',
  title: 'Tag Produits',
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
    defineField({
      name: 'handle',
      title: 'Handle Shopify',
      type: 'string',
      readOnly: true,
      group: 'editorial',
    }),
    defineField({
      name: 'shopifyId',
      title: 'Shopify Collection ID',
      type: 'string',
      readOnly: true,
      group: 'editorial',
    }),
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
