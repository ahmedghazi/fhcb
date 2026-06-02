import {defineField} from 'sanity'
import {BiImages} from 'react-icons/bi'
import image from '../../fields/image'
import {CiGrid32} from 'react-icons/ci'

export default defineField({
  name: 'featuredCardsUI',
  title: 'Mise en avant UI',
  description: 'pour la home',
  type: 'object',
  icon: CiGrid32,
  initialValue: {
    gridSize: 3,
  },
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Titre',
      description: 'Interne - pas affiché sur le site',
    }),
    defineField({
      name: 'gridSize',
      type: 'number',
      title: 'Taille de la grille',
      description: "Nombre d'éléments par ligne",
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      hidden: true,
      of: [
        {
          type: 'reference',
          to: [{type: 'exhibition'}],
        },
      ],
    }),
  ],

  preview: {
    select: {
      // image: 'items.0.imageCover',
      title: 'title',
    },
    prepare(selection) {
      const {title} = selection
      return {
        title: title ? title : 'Mise en avant UI',
        subtitle: 'Mise en avant UI',
      }
    },
  },
})
