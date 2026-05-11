// import supportedLanguages from "../locale/supportedLanguages";
import {defineField} from 'sanity'

export default defineField({
  title: 'Link Modal',
  name: 'linkModal',
  type: 'object',
  preview: {
    select: {
      label: `label.en`,
    },
    prepare(selection) {
      const {label} = selection
      return {
        title: label,
      }
    },
  },
  fields: [
    defineField({
      name: 'label',
      type: 'localeString',
    }),
    defineField({
      name: 'target',
      type: 'string',
      options: {
        list: [{title: 'Works', value: 'modal-works'}],
      },
    }),
  ],
})
