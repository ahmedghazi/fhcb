import {defineField} from 'sanity'

export {seoSchema} from './schema'

// Helper pour ajouter le champ dans n'importe quel document
export const seoField = defineField({
  name: 'seo',
  type: 'seo',
  title: 'SEO',
  group: 'seo', // optionnel, si tu utilises des groupes
})

// Helper pour déclarer le groupe (à spread dans fieldGroups du document)
export const seoGroup = {
  name: 'seo',
  title: 'SEO',
}
