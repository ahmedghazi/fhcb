import {CogIcon} from '@sanity/icons'
import {defineType, defineField} from 'sanity'
import linkInternalTypes from '../misc/linkInternalTypes'

export default defineType({
  name: 'settings',
  title: 'Réglages (header, footer, ...)',
  type: 'document',
  icon: CogIcon,
  groups: [
    {
      name: 'seo',
      title: 'Default SEO',
    },
    {
      default: true,
      name: 'header',
      title: 'Header',
    },
    {
      name: 'footer',
      title: 'Footer',
    },
    {
      name: 'bandeau',
      title: 'Bandeau contextuel',
    },
    {
      name: 'misc',
      title: 'Misc',
    },
    {
      name: 'design',
      title: 'Design',
    },
  ],
  fields: [
    defineField({
      name: 'siteName',
      title: 'Nom du site',
      type: 'string',
      group: 'header',
    }),

    defineField({
      name: 'navPrimary',
      title: 'Naviguation Primary',
      type: 'array',
      of: [
        {
          type: 'linkInternal',
        },
        {
          type: 'linkExternal',
        },
      ],
      group: 'header',
    }),
    defineField({
      name: 'navSocial',
      title: 'Naviguation Social',
      type: 'array',
      of: [
        {
          type: 'linkIcon',
        },
      ],
      group: 'header',
    }),
    defineField({
      name: 'btnTickets',
      title: 'Bouton billeterie',
      type: 'linkExternal',
      group: 'header',
    }),
    defineField({
      name: 'btnLibrary',
      title: 'Bouton librairie',
      type: 'linkInternal',
      group: 'header',
    }),
    defineField({
      name: 'mostSearched',
      title: 'Résultats de recherche mis en avant',
      type: 'array',
      of: [{type: 'reference', to: linkInternalTypes}],
      group: 'header',
    }),
    defineField({
      name: 'navSecondary',
      title: 'Naviguation Secondary',
      type: 'array',
      of: [
        {
          type: 'linkInternal',
        },
        {
          type: 'linkExternal',
        },
      ],
      group: 'footer',
    }),

    defineField({
      name: 'siteDescription',
      title: 'Description du site',
      type: 'localeBlockContent',
      group: 'footer',
    }),
    defineField({
      name: 'baseline',
      title: 'Baseline',
      type: 'localeBlockContent',
      group: 'footer',
    }),
    defineField({
      name: 'contact',
      title: 'Contact',
      type: 'string',
      group: 'footer',
    }),
    defineField({
      name: 'labelNewsletter',
      title: 'Label newsletter',
      type: 'localeString',
      group: 'footer',
    }),
    defineField({
      name: 'msgNewsletter',
      title: 'Message newsletter',
      type: 'localeText',
      group: 'footer',
    }),

    defineField({
      name: 'bandeauContextuel',
      title: 'Bandeau contextuel',
      type: 'object',
      group: 'bandeau',
      fields: [
        defineField({
          name: 'display',
          title: 'Afficher',
          type: 'boolean',
        }),
        defineField({
          name: 'text',
          title: 'Texte',
          type: 'localeString',
        }),
        defineField({
          name: 'link',
          title: 'Lien interne',
          type: 'linkInternal',
        }),
        defineField({
          name: 'linkExternal',
          title: 'Lien externe',
          type: 'linkExternal',
        }),
        defineField({
          name: 'dateExpiration',
          title: "Date d'expiration",
          type: 'date',
        }),
      ],
    }),

    defineField({
      name: 'message404',
      title: 'Message 404',
      type: 'blockContent',
      group: 'misc',
    }),

    defineField({
      name: 'customCss',
      type: 'text',
      group: 'design',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Réglages (header, footer, ...)',
      }
    },
  },
})
