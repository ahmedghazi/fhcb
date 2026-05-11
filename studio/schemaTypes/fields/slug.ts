import {defineField} from 'sanity'
import {baseLanguage} from '../locale/supportedLanguages'

export default defineField({
  name: 'slug',
  title: 'Slug (URL)',
  type: 'slug',
  description:
    'Cliquez sur "Générer" — identifiant unique de la page, uniquement des lettres minuscules, chiffres et tirets (sans espaces ni caractères spéciaux)',
  options: {
    source: `title.${baseLanguage}`,
    maxLength: 96,
  },
  validation: (Rule) => Rule.required(),
  group: 'editorial',
})
