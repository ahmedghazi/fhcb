import {defineField} from 'sanity'
import {baseLanguage} from '../../locale/supportedLanguages'
import {VscLibrary} from 'react-icons/vsc'

export default defineField({
  name: 'ressourcesUI',
  title: 'Ressources UI',
  type: 'object',
  icon: VscLibrary,
  fields: [
    defineField({name: 'title', type: 'localeString', title: 'Titre'}),

    defineField({
      name: 'branches',
      title: 'Branches',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'pageModulaire'}]}],
    }),
    defineField({name: 'cta', type: 'cta', title: 'CTA'}),
  ],
  preview: {
    select: {title: `title.${baseLanguage}`},
    prepare(selection) {
      return {
        title: selection.title || 'Ressources UI',
        subtitle: 'Ressources UI',
      }
    },
  },
})
