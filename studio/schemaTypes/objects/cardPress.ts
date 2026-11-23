import {IoNewspaperOutline} from 'react-icons/io5'
import {defineField} from 'sanity'
import {baseLanguage} from '../locale/supportedLanguages'

export default defineField({
  name: 'cardPress',
  title: 'Carte Presse',
  type: 'object',
  icon: IoNewspaperOutline,

  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'localeString',
    }),
    defineField({
      name: 'subtitle',
      title: 'Sous-titre',
      type: 'localeString',
    }),
    defineField({
      name: 'imageCover',
      title: 'Image clef',
      type: 'image',
    }),
    defineField({
      name: 'text',
      title: 'Texte',
      type: 'localeText',
    }),
    defineField({
      name: 'buttons',
      title: 'Boutons',
      description: '1er = bouton principal (lien de la carte), 2e = bouton secondaire',
      type: 'array',
      of: [{type: 'linkInternal'}, {type: 'linkExternal'}],
      validation: (rule) => rule.max(2),
    }),
  ],
  preview: {
    select: {
      title: `title.${baseLanguage}`,
      subtitle: `subtitle.${baseLanguage}`,
      media: 'imageCover',
    },
    prepare(selection) {
      const {title, subtitle, media} = selection
      return {
        title: title || 'Carte Presse',
        subtitle: subtitle ? `Carte Presse — ${subtitle}` : 'Carte Presse',
        media,
      }
    },
  },
})
