import {CiCalendarDate} from 'react-icons/ci'
import {defineField} from 'sanity'

export default defineField({
  name: 'fhcbDate',
  title: 'Date',
  type: 'object',
  icon: CiCalendarDate,
  initialValue: {
    inSite: true,
    locationType: 'inSite',
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
      hidden: true,
    }),
    defineField({
      name: 'locationType',
      title: 'Type d’exposition',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          // {title: 'À la fondation', value: 'inside'},
          // {title: 'Hors les murs', value: 'outside'},
          // { title: 'Itinérante', value: 'itinerant' },
          {title: 'À la fondation', value: 'inSite'},
          {title: 'À la fondation Cube', value: 'inSite-cube'},
          {title: 'À la fondation Tube', value: 'inSite-tube'},
          {title: 'Hors les murs', value: 'offSite'},
          {title: 'Itinérante', value: 'travelling'},
        ],
      },
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
      locationType: 'locationType',
    },
    prepare(selection) {
      const {du, au, locationType} = selection
      const fmt = (d: string | undefined) => (d ? new Date(d).toLocaleDateString('fr-FR') : '?')
      const _locationType = locationType === 'inSite' ? 'À la fondation' : locationType
      return {
        title: `${fmt(du)} - ${au ? fmt(au) : ''}`,
        subtitle: _locationType,
      }
    },
  },
})
