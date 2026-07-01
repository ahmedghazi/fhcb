import {defineLocations, PresentationPluginOptions} from 'sanity/presentation'
import feuilletage from '../schemaTypes/documents/feuilletage'

export const linkResolverPreview: PresentationPluginOptions['resolve'] = {
  locations: {
    // Add locations for documents of type 'post'
    home: defineLocations({
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
            href: '/',
          },
        ],
      }),
    }),

    pageModulaire: defineLocations({
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
            href: `/${doc?.slug}`,
          },
        ],
      }),
    }),
    article: defineLocations({
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
            href: `/article/${doc?.slug}`,
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
    programme: defineLocations({
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
            href: `/programme/${doc?.slug}`,
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
    library: defineLocations({
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
            href: `/${doc?.slug}`,
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
    imageImages: defineLocations({
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
            href: `/image-images/${doc?.slug}`,
          },
        ],
      }),
    }),
    feuilletage: defineLocations({
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
            href: `/feuilletage/${doc?.slug}`,
          },
        ],
      }),
    }),

    conversation: defineLocations({
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
            href: `/conversation/${doc?.slug}`,
          },
        ],
      }),
    }),
  },
}
