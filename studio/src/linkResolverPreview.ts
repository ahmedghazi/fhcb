import {defineLocations, PresentationPluginOptions} from 'sanity/presentation'

export const linkResolverPreview: PresentationPluginOptions['resolve'] = {
  locations: {
    // Add locations for documents of type 'post'
    pageModulaire: defineLocations({
      // Select one or more fields
      select: {
        title: 'title.fr',
        slug: 'slug.current',
        homePage: 'homePage',
      },
      // Those fields are available in the resolve callback function
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Untitled',
            href: doc?.homePage ? '/' : `/${doc?.slug}`,
          },
        ],
      }),
    }),

    artist: defineLocations({
      // Select one or more fields
      select: {
        title: 'name',
        slug: 'slug.current',
      },
      // Those fields are available in the resolve callback function
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Untitled',
            href: `/artist/${doc?.slug}`,
          },
        ],
      }),
    }),
    exhibition: defineLocations({
      // Select one or more fields
      select: {
        title: 'title.fr',
        slug: 'slug.current',
      },
      // Those fields are available in the resolve callback function
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Untitled',
            href: `/exhibition/${doc?.slug}`,
          },
        ],
      }),
    }),
    event: defineLocations({
      // Select one or more fields
      select: {
        title: 'title.fr',
        slug: 'slug.current',
      },
      // Those fields are available in the resolve callback function
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Untitled',
            href: `/event/${doc?.slug}`,
          },
        ],
      }),
    }),
    product: defineLocations({
      // Select one or more fields
      select: {
        title: 'title.fr',
        slug: 'slug.current',
      },
      // Those fields are available in the resolve callback function
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Untitled',
            href: `/product/${doc?.slug}`,
          },
        ],
      }),
    }),
  },
}
