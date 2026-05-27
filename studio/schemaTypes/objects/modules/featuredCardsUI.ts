import {defineField} from 'sanity'
import {BiImages} from 'react-icons/bi'
import image from '../../fields/image'

export default defineField({
  name: 'featuredCardsUI',
  title: 'Mise en avant UI',
  description: 'pour la home',
  type: 'object',
  icon: BiImages,
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
          to: [
            // {type: 'pageModulaire'},
            // {type: 'product'},
            // {type: 'event'},
            {type: 'exhibition'},
            // {type: 'article'},
          ],
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
        title: title ? title : 'Actualités UI',
        subtitle: 'Actualités UI',
      }
    },
  },
})
