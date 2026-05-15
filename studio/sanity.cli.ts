import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'e07ih8cz',
    dataset: 'production',
  },

  studioHost: 'backoffice--fhcb',
  deployment: {
    autoUpdates: true,
    appId: 'yzx52u6fz6fzskdvm25eovv5',
  },
  schemaExtraction: {
    enabled: true,
  },
  typegen: {
    path: '../web/app/sanity-api/*.{ts,tsx}',
    generates: '../web/app/sanity-api/types/sanity.types.ts',
    overloadClientMethods: true,
  },
})
