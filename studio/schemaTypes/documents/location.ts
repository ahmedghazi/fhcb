import {defineField, defineType} from 'sanity'
import {baseLanguage} from '../locale/supportedLanguages'
import slug from '../fields/slug'
import {FaLocationDot} from 'react-icons/fa6'

export default defineType({
  name: 'location',
  title: 'Lieu',
  type: 'document',
  icon: FaLocationDot,
  initialValue: {
    inSite: true,
  },
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
      name: 'inSite',
      type: 'boolean',
      title: 'À la fondation',
      group: 'editorial',
    }),
    // defineField({
    //   name: 'travelling',
    //   type: 'boolean',
    //   title: 'Itinérante',
    //   group: 'editorial',
    // }),
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
