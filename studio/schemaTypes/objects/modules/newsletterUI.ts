import {defineField} from 'sanity'
import {SiMinutemailer} from 'react-icons/si'

export default defineField({
  name: 'newsletterUI',
  title: 'Newsletter UI',
  type: 'object',
  icon: SiMinutemailer,
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
    defineField({
      name: 'newsletterUrl',
      title: 'Newsletter URL',
      type: 'url',
      hidden: true,
    }),
    defineField({name: 'cta', type: 'cta', title: 'CTA'}),

    // defineField({name: 'cta', type: 'cta', title: 'CTA'}),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'image',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title?.fr || 'Newsletter UI',
        subtitle: subtitle?.fr || 'Newsletter UI',
        media: media,
      }
    },
  },
})
