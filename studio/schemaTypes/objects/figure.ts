import {FiImage} from 'react-icons/fi'
import {baseLanguage} from '../locale/supportedLanguages'
import {defineField} from 'sanity'
import imageFields from '../misc/imageFields'

export default defineField({
  name: 'figure',
  title: 'Figure',
  type: 'object',
  icon: FiImage,
  preview: {
    select: {
      media: 'image',
      title: `caption`,
    },
    prepare(selection) {
      const {media, title} = selection
      return {
        title: title,
        media: media,
        subtitle: 'Figure',
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
      fields: imageFields,
    }),
  ],
})
