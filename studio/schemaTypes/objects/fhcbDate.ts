import {CiCalendarDate} from 'react-icons/ci'
import {defineField} from 'sanity'

export default defineField({
  name: 'fhcbDate',
  title: 'Date',
  type: 'object',
  icon: CiCalendarDate,
  initialValue: {
    inSite: true,
  },
  fields: [
    defineField({
      name: 'location',
      title: 'Lieu',
      type: 'reference',
      to: [{type: 'location'}],
    }),
    defineField({
      name: 'inSite',
      title: 'À la fondation?',
      type: 'boolean',
    }),
    defineField({
      type: 'date',
      name: 'du',
      title: 'Du',
      options: {
        dateFormat: 'DD/MM/YYYY',
      },
    }),
    defineField({
      type: 'date',
      name: 'au',
      title: 'Au',
      options: {
        dateFormat: 'DD/MM/YYYY',
      },
    }),
    defineField({
      name: 'withTime',
      title: 'Avec heure',
      type: 'boolean',
    }),
    defineField({
      type: 'string',
      name: 'timeStart',
      title: 'Heure de début',
      description: 'Ex: 19h',
      hidden: ({parent}) => !parent?.withTime,
    }),
    defineField({
      type: 'string',
      name: 'timeEnd',
      title: 'Heure de fin (optionnel)',
      description: 'Ex: 23h',
      hidden: ({parent}) => !parent?.withTime,
    }),
  ],
  preview: {
    select: {
      du: 'du',
      au: 'au',
      inSite: 'inSite',
    },
    prepare(selection) {
      const {du, au, inSite} = selection
      const fmt = (d: string | undefined) => (d ? new Date(d).toLocaleDateString('fr-FR') : '?')
      return {
        title: `${fmt(du)} - ${fmt(au)}`,
        subtitle: inSite ? 'À la fondation' : 'Hors site',
      }
    },
  },
})
