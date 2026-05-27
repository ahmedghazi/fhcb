import {defineField} from 'sanity'
import {BiImages} from 'react-icons/bi'
import {baseLanguage} from '../../locale/supportedLanguages'
import image from '../../fields/image'

export default defineField({
  name: 'newsCardUI',
  title: 'Actualités UI',
  type: 'object',
  icon: BiImages,
  initialValue: {
    gridSize: 4,
  },
  fields: [
    defineField({name: 'title', type: 'localeString', title: 'Titre'}),
    defineField({
      name: 'gridSize',
      type: 'number',
      title: 'Taille de la grille',
      description: "Nombre d'éléments par ligne",
    }),
    // defineField({
    //   name: 'items',
    //   title: 'Items',
    //   type: 'array',
    //   of: [
    //     {
    //       type: 'reference',
    //       to: [
    //         {type: 'pageModulaire'},
    //         {type: 'product'},
    //         {type: 'event'},
    //         {type: 'exhibition'},
    //         {type: 'article'},
    //       ],
    //     },
    //   ],
    // }),
  ],

  preview: {
    select: {
      // image: 'items.0.imageCover',
      title: `title.${baseLanguage}`,
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
