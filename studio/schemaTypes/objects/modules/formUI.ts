import {defineField} from 'sanity'
import {GrSend} from 'react-icons/gr'
import {baseLanguage} from '../../locale/supportedLanguages'
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
            defineField({name: 'to', type: 'string', title: 'Destinataire', description: 'E-mail'}),

            defineField({
              name: 'title',
              type: 'localeString',
            }),
            defineField({
              name: 'description',
              type: 'localeString',
            }),
          ],
          preview: {
            select: {
              title: `title.${baseLanguage}`,
            },
          },
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
