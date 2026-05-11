import supportedLanguages from './supportedLanguages'
import {FiAlignLeft} from 'react-icons/fi'
export default {
  type: 'object',
  name: 'localeBlockContent',
  title: 'locale Block Content',
  icon: FiAlignLeft,
  fieldsets: [
    {
      title: 'Traduction',
      name: 'translations',
      options: {collapsible: true, collapsed: true},
    },
  ],
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: 'blockContent',
    fieldset: lang.isDefault ? null : 'translations',
  })),
  preview: {
    select: {
      title: `ctitle`,
    },
    prepare(selection) {
      const {title} = selection
      return {
        title: title,
        subtitle: 'Texte',
      }
    },
  },
}
