import {defineField} from 'sanity'
import {baseLanguage} from '../../locale/supportedLanguages'
import {MdGridView} from 'react-icons/md'
import listPostTypes from '../../misc/listPostTypes'

export default defineField({
  name: 'gridCardUI',
  title: 'Grid Cards UI',
  type: 'object',
  icon: MdGridView,
  initialValue: {
    size: 'sm',
  },
  fields: [
    defineField({name: 'title', type: 'localeString', title: 'Titre'}),
    defineField({
      name: 'size',
      type: 'string',
      description: 'taille des éléments de la grille, sm = 4/ligne, md = 2/ligne, lg = 1 / ligne',
      options: {
        list: [
          {title: 'Small', value: 'sm'},
          {title: 'Medium', value: 'md'},
          {title: 'Large', value: 'lg'},
        ],
      },
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: listPostTypes,
        },
      ],
    }),
    defineField({name: 'cta', type: 'cta', title: 'CTA'}),
  ],
  preview: {
    select: {title: `title.${baseLanguage}`},
    prepare(selection) {
      return {title: selection.title || 'Grid Cards UI', subtitle: 'Grid Cards UI'}
    },
  },
})
