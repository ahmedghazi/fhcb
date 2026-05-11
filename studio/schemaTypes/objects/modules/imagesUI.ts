import {defineField} from 'sanity'
import {BiImages} from 'react-icons/bi'

export default defineField({
  name: 'imagesUI',
  title: 'Image(s) UI',
  type: 'object',
  icon: BiImages,
  initialValue: {
    colSize: 2,
  },
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'colSize',
      type: 'number',
      description: 'Number of columns (1-2) on a 2 columns grid',
    }),
    defineField({
      name: 'gridSize',
      type: 'number',
      initialValue: 4,
    }),
    defineField({
      name: 'items',
      type: 'array',
      of: [
        {
          type: 'image',
          preview: {
            select: {
              title: 'caption',
              subtitle: 'colSize',
            },
            prepare({title, subtitle}) {
              return {
                title: title || '',
                subtitle: subtitle ? `${subtitle} colonnes` : '',
              }
            },
          },
          fields: [
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
            defineField({
              name: 'colSize',
              title: 'Colunn size',
              type: 'number',
              description: 'in a 6 column grid (ex: 1, 2, 3)',
            }),
          ],
        },
      ],
    }),
  ],

  preview: {
    select: {
      image: 'items.0.asset',
      title: 'title',
    },
    prepare(selection) {
      const {title, image} = selection
      return {
        title: title ? title : 'Images UI',
        subtitle: 'Image(s) UI',
        media: image,
      }
    },
  },
})
