import {CiCalendarDate} from 'react-icons/ci'
import {defineField} from 'sanity'

export default defineField({
  name: 'fhcbDate',
  title: 'Date',
  type: 'object',
  icon: CiCalendarDate,

  fields: [
    defineField({
      type: 'datetime',
      name: 'du',
      title: 'Du',
      options: {
        dateFormat: 'DD/MM/YYYY',
      },
    }),
    defineField({
      type: 'datetime',
      name: 'au',
      title: 'Au',
      options: {
        dateFormat: 'DD/MM/YYYY',
      },
    }),
  ],
  preview: {
    select: {
      du: 'du',
      au: 'au',
    },
    prepare(selection) {
      const {du, au} = selection
      const fmt = (d: string | undefined) =>
        d ? new Date(d).toLocaleDateString('fr-FR') : '?'
      return {
        title: `${fmt(du)} - ${fmt(au)}`,
      }
    },
  },
})
