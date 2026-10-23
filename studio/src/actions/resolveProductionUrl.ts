import type {DocumentPluginOptions} from 'sanity'
import {SITE_URL, _linkResolver} from './resolveProductionUrlAction'

const resolveProductionUrl: DocumentPluginOptions['productionUrl'] = async (prev, {document}) => {
  const slug = (document as any)?.slug?.current
  if (!slug) return prev

  return `${SITE_URL}${_linkResolver(slug, document._type)}`
}
export default resolveProductionUrl
