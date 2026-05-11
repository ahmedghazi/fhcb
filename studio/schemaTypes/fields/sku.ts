import {defineField} from 'sanity'
import {client} from '../../sanity-client'

const isUniqueSKU = async (sku: string | any, context: any) => {
  const {document} = context

  const id = document._id.replace(/^drafts\./, '')

  const params = {
    draft: `drafts.${id}`,
    published: id,
    sku: sku,
  }

  /* groq */
  const query = `!defined(*[
    _type == 'product' &&
    !(_id in [$draft, $published]) &&
    sku == $sku
  ][0]._id)`

  return client.fetch(query, params)
}

export default defineField({
  title: 'SKU',
  name: 'sku',
  type: 'string',
  group: 'shop',
  description: 'default sku if no variants',
  validation: (Rule) =>
    Rule.custom(async (value, context) => {
      const isUnique = await isUniqueSKU(value, context)
      if (!isUnique) return 'SKU is already used'
      return true
    }),
})
