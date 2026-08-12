import {defineField, defineType} from 'sanity'
import {IoPersonOutline} from 'react-icons/io5'
import slug from '../fields/slug'

export default defineType({
  type: 'document',
  name: 'chercheur',
  title: 'Chercheur',
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
      title: 'Nom entier',
      validation: (Rule) => Rule.required(),
      group: 'editorial',
    }),
    defineField({
      name: 'last_name',
      type: 'string',
      title: 'Nom',
      description: 'Utilisé dans les filtres (ex: "Grammont" => G)',
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
  ],
  preview: {
    select: {
      title: 'name',
      slug: 'slug',
    },
    prepare(selection) {
      const {title, slug} = selection
      return {
        title,
        subtitle: 'Chercheur',
      }
    },
  },
})
