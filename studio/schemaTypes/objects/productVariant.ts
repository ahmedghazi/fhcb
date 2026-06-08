import {defineField, defineType} from 'sanity'

export default defineType({
  type: 'object',
  name: 'productVariant',
  title: 'Variante',
  fields: [
    defineField({
      name: 'shopifyVariantId',
      type: 'string',
      title: 'Shopify Variant ID',
      readOnly: true,
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Titre',
    }),
    defineField({
      name: 'sku',
      type: 'string',
      title: 'SKU',
    }),
    defineField({
      name: 'price',
      type: 'number',
      title: 'Prix',
    }),
    defineField({
      name: 'compareAtPrice',
      type: 'number',
      title: 'Prix barré',
    }),
    defineField({
      name: 'inStock',
      type: 'boolean',
      title: 'En stock',
    }),
    defineField({
      name: 'selectedOptions',
      type: 'array',
      title: 'Options',
      of: [
        {
          type: 'object',
          name: 'selectedOption',
          fields: [
            defineField({name: 'name', type: 'string', title: 'Nom'}),
            defineField({name: 'value', type: 'string', title: 'Valeur'}),
          ],
          preview: {
            select: {name: 'name', value: 'value'},
            prepare({name, value}) {
              return {title: `${name}: ${value}`}
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'title', sku: 'sku', price: 'price', inStock: 'inStock'},
    prepare({title, sku, price, inStock}) {
      return {
        title: title || sku || 'Variante',
        subtitle: [price != null ? `${price} €` : null, inStock ? 'En stock' : 'Rupture']
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
})
