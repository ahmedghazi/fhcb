import {defineConfig, isDev} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {presentationTool} from 'sanity/presentation'
import {colorInput} from '@sanity/color-input'
import {muxInput} from 'sanity-plugin-mux-input'
import {linkResolverPreview} from './src/linkResolverPreview'
import {structure} from './src/deskStructure'
import {media} from 'sanity-plugin-media'
import {frFRLocale} from '@sanity/locale-fr-fr'

const remoteURL = 'https://fhcb-preprod.vercel.app'
const localURL = 'http://localhost:3000'
const previewURL = window.location.hostname === 'localhost' ? localURL : remoteURL
const plugins = [
  frFRLocale(),
  structureTool({structure}),
  presentationTool({
    title: 'Live preview',
    resolve: linkResolverPreview,
    previewUrl: {
      origin: previewURL,
      previewMode: {
        enable: '/preview/enable',
        disable: '/preview/disable',
      },
    },
  }),
  media(),
  muxInput(),
  colorInput(),
]
if (isDev) plugins.push(visionTool())

export default defineConfig({
  name: 'default',
  title: 'Backoffice FHCB',

  projectId: 'e07ih8cz',
  dataset: 'production',

  plugins: plugins,

  schema: {
    types: schemaTypes,
  },
})
