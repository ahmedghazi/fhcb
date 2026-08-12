import {RxButton} from 'react-icons/rx'
import {defineField} from 'sanity'

export default defineField({
  name: 'blockContentCta',
  title: 'Cta',
  type: 'object',
  icon: RxButton,
  initialValue: {
    align: 'left',
  },
  fields: [
    defineField({
      title: 'Lien interne',
      name: 'internal',
      type: 'linkInternal',
    }),
    defineField({
      title: 'Lien externe',
      description: 'Ailleurs sur le web',
      name: 'external',
      type: 'linkExternal',
    }),
    defineField({
      name: 'align',
      title: 'Alignement',
      type: 'string',
      options: {
        list: [
          {title: 'Gauche', value: 'left'},
          {title: 'Centre', value: 'center'},
          {title: 'Droit', value: 'right'},
        ],
      },
    }),
  ],
  preview: {
    select: {
      external: `external`,
      internal: `internal`,
    },
    prepare(selection) {
      const {external, internal} = selection
      return {
        title: external ? external.label.fr : internal.label.fr,
        subtitle: external ? 'lien externe' : 'lien interne',
      }
    },
  },
})
