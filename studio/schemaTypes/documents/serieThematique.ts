import {defineField, defineType} from 'sanity'
import {baseLanguage} from '../locale/supportedLanguages'
import slug from '../fields/slug'
import {TbArticle} from 'react-icons/tb'
import rebondsAutoField from '../misc/rebondsAutoField'

export default defineType({
  type: 'document',
  name: 'serieThematique',
  title: 'Série thématique',
  icon: TbArticle,
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
      name: 'index',
      type: 'string',
      title: 'Index',
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
      name: 'chercheur',
      title: 'Chercheur',
      type: 'reference',
      to: [{type: 'chercheur'}],
      group: 'editorial',
    }),

    defineField({
      name: 'imageCover',
      type: 'image',
      title: 'Image de couverture',
      options: {hotspot: true},
      group: 'editorial',
    }),

    defineField({
      name: 'video',
      type: 'video',
      title: 'Vidéo',
      group: 'editorial',
    }),

    defineField({
      name: 'artists',
      title: 'Artiste(s)',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'artist'}]}],
      group: 'editorial',
    }),
    defineField({
      name: 'exhibition',
      title: 'Exposition',
      type: 'reference',
      to: [{type: 'exhibition'}],
      group: 'editorial',
    }),

    defineField({
      name: 'modules',
      title: 'Modules',
      description: 'Zone de contenu Modulaire (images, textes)',
      type: 'array',
      of: [{type: 'imagesUI'}, {type: 'textSidebarUI'}],
      group: 'editorial',
    }),

    defineField({
      name: 'rebonds',
      title: 'Rebonds',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'imageImages'}],
        },
      ],
      group: 'editorial',
    }),
    rebondsAutoField,
  ],

  preview: {
    select: {
      title: `title.${baseLanguage}`,
      index: 'index',
      slug: 'slug',
      image: 'imageCover',
    },
    prepare(selection) {
      const {title, index, slug, image} = selection
      // console.log(images)
      return {
        title: `#${index} - ${title}`,
        subtitle: `/serie-thematique/${slug.current}`,
        media: image,
      }
    },
  },
  orderings: [
    {
      title: 'Trier par index ASC',
      name: 'indexAsc',
      by: [{field: 'index', direction: 'asc'}],
    },
    {
      title: 'Trier par index DESC',
      name: 'indexDesc',
      by: [{field: 'index', direction: 'desc'}],
    },
  ],
})
