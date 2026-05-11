import pageModulaire from './documents/pageModulaire'
import artist from './documents/artist'
import event from './documents/event'
import exposition from './documents/exhibition'
import library from './documents/library'
import product from './documents/product'
import tag from './documents/tag'
import settings from './singletons/settings'

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
import imageTextUI from './objects/modules/imageTextUI'
import textSidebarUI from './objects/modules/textSidebarUI'
import listItem from './objects/modules/listItem'
import listUI from './objects/modules/listUI'
import listsUI from './objects/modules/listsUI'
import sliderCardUI from './objects/modules/sliderCardUI'
import gridCardUI from './objects/modules/gridCardUI'
import programmeUI from './objects/modules/programmeUI'

import messageContextuel from './objects/messageContextuel'
import fhcbDate from './objects/fhcbDate'

export const schemaTypes = [
  settings,
  pageModulaire,
  artist,
  event,
  exposition,
  library,
  product,
  tag,

  localeString,
  localeText,
  localeBlockContent,

  seoSchema,
  blockContent,
  linkExternal,
  linkInternal,
  linkIcon,
  contactLinkItem,
  video,
  cta,
  keyVal,
  messageContextuel,
  fhcbDate,

  imagesUI,
  textUI,
  videoUI,
  imageTextUI,
  textSidebarUI,
  listItem,
  listUI,
  listsUI,
  sliderCardUI,
  gridCardUI,
  programmeUI,
]
export default schemaTypes
