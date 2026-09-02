import {at, defineMigration, set} from 'sanity/migrate'

// These `product` fields were changed from `string` to `localeString` in the
// schema, but documents synced/edited before the change still hold a plain
// string, which the Studio then rejects as an "invalid property value".
const localeStringFields = [
  'title',
  'reliure',
  'dimensions',
  'nombre_de_pages',
  'version_linguistique',
  'pastille',
] as const

const languages = ['fr', 'en'] as const

export default defineMigration({
  title: 'Convert legacy string values to localeString objects on product',
  documentTypes: ['product'],
  migrate: {
    document(doc) {
      const patches = []
      for (const field of localeStringFields) {
        const value = (doc as Record<string, unknown>)[field]
        if (typeof value === 'string') {
          patches.push(
            at(
              field,
              set(Object.fromEntries(languages.map((lang) => [lang, value]))),
            ),
          )
        }
      }
      return patches
    },
  },
})
