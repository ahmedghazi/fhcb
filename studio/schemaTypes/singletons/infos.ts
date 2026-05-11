import {defineField, defineType} from 'sanity'
import modulesList from '../objects/modules/modulesList'
import {InfoOutlineIcon} from '@sanity/icons'
import {baseLanguage} from '../locale/supportedLanguages'

export default defineType({
  name: 'infos',
  title: 'Infos',
  type: 'document',
  icon: InfoOutlineIcon,
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
      title: 'Title',
      type: 'localeString',
      group: 'editorial',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL based on the title (no space, or char other than a-z-0-9',
      options: {
        source: `title.${baseLanguage}`,
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
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
    // defineField({
    //   name: 'bio',
    //   title: 'Bio',
    //   type: 'localeBlockContent',
    //   group: 'editorial',
    // }),
    // defineField({
    //   name: 'image',
    //   title: 'Image',
    //   type: 'image',
    //   group: 'editorial',
    // }),
    // defineField({
    //   name: 'cv',
    //   title: 'CV',
    //   type: 'array',
    //   of: [{type: 'keyValGroup'}],
    //   group: 'editorial',
    // }),
  ],
  preview: {
    select: {
      title: `title.${baseLanguage}`,
    },
    prepare(selection) {
      const {title} = selection
      // console.log(images)
      return {
        title: title,
      }
    },
  },
})
