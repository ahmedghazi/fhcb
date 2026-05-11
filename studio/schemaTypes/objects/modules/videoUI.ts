import {defineField} from 'sanity'
import {SiIcons8} from 'react-icons/si'
import {baseLanguage} from '../../locale/supportedLanguages'

export default defineField({
  name: 'videoUI',
  title: 'Video UI',
  type: 'object',
  icon: SiIcons8,
  initialValue: {
    colSize: 2,
  },
  fields: [
    // defineField({
    //   name: 'title',
    //   type: 'localeString',
    // }),

    defineField({
      name: 'video',
      type: 'video',
    }),
  ],

  preview: {
    select: {
      title: `video.caption.${baseLanguage}`,
      image: 'video.placeholder',
    },
    prepare(selection) {
      const {title, image} = selection
      return {
        title: title ? title : 'Video UI',
        subtitle: 'Video UI',
        media: image,
      }
    },
  },
})
