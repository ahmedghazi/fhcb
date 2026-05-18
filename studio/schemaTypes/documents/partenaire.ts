import {defineField, defineType} from 'sanity'
import modulesList from '../objects/modules/modulesList'
import {baseLanguage} from '../locale/supportedLanguages'
import {IoPersonOutline} from 'react-icons/io5'
import slug from '../fields/slug'
import imageFields from '../misc/imageFields'

export default defineType({
  type: 'document',
  name: 'partenaire',
  title: 'Partenaire',
  icon: IoPersonOutline,
  groups: [
    {
      default: true,
      name: 'editorial',
      title: 'Editorial',
    },
  ],
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Nom',
      description: 'Visible seulement en backoffice',
      group: 'editorial',
    }),
    defineField({
      name: 'text',
      type: 'localeText',
      title: 'Mention partenariale',
      group: 'editorial',
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      description:
        'Cliquez sur "Générer" — identifiant unique de la page, uniquement des lettres minuscules, chiffres et tirets (sans espaces ni caractères spéciaux)',
      options: {
        source: `name`,
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      group: 'editorial',
    }),

    defineField({
      name: 'imageCover',
      type: 'image',
      title: 'Image de couverture',
      options: {hotspot: true},
      // fields: imageFields,

      group: 'editorial',
    }),
  ],

  preview: {
    select: {
      title: `name`,
      slug: 'slug',
      image: 'imageCover',
    },
    prepare(selection) {
      const {title, slug, image} = selection
      // console.log(images)
      return {
        title: title,
        subtitle: `/partenaire/${slug.current}`,
        media: image,
      }
    },
  },
})
