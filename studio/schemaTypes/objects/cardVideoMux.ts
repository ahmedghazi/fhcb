import {GoVideo} from 'react-icons/go'
import {defineField} from 'sanity'
import {baseLanguage} from '../locale/supportedLanguages'

export default defineField({
  name: 'cardVideoMux',
  title: 'Carte Video Mux',
  type: 'object',
  icon: GoVideo,

  fields: [
    defineField({
      name: 'video',
      type: 'mux.video',
    }),
    defineField({
      title: 'cta',
      name: 'cta',
      type: 'cta',
    }),
  ],
  preview: {
    select: {
      label: `cta.label.${baseLanguage}`,
    },
    prepare(selection) {
      const {label} = selection
      return {
        title: label,
        subtitle: 'Carte Video Mux',
      }
    },
  },
})
