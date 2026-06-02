import {defineField} from 'sanity'
import {BiImages} from 'react-icons/bi'
import {baseLanguage} from '../../locale/supportedLanguages'
import image from '../../fields/image'
import {CiGrid31} from 'react-icons/ci'

export default defineField({
  name: 'newsCardUI',
  title: 'Actualités UI',
  type: 'object',
  icon: CiGrid31,
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
