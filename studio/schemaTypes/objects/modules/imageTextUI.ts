import {defineField} from 'sanity'
import {baseLanguage} from '../../locale/supportedLanguages'
import {MdOutlineImage} from 'react-icons/md'

export default defineField({
  name: 'imageTextUI',
  title: 'Image + Texte UI',
  type: 'object',
  icon: MdOutlineImage,
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: {hotspot: true},
    }),
    defineField({name: 'text', type: 'localeString', title: 'Texte'}),
    defineField({
      name: 'direction',
      type: 'string',
      title: 'Direction',
      options: {
        list: [
          {title: 'Image à gauche', value: 'left'},
          {title: 'Image à droite', value: 'right'},
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: {
      image: 'image',
      text: `text.${baseLanguage}`,
    },
    prepare(selection) {
      const {text, image} = selection
      return {
        title: text || 'Image + Texte UI',
        subtitle: 'Image + Texte UI',
        media: image,
      }
    },
  },
})
