// import i18n from "../i18n";
// import localizePreview from "../localizePreview";
import {defineField, defineType} from 'sanity'
// import {baseLanguage} from '../locale/supportedLanguages'
// import {FiServer} from 'react-icons/fi'
import modulesList from '../objects/modules/modulesList'
// import {validateSlug} from '../../utils/validateSlug'
import {StackIcon} from '@sanity/icons'
import {baseLanguage} from '../locale/supportedLanguages'
import slug from '../fields/slug'
import imageFields from '../misc/imageFields'

export default defineType({
  name: 'pageModulaire',
  type: 'document',
  title: 'Page Modulaire',
  icon: StackIcon,
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
  preview: {
    select: {
      title: `title.${baseLanguage}`,
      slug: 'slug',
      homePage: 'homePage',
    },
    prepare(selection) {
      const {title, slug, homePage} = selection
      return {
        title: title,
        subtitle: homePage ? "Page d'accueil" : `/${slug.current}`,
      }
    },
  },

  fields: [
    defineField({
      name: 'seo',
      type: 'seo',
      group: 'seo',
    }),

    defineField({
      name: 'homePage',
      type: 'boolean',
      title: "Page d'accueil",
      group: 'editorial',
    }),
    defineField({
      name: 'title',
      type: 'localeString',
      title: 'Titre',
      description: 'Le nom de la page',
      group: 'editorial',
    }),

    slug,

    defineField({
      name: 'imageCover',
      type: 'image',
      title: 'Image de couverture',
      options: {hotspot: true},
      fields: imageFields,
      group: 'editorial',
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'tag'}]}],
      group: 'editorial',
    }),

    defineField({
      name: 'modules',
      title: 'Modules',
      description: 'Zone de contenu Modulaire (images, textes, embed)',
      type: 'array',
      of: modulesList,
      group: 'editorial',
    }),

    defineField({
      name: 'rebonds',
      title: 'Rebonds',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'pageModulaire'}, {type: 'event'}, {type: 'exhibition'}, {type: 'product'}],
        },
      ],
      group: 'editorial',
    }),
  ],
})
