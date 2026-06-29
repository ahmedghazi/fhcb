import {defineField} from 'sanity'
import {BiImages} from 'react-icons/bi'

export default defineField({
  name: 'imagesUI',
  title: 'Image(s) UI',
  type: 'object',
  icon: BiImages,
  initialValue: {
    gridSize: 4,
  },
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),

    defineField({
      name: 'gridSize',
      type: 'number',
      title: 'Taille de la grille',
      description: "Nombre d'éléments par ligne",
    }),
    defineField({
      name: 'items',
      type: 'array',
      of: [
        {
          type: 'imageInGrid',
        },
      ],
    }),
  ],

  preview: {
    select: {
      image: 'items.0',
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
