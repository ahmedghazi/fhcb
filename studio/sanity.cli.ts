import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'e07ih8cz',
    dataset: 'production',
  },

  studioHost: 'backoffice--fhcb',
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
    appId: 'yzx52u6fz6fzskdvm25eovv5',
  },
  schemaExtraction: {
    enabled: true,
  },
  typegen: {
    path: '../web/app/utils/sanity-api/*.ts',
    generates: '../web/app/utils/sanity-api/sanity.types.ts',
    overloadClientMethods: true,
  },
})
