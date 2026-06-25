import {defineField, defineType} from 'sanity'
import modulesList from '../objects/modules/modulesList'
import {baseLanguage} from '../locale/supportedLanguages'
import {IoPersonOutline} from 'react-icons/io5'
import slug from '../fields/slug'
import imageFields from '../misc/imageFields'

export default defineType({
  type: 'document',
  name: 'artist',
  title: 'Artist',
  icon: IoPersonOutline,
  groups: [
    {
      default: true,
      name: 'editorial',
      title: 'Editorial',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      name: 'seo',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'name',
      type: 'string',
      title: 'Nom entier',
      group: 'editorial',
    }),

    defineField({
      name: 'last_name',
      type: 'string',
      title: 'Nom',
      description: 'Utilisé dans les filtres',
      group: 'editorial',
    }),
    defineField({
      name: 'first_name',
      type: 'string',
      title: 'Prénom',
      description: 'optionnel',
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

    defineField({
      name: 'text',
      type: 'localeBlockContent',
      group: 'editorial',
    }),

    defineField({
      name: 'modules',
      title: 'Modules',
      description: 'Zone de contenu Modulaire (images, textes, embed)',
      type: 'array',
      of: modulesList,
      group: 'editorial',
      hidde: true,
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
        subtitle: `/artist/${slug.current}`,
        media: image,
      }
    },
  },
})
