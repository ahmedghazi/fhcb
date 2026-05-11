import {StackCompactIcon} from '@sanity/icons'
import pluralize from 'pluralize-esm'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'accordion',
  title: 'Accordion',
  type: 'object',
  icon: StackCompactIcon,
  fields: [
    // Groups
    defineField({
      name: 'items',
      title: 'items',
      type: 'array',
      of: [{type: 'accordionItem'}],
    }),
  ],
  preview: {
    select: {
      items: 'items',
    },
    prepare({items = []}) {
      return {
        subtitle: 'Accordion',
        title: items.length > 0 ? pluralize('group', items.length, true) : 'No items',
        media: StackCompactIcon,
      }
    },
  },
})
