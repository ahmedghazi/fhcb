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
      title: 'Titre',
      description: 'interne',
      type: 'string',
    }),

    defineField({
      name: 'gridSize',
      type: 'number',
      title: 'Taille de la grille',
      description:
        "Nombre d'éléments par ligne, si ce champs est vide, les images se callent sur la même hauteur.",
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
      image: 'items.0.image',
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
