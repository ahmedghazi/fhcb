import home from './singletons/home'
import pageModulaire from './documents/pageModulaire'
import artist from './documents/artist'
import event from './documents/event'
import exposition from './documents/exhibition'
import library from './singletons/library'
import product from './documents/product'
import tag from './documents/tag'
import settings from './singletons/settings'
import programme from './documents/programme'
import partenaire from './documents/partenaire'
import article from './documents/article'
import imageImages from './documents/imageImages'

import {seoSchema} from './features/seo'

import localeString from './locale/localeString'
import localeText from './locale/localeText'
import localeBlockContent from './locale/localeBlockContent'

import blockContent from './objects/blockContent'
import linkExternal from './objects/linkExternal'
import linkInternal from './objects/linkInternal'
import linkIcon from './objects/linkIcon'
import contactLinkItem from './objects/contactLinkItem'

import cta from './objects/cta'
import keyVal from './objects/keyVal'
import video from './objects/video'

/** modules */
import imagesUI from './objects/modules/imagesUI'
import textUI from './objects/modules/textUI'
import videoUI from './objects/modules/videoUI'
import textImageUI from './objects/modules/textImageUI'
import textSidebarUI from './objects/modules/textSidebarUI'
import listItem from './objects/modules/listItem'
import listUI from './objects/modules/listUI'
import listsUI from './objects/modules/listsUI'
import sliderCardUI from './objects/modules/sliderCardUI'
import gridCardUI from './objects/modules/gridCardUI'
import programmeUI from './objects/modules/programmeUI'
import newsCardUI from './objects/modules/newsCardUI'
import featuredCardsUI from './objects/modules/featuredCardsUI'

import messageContextuel from './objects/messageContextuel'
import fhcbDate from './objects/fhcbDate'
import imageInGrid from './objects/imageInGrid'
import blockquote from './objects/blockquote'
import embed from './objects/embed'
import keyValGroup from './objects/keyValGroup'
import sidebarGenerique from './objects/sidebarGenerique'

export const schemaTypes = [
  settings,
  home,
  pageModulaire,
  artist,
  event,
  exposition,
  library,
  product,
  tag,
  programme,
  partenaire,
  article,
  imageImages,

  localeString,
  localeText,
  localeBlockContent,

  seoSchema,
  blockContent,
  blockquote,
  embed,
  linkExternal,
  linkInternal,
  linkIcon,
  contactLinkItem,
  video,
  imageInGrid,
  cta,
  keyVal,
  keyValGroup,
  messageContextuel,
  fhcbDate,
  sidebarGenerique,

  imagesUI,
  textUI,
  videoUI,
  textImageUI,
  textSidebarUI,
  listItem,
  listUI,
  listsUI,
  sliderCardUI,
  gridCardUI,
  programmeUI,
  newsCardUI,
  featuredCardsUI,
]
export default schemaTypes
