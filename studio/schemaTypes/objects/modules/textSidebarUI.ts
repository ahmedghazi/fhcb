import {defineField} from 'sanity'
import {FiColumns} from 'react-icons/fi'
import {baseLanguage} from '../../locale/supportedLanguages'

export default defineField({
  name: 'textSidebarUI',
  title: 'Texte + Sidebar (générique) UI',
  type: 'object',
  icon: FiColumns,
  fields: [
    defineField({name: 'text', type: 'localeBlockContent', title: 'Texte principal'}),
    defineField({
      name: 'sidebar',
      title: 'Sidebar (générique)',
      // type: 'localeBlockContent',
      type: 'sidebarGenerique',
    }),
  ],
  preview: {
    select: {
      text: `text.${baseLanguage}`,
    },
    prepare(selection) {
      const {text} = selection
      const firstSenteceOfText = text?.[0]?.children?.[0]?.text?.split('.')[0]
      return {
        title: firstSenteceOfText ? firstSenteceOfText : 'Texte + Sidebar (générique) UI',
        subtitle: 'Texte + Sidebar (générique) UI',
      }
    },
  },
})
/*
      type: 'array',
      of: [{type: 'keyValGroup'}],
*/
