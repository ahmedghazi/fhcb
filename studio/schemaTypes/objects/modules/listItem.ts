import {defineField} from 'sanity'
import {baseLanguage} from '../../locale/supportedLanguages'

export default defineField({
  name: 'listItem',
  title: 'List Item',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'localeString', title: 'Titre'}),
    // defineField({name: 'content', type: 'localeText', title: 'Contenu'}),
    defineField({name: 'content', type: 'localeBlockContent', title: 'Contenu'}),
    defineField({name: 'link', type: 'linkInternal', title: 'Lien interne'}),
    defineField({name: 'linkExternal', type: 'linkExternal', title: 'Lien externe'}),
  ],
  preview: {
    select: {title: `title.${baseLanguage}`},
    prepare(selection) {
      return {title: selection.title || 'List Item', subtitle: 'List Item'}
    },
  },
})
