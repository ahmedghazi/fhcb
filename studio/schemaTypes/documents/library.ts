import {defineField, defineType} from 'sanity'
import {baseLanguage} from '../locale/supportedLanguages'
import {FaShopify} from 'react-icons/fa'
import slug from '../fields/slug'

export default defineType({
  type: 'document',
  name: 'library',
  title: 'Librairie',
  icon: FaShopify,
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
      name: 'miseEnAvant',
      title: 'Mise en avant',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'product'}]}],
      group: 'editorial',
    }),

    defineField({
      name: 'sliderSelection',
      title: 'Sélection slider',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'product'}]}],
      group: 'editorial',
    }),

    defineField({
      name: 'items',
      title: 'Produits',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'product'}]}],
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
