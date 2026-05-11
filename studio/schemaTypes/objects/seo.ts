import {defineField} from 'sanity'

export default defineField({
  title: 'SEO',
  name: 'seo',
  type: 'object',
  description: 'Apparence sur les moteurs de recherche (titre, description, image)',
  // options: {
  //   collapsible: true,
  //   // collapsed: true
  //   // columns: 2,
  // },
  fields: [
    defineField({
      name: 'metaTitle',
      type: 'string',
      title: 'Meta title',
      options: {
        source: (doc) => {
          console.log(doc)
          return `${doc.title.en}`
        },
        maxLength: 80,
      },
      validation: (Rule) =>
        Rule.required().min(1).max(80).warning('Un titre pour le moteur de recherche est mieux'),
    }),
    defineField({
      name: 'metaDescription',
      type: 'string',
      title: 'Meta description',
      validation: (Rule) =>
        Rule.required()
          .min(10)
          // .max(160)
          .warning(
            'La méta-description est trop courte (Google tronque généralement les extraits à environ 155-160 caractères)',
          ),
    }),
    defineField({
      name: 'metaImage',
      title: 'Meta image',
      type: 'image',
      validation: (Rule) =>
        Rule.required()
          .custom((image) => {
            if (!image || !image.asset) return true
            const {dimensions} = decodeAssetId(image.asset._ref)
            return dimensions.width < 1200 ? 'Image must be wider' : true
            // return !name.startsWith("https") ? "Please add an image" : true;
          })
          .warning('Image minimum 1200x600px requise'),
    }),
  ],
})

const pattern = /^image-([a-f\d]+)-(\d+x\d+)-(\w+)$/

const decodeAssetId = (id) => {
  const [, assetId, dimensions, format] = pattern.exec(id)
  const [width, height] = dimensions.split('x').map((v) => parseInt(v, 10))

  return {
    assetId,
    dimensions: {width, height},
    format,
  }
}
