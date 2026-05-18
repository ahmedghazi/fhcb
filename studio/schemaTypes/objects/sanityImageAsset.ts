import {defineField, defineType} from 'sanity'

export const sanityImageAsset = defineType({
  name: 'sanity.imageAsset',
  title: 'Image Asset',
  type: 'document',
  fields: [
    defineField({
      name: 'caption',
      title: 'Légende',
      type: 'localeString',
    }),
    defineField({
      name: 'alt',
      title: 'Description alternative (seo)',
      type: 'localeString',
    }),
    defineField({
      name: 'author',
      title: 'Auteur-e',
      type: 'string',
    }),
    defineField({
      name: 'copyright',
      title: "Droits d'auteur",
      type: 'string',
    }),
    // defineField({
    //   name: 'alt',
    //   title: 'Alt text',
    //   type: 'localeString',
    //   // fields: [
    //   //   {name: 'fr', type: 'string', title: 'Français'},
    //   // ],
    // }),
    // defineField({
    //   name: 'alt',
    //   title: 'Alt text',
    //   type: 'localeString',
    //   // fields: [
    //   //   {name: 'fr', type: 'string', title: 'Français'},
    //   // ],
    // }),
  ],
})
