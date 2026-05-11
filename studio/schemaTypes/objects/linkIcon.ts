// import supportedLanguages from "../locale/supportedLanguages";
// import {baseLanguage} from '../locale/supportedLanguages'
import {defineField} from 'sanity'

export default defineField({
  title: 'Link Icon',
  name: 'linkIcon',
  type: 'object',
  preview: {
    select: {
      label: `label`,
      media: 'icon',
    },
    prepare(selection) {
      const {label, media} = selection
      return {
        title: label,
        media: media,
        // subtitle: "test",
      }
    },
  },
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'url',
    }),
    defineField({
      name: 'icon',
      type: 'image',
    }),
  ],
})
