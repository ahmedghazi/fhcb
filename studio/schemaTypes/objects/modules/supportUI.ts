import {defineField} from 'sanity'
import {LiaHandsHelpingSolid} from 'react-icons/lia'

export default defineField({
  name: 'supportUI',
  title: 'Support UI',
  type: 'object',
  icon: LiaHandsHelpingSolid,
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'localeString',
      description:
        'Expositions, rencontres, événements, restez informés des actualités de la Fondation Henri Cartier-Bresson. ',
    }),
    defineField({
      name: 'subtitle',
      title: 'Sous titre',
      type: 'localeString',
      description:
        'Expositions, rencontres, événements, restez informés des actualités de la Fondation Henri Cartier-Bresson. ',
    }),
    defineField({
      name: 'image',
      type: 'image',
    }),

    defineField({name: 'cta', type: 'cta', title: 'CTA'}),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'image',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title?.fr || 'Support UI',
        subtitle: subtitle?.fr || 'Support UI',
        media: media,
      }
    },
  },
})
