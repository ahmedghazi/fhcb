import {defineField, defineType} from 'sanity'
import {SeoInput} from './components/SeoInput'

export const seoSchema = defineType({
  name: 'seo',
  type: 'object',
  title: 'SEO',
  components: {input: SeoInput},
  fields: [
    defineField({
      name: 'metaTitle',
      type: 'string',
      title: 'Meta Title',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'metaDescription',
      type: 'string',
      title: 'Meta Description',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'metaImage',
      type: 'image',
      title: 'Meta Image',
    }),
  ],
})
