import {defineField} from 'sanity'
import {baseLanguage} from '../../locale/supportedLanguages'
import {MdOutlineImage} from 'react-icons/md'
import imageFields from '../../misc/imageFields'

export default defineField({
  name: 'textImageUI',
  title: 'Texte + Image UI',
  type: 'object',
  icon: MdOutlineImage,
  initialValue: {
    direction: 'left',
  },
  fields: [
    defineField({name: 'title', title: 'Titre', type: 'localeString'}),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: {hotspot: true},
      // fields: imageFields,
    }),
    defineField({name: 'text', type: 'localeBlockContent', title: 'Texte'}),
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
      title: `title.${baseLanguage}`,
      image: 'image',
      text: `text.${baseLanguage}`,
    },
    prepare(selection) {
      const {title, text, image} = selection
      // ici afficher la première phrase du blockContent
      const firstParagraph = text?.[0]?.children?.[0]?.text || ''
      return {
        title: title || firstParagraph || 'Texte + Image UI',
        subtitle: 'Texte + Image UI',
        media: image,
      }
    },
  },
})
