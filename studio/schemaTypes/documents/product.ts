import {defineField, defineType} from 'sanity'
import modulesList from '../objects/modules/modulesList'
import {baseLanguage} from '../locale/supportedLanguages'
import slug from '../fields/slug'
import {BiLogoShopify} from 'react-icons/bi'

export default defineType({
  type: 'document',
  name: 'product',
  title: 'Produit',
  icon: BiLogoShopify,
  groups: [
    {
      default: true,
      name: 'editorial',
      title: 'Editorial',
    },
    {
      name: 'metas',
      title: 'metas',
    },
    {
      name: 'shop',
      title: 'shop',
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
      name: 'title',
      type: 'localeString',
      title: 'Titre',
      group: 'editorial',
    }),
    slug,

    defineField({
      name: 'shopifyId',
      type: 'string',
      title: 'Shopify ID',
      readOnly: true,
      group: 'shop',
    }),

    defineField({
      name: 'shopifyHandle',
      type: 'string',
      title: 'Shopify Handle',
      readOnly: true,
      group: 'shop',
    }),

    defineField({
      name: 'price',
      type: 'number',
      title: 'Prix',
      group: 'shop',
    }),

    defineField({
      name: 'compareAtPrice',
      type: 'number',
      title: 'Prix barré',
      group: 'shop',
    }),

    defineField({
      name: 'inStock',
      type: 'boolean',
      title: 'En stock',
      group: 'shop',
    }),

    defineField({
      name: 'totalInventory',
      type: 'number',
      title: 'Inventaire total',
      readOnly: true,
      group: 'shop',
    }),

    defineField({
      name: 'variants',
      type: 'array',
      title: 'Variantes',
      of: [{type: 'productVariant'}],
      group: 'shop',
    }),

    defineField({
      name: 'syncedAt',
      type: 'datetime',
      title: 'Dernière synchro Shopify',
      readOnly: true,
      group: 'shop',
    }),

    defineField({
      name: 'artist',
      title: 'Artiste',
      type: 'reference',
      to: [{type: 'artist'}],
      group: 'editorial',
    }),

    defineField({
      name: 'subTitle',
      type: 'string',
      title: 'Soustitre',
      group: 'editorial',
    }),

    defineField({
      name: 'editeur',
      type: 'string',
      title: 'Éditeur',
      group: 'metas',
    }),

    defineField({
      name: 'isbn',
      type: 'string',
      title: 'ISBN',
      readOnly: true,
      group: 'metas',
    }),

    defineField({
      name: 'languages',
      type: 'array',
      of: [{type: 'string'}],
      title: 'Langues',
      group: 'metas',
    }),

    defineField({
      name: 'publicationDate',
      type: 'date',
      title: 'Date de parution',
      group: 'metas',
    }),

    defineField({
      name: 'metas',
      title: 'fiche technique',
      description: 'liste titre + text',
      type: 'array',
      of: [{type: 'keyVal'}],
      // description: 'fiche technique',
      group: 'metas',
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'tag'}],
        },
      ],
      group: 'editorial',
    }),

    defineField({
      name: 'imageCover',
      type: 'image',
      title: 'Image clef',
      description: 'Visible on liste pages, project cards (largeur 1400px)',
      options: {hotspot: true},
      mediaTags: ['product'],
      // fields: imageFields,

      group: 'editorial',
    }),

    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      group: 'editorial',
    }),

    defineField({
      name: 'chapo',
      title: 'Chapo',
      type: 'localeBlockContent',
      group: 'editorial',
    }),

    defineField({
      name: 'text',
      title: 'Texte',
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

    // defineField({
    //   name: 'relatedProjects',
    //   title: 'Projets liés',
    //   type: 'array',
    //   of: [{type: 'reference', to: [{type: 'project'}]}],
    //   group: 'editorial',
    // }),
  ],

  preview: {
    select: {
      title: `title.${baseLanguage}`,
      slug: 'slug',
      image: 'imageCover',
    },
    prepare(selection) {
      const {title, slug, image} = selection
      // console.log(images)
      return {
        title: title,
        subtitle: `/product/${slug.current}`,
        media: image,
      }
    },
  },
})
