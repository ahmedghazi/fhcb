import {FiImage} from 'react-icons/fi'
import {baseLanguage} from '../locale/supportedLanguages'
import {defineField} from 'sanity'
import imageFields from '../misc/imageFields'

export default defineField({
  name: 'imageInGrid',
  title: 'image',
  type: 'object',
  icon: FiImage,
  initialValue: {
    colSize: 1,
  },
  preview: {
    select: {
      media: 'image',
      title: `image.title`,
    },
    prepare(selection) {
      const {media, title} = selection
      return {
        title: title,
        media: media,
        subtitle: 'Image In Grid',
      }
    },
  },
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      description: 'jpg, 1400px de large, 72dpi',
      options: {
        hotspot: true,
      },
      // fields: imageFields,
    }),
    // defineField({
    //   name: 'caption',
    //   title: 'Caption',
    //   type: 'string',
    // }),
    defineField({
      name: 'colSize',
      title: 'Taille de colonne',
      type: 'number',
      description: "Espace occupé par l'image sur la grille",
    }),
  ],
})
