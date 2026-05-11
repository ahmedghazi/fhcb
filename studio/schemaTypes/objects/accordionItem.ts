import {defineField, defineType} from 'sanity'
import {toPlainText} from '@portabletext/toolkit'
import {baseLanguage} from '../locale/supportedLanguages'

export default defineType({
  name: 'accordionItem',
  title: 'Accordion Item',
  type: 'object',
  icon: false,

  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'color',
      title: 'color',
      type: 'color',
      // validation: (Rule) => Rule.required(),
      hidden: true,
    }),
    defineField({
      name: 'backgroundColor',
      type: 'color',
    }),
    defineField({
      name: 'foregroundColor',
      type: 'color',
    }),
    defineField({
      name: 'text',
      title: 'text',
      type: 'localeBlockContent',
    }),
  ],
  preview: {
    select: {
      title: `title.${baseLanguage}`,
      text: `text.${baseLanguage}`,
    },
    prepare(selection) {
      const {text, title} = selection
      return {
        title,
        subtitle: text && toPlainText(text),
      }
    },
  },
})
