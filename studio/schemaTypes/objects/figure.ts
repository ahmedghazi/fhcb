import {FiImage} from 'react-icons/fi'
import {baseLanguage} from '../locale/supportedLanguages'
import {defineField} from 'sanity'

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
      fields: [
        // {name: 'title', title: 'Title', type: 'string'},
        {name: 'alt', title: 'Alt Description', type: 'string'},
        // {name: 'attribution', title: 'Attribution', type: 'string'}
      ],
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
})
