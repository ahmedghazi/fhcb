import home from './singletons/home'
import pageModulaire from './documents/pageModulaire'
import artist from './documents/artist'
import event from './documents/event'
import exposition from './documents/exhibition'
import library from './singletons/library'
import product from './documents/product'
import tag from './documents/tag'
import tagProduct from './documents/tagProduct'
import settings from './singletons/settings'
import programme from './documents/programme'
import partenaire from './documents/partenaire'
import article from './documents/article'
import imageImages from './documents/imageImages'
import feuilletage from './documents/feuilletage'
import chercheur from './documents/chercheur'
import location from './documents/location'
import rebond from './documents/rebond'

import {seoSchema} from './features/seo'

import localeString from './locale/localeString'
import localeText from './locale/localeText'
import localeBlockContent from './locale/localeBlockContent'

import blockContent from './objects/blockContent'
import blockContentCta from './objects/blockContentCta'
import linkExternal from './objects/linkExternal'
import linkInternal from './objects/linkInternal'
import linkIcon from './objects/linkIcon'
import contactLinkItem from './objects/contactLinkItem'

import cta from './objects/cta'
import keyVal from './objects/keyVal'
import video from './objects/video'
import cardVideoMux from './objects/cardVideoMux'

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
import listFeuilletageUI from './objects/modules/listFeuilletageUI'
import listImageImages from './objects/modules/listImageImages'
import listSerieThematiqueUI from './objects/modules/listSerieThematiqueUI'
import listConversationUI from './objects/modules/listConversationUI'
import listExhibitionsUI from './objects/modules/listExhibitionsUI'
import listExhibitionsPastUI from './objects/modules/listExhibitionsPastUI'
import listExhibitionsEventsUI from './objects/modules/listExhibitionsEventsUI'
import listEventsUI from './objects/modules/listEventsUI'
import supportUI from './objects/modules/supportUI'
import newsletterUI from './objects/modules/newsletterUI'
import listProductUI from './objects/modules/listProductUI'
import ressourcesUI from './objects/modules/ressourcesUI'
import formUI from './objects/modules/formUI'
import blockquoteUI from './objects/modules/blockquoteUI'
import sliderArtistUI from './objects/modules/sliderArtistUI'

/** ui */
import filterSort from './objects/filterSort'
import filterSearch from './objects/filterSearch'
import filterList from './objects/filterList'
import filterCheckbox from './objects/filterCheckbox'
import filterToggle from './objects/filterToggle'
import messageContextuel from './objects/messageContextuel'
import fhcbDate from './objects/fhcbDate'
import imageInGrid from './objects/imageInGrid'
import blockquote from './objects/blockquote'
import embed from './objects/embed'
import keyValGroup from './objects/keyValGroup'
import sidebarGenerique from './objects/sidebarGenerique'
import productVariant from './objects/productVariant'
import serieThematique from './documents/serieThematique'
import conversation from './documents/conversation'
import blockContentCta from './objects/blockContentCta'

export const schemaTypes = [
  settings,
  home,
  pageModulaire,
  artist,
  event,
  exposition,
  tag,
  library,
  product,
  tagProduct,
  programme,
  partenaire,
  article,
  imageImages,
  feuilletage,
  serieThematique,
  conversation,
  chercheur,
  location,
  rebond,

  localeString,
  localeText,
  localeBlockContent,

  seoSchema,
  blockContent,
  blockContentCta,
  blockquote,
  embed,
  linkExternal,
  linkInternal,
  linkIcon,
  contactLinkItem,
  video,
  cardVideoMux,
  imageInGrid,
  cta,
  keyVal,
  keyValGroup,
  filterSort,
  filterSearch,
  filterList,
  filterCheckbox,
  filterToggle,
  messageContextuel,
  fhcbDate,
  sidebarGenerique,
  productVariant,

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
  listFeuilletageUI,
  listImageImages,
  listSerieThematiqueUI,
  listConversationUI,
  listExhibitionsUI,
  listExhibitionsPastUI,
  listExhibitionsEventsUI,
  listEventsUI,
  listProductUI,
  supportUI,
  newsletterUI,
  ressourcesUI,
  formUI,
  blockquoteUI,
  sliderArtistUI,
]
export default schemaTypes
