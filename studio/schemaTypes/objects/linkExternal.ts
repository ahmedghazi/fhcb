import {defineField} from 'sanity'

export default defineField({
  title: 'Lien Externe',
  name: 'linkExternal',
  type: 'object',
  preview: {
    select: {
      label: `label`,
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
      title: 'Label',
      type: 'string',
    }),
    defineField({
      name: 'link',
      title: 'Lien',
      type: 'string',
    }),
  ],
})
