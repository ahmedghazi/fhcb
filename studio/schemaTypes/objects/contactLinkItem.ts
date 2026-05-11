import {defineField, defineType} from 'sanity'

export default defineType({
  title: 'Contact Link Item',
  name: 'contactLinkItem',
  type: 'object',
  initialValue: {
    colSize: 1,
  },
  preview: {
    select: {
      label: 'label',
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
      title: 'Link',
      type: 'string',
    }),
    defineField({
      name: 'colSize',
      title: 'Col Size',
      type: 'number',
      description: 'Number of columns on the grid',
    }),
  ],
})
