import {LaunchIcon} from '@sanity/icons'
import type {DocumentActionComponent} from 'sanity'

const remoteURL = 'https://fhcb-preprod.vercel.app'
const localURL = 'http://localhost:3000'
export const SITE_URL = window.location.hostname === 'localhost' ? localURL : remoteURL

export const _linkResolver = (slug: string, type: string) => {
  switch (type) {
    case 'programme':
      return `/programme/${slug}`
    case 'exhibition':
      return `/exhibition/${slug}`
    case 'event':
      return `/event/${slug}`
    case 'artist':
      return `/artist/${slug}`
    case 'library':
      return `/${slug}`
    case 'product':
      return `/publications/${slug}`
    case 'imageImages':
      return `/image-images/${slug}`
    case 'feuilletage':
      return `/feuilletage/${slug}`
    case 'serieThematique':
      return `/serie-thematique/${slug}`
    case 'conversation':
      return `/conversation/${slug}`
    case 'article':
      return `/article/${slug}`

    default:
      return `/${slug}`
  }
}

export const resolveProductionUrlAction: DocumentActionComponent = (props) => {
  const doc = (props.published || props.draft) as any
  const slug = doc?.slug?.current

  return {
    label: 'Voir sur le site',
    icon: LaunchIcon,
    disabled: !props.published || !slug,
    title: !props.published ? 'Document non publié' : undefined,
    onHandle: () => {
      window.open(`${SITE_URL}${_linkResolver(slug, props.type)}`, '_blank')
      props.onComplete()
    },
  }
}
