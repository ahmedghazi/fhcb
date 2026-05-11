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
      group: 'editorial',
    }),

    defineField({
      name: 'langue',
      type: 'string',
      title: 'Langue',
      group: 'editorial',
    }),

    defineField({
      name: 'prix',
      type: 'string',
      title: 'Prix',
      group: 'editorial',
    }),

    defineField({
      name: 'qty',
      type: 'number',
      title: 'Quantité',
      group: 'editorial',
    }),

    defineField({
      name: 'year',
      type: 'string',
      title: 'Année',
      group: 'editorial',
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
      name: 'metas',
      title: 'fiche technique',
      type: 'array',
      of: [{type: 'keyVal'}],
      // description: 'fiche technique',
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
          to: [
            {type: 'pageModulaire'},
            {type: 'event'},
            {type: 'exhibition'},
            {type: 'product'},
          ],
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
        subtitle: `/project/${slug.current}`,
        media: image,
      }
    },
  },
})
