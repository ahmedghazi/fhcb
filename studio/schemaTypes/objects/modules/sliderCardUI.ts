import {defineField} from 'sanity'
import {baseLanguage} from '../../locale/supportedLanguages'
import {MdOutlineSlideshow} from 'react-icons/md'

export default defineField({
  name: 'sliderCardUI',
  title: 'Slider Cards UI',
  type: 'object',
  icon: MdOutlineSlideshow,
  fields: [
    defineField({name: 'title', type: 'localeString', title: 'Titre'}),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            {type: 'pageModulaire'},
            {type: 'product'},
            {type: 'event'},
            {type: 'exhibition'},
          ],
        },
      ],
    }),
    defineField({name: 'cta', type: 'cta', title: 'CTA'}),
  ],
  preview: {
    select: {title: `title.${baseLanguage}`},
    prepare(selection) {
      return {title: selection.title || 'Slider Cards UI', subtitle: 'Slider Cards UI'}
    },
  },
})
