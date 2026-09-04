import {defineField, defineType} from 'sanity'
import {baseLanguage} from '../locale/supportedLanguages'
import {LuGalleryHorizontal} from 'react-icons/lu'
import slug from '../fields/slug'
import modulesListExhibitionEvent from '../objects/modules/modulesListExhibitionEvent'
import rebondsAutoField from '../misc/rebondsAutoField'

export default defineType({
  type: 'document',
  name: 'exhibition',
  title: 'Exposition',
  icon: LuGalleryHorizontal,
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
  // orderings: [
  //   {
  //     title: 'Trier par theme ASC',
  //     name: 'themeAsc',
  //     by: [{field: 'tagType', direction: 'asc'}],
  //   },
  //   {
  //     title: 'Trier par theme DESC',
  //     name: 'themeDesc',
  //     by: [{field: 'tagType', direction: 'desc'}],
  //   },
  // ],
  initialValue: {
    location: 'inside',
  },
  fields: [
    defineField({
      name: 'seo',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      group: 'editorial',
    }),
    slug,
    defineField({
      name: 'imageCover',
      type: 'image',
      title: 'Image clef',
      // fields: imageFields,

      description: 'Visible sur les pages de liste (largeur 1400px)',
      group: 'editorial',
    }),
    defineField({
      name: 'links',
      title: 'Liens',
      description: 'Tickets, ...',
      type: 'array',
      of: [{type: 'linkExternal'}],
      group: 'editorial',
      hidden: true,
    }),

    defineField({
      name: 'artists',
      title: 'Artiste(s)',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'artist'}]}],
      group: 'editorial',
    }),
    defineField({
      name: 'prix',
      title: "Prix si associé à l'exposition",
      type: 'array',
      of: [{type: 'reference', to: [{type: 'prix'}]}],
      group: 'editorial',
    }),

    defineField({
      name: 'dates',
      type: 'array',
      title: 'Date(s) et lieu(x)',
      group: 'editorial',
      of: [{type: 'fhcbDate'}],
    }),
    defineField({
      name: 'linkTickets',
      title: 'Lien de billetterie',
      type: 'url',
      group: 'editorial',
    }),
    defineField({
      name: 'countdown',
      title: 'Compte à rebours',
      description: 'Sert en homePage pour faire passer une expo en zone actu ou zone mise en avant',
      type: 'number',
      group: 'editorial',
      readOnly: true,
    }),
    defineField({
      name: 'location',
      title: 'Lieux',
      type: 'string',
      hidden: true,
      options: {
        list: [
          {title: 'À la fondation', value: 'inside'},
          {title: 'À la fondation Cube', value: 'inside-cube'},
          {title: 'À la fondation Tube', value: 'inside-tube'},
          {title: 'Hors les murs', value: 'outside'},
          {title: 'Itinérante', value: 'itinerant'},
        ],
      },
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
          options: {
            filter: 'tagType == "exhibition"',
          },
        },
      ],
      group: 'editorial',
    }),

    defineField({
      name: 'pastille',
      type: 'localeString',
      group: 'editorial',
      hidden: true,
    }),
    defineField({
      name: 'color',
      type: 'color',
      title: 'Couleur',
      description: 'Pour les expos en cours',
      group: 'editorial',
      hidden: ({parent}) =>
        parent?.location !== 'inside' &&
        parent?.location !== 'inside-cube' &&
        parent?.location !== 'inside-tube',
    }),

    defineField({
      name: 'modules',
      title: 'Modules',
      description: 'Zone de contenu Modulaire (images, textes, embed)',
      type: 'array',
      of: modulesListExhibitionEvent,
      group: 'editorial',
    }),
    /*
    Citation, texte + sidebar générique + images UI, Vidéo UI
    */

    defineField({
      name: 'aroundTheExhibition',
      title: "Autour de l'exposition",
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            {type: 'pageModulaire'},
            {type: 'event'},
            // {type: 'exhibition'},
            {type: 'artist'},
            {type: 'imageImages'},
            {type: 'feuilletage'},
            {type: 'serieThematique'},
            {type: 'product'},
          ],
        },
      ],
      group: 'editorial',
      hidden: true,
    }),

    rebondsAutoField,
  ],

  preview: {
    select: {
      title: `title.${baseLanguage}`,
      subtitle: 'slug.current',
      image: 'imageCover',
      tag: `tags.0.title.${baseLanguage}`,
    },
    prepare(selection) {
      const {title, subtitle, image, tag} = selection
      // console.log(images)
      return {
        title: `${title} [${tag.replace('Exposition ', '')}]`,
        subtitle: `/exhibition/${subtitle}`,
        media: image,
      }
    },
  },
})
