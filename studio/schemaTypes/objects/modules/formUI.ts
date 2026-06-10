import {defineField} from 'sanity'
import {GrSend} from 'react-icons/gr'
export default defineField({
  name: 'formUI',
  title: 'Form UI',
  type: 'object',
  icon: GrSend,
  fields: [
    defineField({name: 'title', type: 'localeString', title: 'Titre'}),
    defineField({
      name: 'subject',
      title: 'Motif du contact',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'subectItem',
          fields: [
            {
              name: 'title',
              type: 'localeString',
            },
            {
              name: 'description',
              type: 'localeString',
            },
          ],
        },
      ],
    }),
    // defineField({name: 'cta', type: 'cta', title: 'CTA'}),
  ],
  preview: {
    prepare() {
      return {title: 'Form UI', subtitle: 'Form UI'}
    },
  },
})
