import supportedLanguages from './supportedLanguages'

export default {
  name: 'localeText',
  title: 'locale Text',
  type: 'object',
  fieldsets: [
    {
      title: 'Traduction',
      name: 'translations',
      options: {collapsible: true, collapsed: true},
    },
  ],
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: 'text',
    fieldset: lang.isDefault ? null : 'translations',
  })),
}
