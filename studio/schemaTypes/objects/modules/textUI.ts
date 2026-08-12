import {defineField} from 'sanity'
import {FiAlignLeft} from 'react-icons/fi'
import {baseLanguage} from '../../locale/supportedLanguages'

export default defineField({
  name: 'textUI',
  title: 'Text UI',
  type: 'object',
  icon: FiAlignLeft,
  initialValue: {
    look: 'normal',
    colSize: 2,
  },
  fields: [
    defineField({
      name: 'title',
      type: 'localeString',
    }),
    // defineField({
    //   name: 'colSize',
    //   type: 'number',
    //   description: 'Number of columns (1-2) on a 2 columns grid',
    // }),
    // defineField({
    //   name: 'look',
    //   type: 'string',
    //   options: {
    //     list: [
    //       {title: 'Normal', value: 'normal'},
    //       {title: '2 colonnes', value: 'columns'},
    //       {title: 'LG', value: 'text-lg'},
    //       {title: 'LG Centered', value: 'text-lg text-center'},
    //     ],
    //   },
    // }),
    defineField({
      name: 'text',
      type: 'localeBlockContent',
    }),
  ],
  preview: {
    select: {
      title: `title.${baseLanguage}`,
      text: `text.${baseLanguage}`,
    },
    prepare(selection) {
      const {title, text} = selection
      const firstSenteceOfText = text?.[0]?.children?.[0]?.text?.split('.')[0]
      return {
        title: title ? title : firstSenteceOfText,
        subtitle: 'Text UI',
      }
    },
  },
})
