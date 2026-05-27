import {CiCalendarDate} from 'react-icons/ci'
import {defineField} from 'sanity'

export default defineField({
  name: 'fhcbDate',
  title: 'Date',
  type: 'object',
  icon: CiCalendarDate,

  fields: [
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
    },
    prepare(selection) {
      const {du, au} = selection
      const fmt = (d: string | undefined) => (d ? new Date(d).toLocaleDateString('fr-FR') : '?')
      return {
        title: `${fmt(du)} - ${fmt(au)}`,
      }
    },
  },
})
