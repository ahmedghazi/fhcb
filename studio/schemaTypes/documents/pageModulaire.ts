import {defineField, defineType} from 'sanity'
import {FiServer} from 'react-icons/fi'
import modulesList from '../objects/modules/modulesList'
import {baseLanguage} from '../locale/supportedLanguages'
import slug from '../fields/slug'
import {SiElasticstack} from 'react-icons/si'
import rebondsLabels from '../misc/rebondsLabels'
import rebondsTypeField from '../misc/rebondsTypeField'

const BRANCHES_RESSOURCES_TAG_ID = 'e9f34dd4-cc69-4ef2-83a7-71b38a79741f'

const hasTag = (document: Record<string, unknown> | undefined, tagId: string) =>
  (document?.tags as {_ref?: string}[] | undefined)?.some((tag) => tag._ref === tagId) ?? false

export default defineType({
  name: 'pageModulaire',
  type: 'document',
  title: 'Page Modulaire',
  icon: SiElasticstack,
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
      media: 'imageCover',
    },
    prepare(selection) {
      const {title, slug, media} = selection
      return {
        title: title,
        subtitle: `/${slug.current}`,
        media: media,
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
      // fields: imageFields,
      group: 'editorial',
      hidden: ({document}) => hasTag(document, BRANCHES_RESSOURCES_TAG_ID),
    }),

    defineField({
      name: 'videoCover',
      type: 'mux.video',
      title: 'Video de couverture',
      group: 'editorial',
      hidden: ({document}) => !hasTag(document, BRANCHES_RESSOURCES_TAG_ID),
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
      name: 'rebondsLabel',
      type: 'string',
      options: {
        list: rebondsLabels,
      },
      group: 'editorial',
    }),
    defineField({
      name: 'rebondsLabelLibre',
      type: 'localeString',
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

    rebondsTypeField,
  ],
})
