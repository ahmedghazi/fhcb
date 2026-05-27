import {defineField, defineType} from 'sanity'
import {baseLanguage} from '../locale/supportedLanguages'
import slug from '../fields/slug'
import {FiBookOpen} from 'react-icons/fi'

export default defineType({
  type: 'document',
  name: 'feuilletage',
  title: 'Feuilletage',
  icon: FiBookOpen,
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
      name: 'speaker',
      type: 'string',
      title: 'Intervenant',
      description: "Le nom de l'intervenant-e",
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
      name: 'modules',
      title: 'Modules',
      description: 'Zone de contenu Modulaire (images, textes)',
      type: 'array',
      of: [{type: 'imagesUI'}, {type: 'textSidebarUI'}],
      group: 'editorial',
    }),

    defineField({
      name: 'prev',
      type: 'reference',
      to: [{type: 'imageImages'}],
      group: 'editorial',
    }),
    defineField({
      name: 'next',
      type: 'reference',
      to: [{type: 'imageImages'}],
      group: 'editorial',
    }),
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
        subtitle: `/feuilletage/${slug.current}`,
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
