import {defineArrayMember, defineField} from 'sanity'

export default {
  name: 'filterDef',
  title: 'Filtre',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: '🔀 Tri', value: 'sort'},
          {title: '🔍 Recherche', value: 'search'},
          {title: '⚪ Radio', value: 'radio'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),

    // ── SORT ──────────────────────────────────────────
    defineField({
      name: 'sortOptions',
      title: 'Options de tri',
      type: 'array',
      hidden: ({parent}: any) => parent?.type !== 'sort',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'field',
              title: 'Champ',
              type: 'string',
              options: {
                list: [
                  // {title: 'Numéro (index)', value: 'index'},
                  {title: 'Titre', value: 'title'},
                  {title: 'Date de début', value: 'dateStart'},
                  {title: 'Date de création', value: '_createdAt'},
                  // {title: 'Intervenant', value: 'speaker'},
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'direction',
              title: 'Direction',
              type: 'string',
              options: {
                list: [
                  {title: '↑ Croissant', value: 'asc'},
                  {title: '↓ Décroissant', value: 'desc'},
                ],
                layout: 'radio',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'localeString',
            }),
          ],
          preview: {
            select: {label: 'label.fr', field: 'field', direction: 'direction'},
            prepare({label, field, direction}: any) {
              return {title: label || `${field} ${direction}`}
            },
          },
        }),
      ],
    }),

    // ── SEARCH ────────────────────────────────────────
    defineField({
      name: 'searchIn',
      title: 'Champs de recherche',
      type: 'array',
      hidden: ({parent}: any) => parent?.type !== 'search',
      of: [defineArrayMember({type: 'string'})],
      options: {
        list: [
          {title: 'Titre', value: 'title'},
          {title: 'Sous-titre', value: 'subTitle'},
          // {title: 'Numéro (index)', value: 'index'},
          {title: 'Tags', value: 'tags'},
          {title: 'Artistes', value: 'artists'},
          // {title: 'Intervenant', value: 'speaker'},
        ],
      },
    }),

    // ── RADIO ─────────────────────────────────────────
    defineField({
      name: 'radioKey',
      title: 'Clé du filtre',
      type: 'string',
      hidden: ({parent}: any) => parent?.type !== 'radio',
      description: 'Identifiant interne (ex: artist, tag)',
      validation: (Rule) =>
        Rule.custom((val, ctx: any) => ctx.parent?.type !== 'radio' || !!val || 'Requis'),
    }),
    defineField({
      name: 'radioLabel',
      title: 'Label du groupe',
      type: 'localeString',
      hidden: ({parent}: any) => parent?.type !== 'radio',
    }),
    defineField({
      name: 'radioOptions',
      title: 'Options',
      type: 'array',
      hidden: ({parent}: any) => parent?.type !== 'radio',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              title: 'Valeur (slug/id)',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({name: 'label', title: 'Label', type: 'localeString'}),
          ],
          preview: {
            select: {label: 'label.fr', value: 'value'},
            prepare({label, value}: any) {
              return {title: label || value}
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {type: 'type'},
    prepare({type}: any) {
      const map: Record<string, string> = {
        sort: '🔀 Tri',
        search: '🔍 Recherche',
        radio: '⚪ Radio',
      }
      return {title: map[type] || type}
    },
  },
}
