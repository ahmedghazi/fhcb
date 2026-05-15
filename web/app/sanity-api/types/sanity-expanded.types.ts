// AUTO-GENERATED EXTENDED TYPES - DO NOT EDIT MANUALLY
// Generated on: 2026-05-15T13:50:51.597Z
// Run 'npm run typegen' to regenerate
// Project structure: web="../../web", studio="./"
// Detection method: configuration file

import type {
  Settings,
  Exhibition,
  PageModulaire,
  Tag,
  Artist,
  Product,
  Event,
  Library,
  SETTINGS_QUERY_RESULT,
  HOME_QUERY_RESULT,
  PAGE_MODULAIRE_QUERY_RESULT,
  ARTIST_QUERY_RESULT,
  Project,
  SanityImageAsset
} from './sanity.types'

export type ArtistExpanded = Omit<Artist, 'imageCover'> & {
  imageCover?: (Omit<NonNullable<NonNullable<Artist>['imageCover']>, 'asset'> & { asset?: SanityImageAsset | null }) | null;
};

export type ExhibitionExpanded = Omit<Exhibition, 'artists' | 'tags' | 'rebonds' | 'imageCover'> & {
  artists?: Array<ArtistExpanded> | null;
  tags?: Array<Tag> | null;
  rebonds?: ExhibitionExpanded | null;
  imageCover?: (Omit<NonNullable<NonNullable<Exhibition>['imageCover']>, 'asset'> & { asset?: SanityImageAsset | null }) | null;
};

export type SettingsExpanded = Omit<Settings, 'mostSearched'> & {
  mostSearched?: ExhibitionExpanded | null;
};

export type PageModulaireExpanded = Omit<PageModulaire, 'tags' | 'rebonds' | 'imageCover'> & {
  tags?: Array<Tag> | null;
  rebonds?: ExhibitionExpanded | null;
  imageCover?: (Omit<NonNullable<NonNullable<PageModulaire>['imageCover']>, 'asset'> & { asset?: SanityImageAsset | null }) | null;
};

export type ProductExpanded = Omit<Product, 'artist' | 'tags' | 'rebonds' | 'imageCover' | 'images'> & {
  artist?: ArtistExpanded | null;
  tags?: Array<Tag> | null;
  rebonds?: ExhibitionExpanded | null;
  imageCover?: (Omit<NonNullable<NonNullable<Product>['imageCover']>, 'asset'> & { asset?: SanityImageAsset | null }) | null;
  images?: (Omit<NonNullable<NonNullable<Product>['images']>, 'asset'> & { asset?: SanityImageAsset | null }) | null;
};

export type EventExpanded = Omit<Event, 'artists' | 'tags' | 'rebonds' | 'imageCover'> & {
  artists?: Array<ArtistExpanded> | null;
  tags?: Array<Tag> | null;
  rebonds?: ExhibitionExpanded | null;
  imageCover?: (Omit<NonNullable<NonNullable<Event>['imageCover']>, 'asset'> & { asset?: SanityImageAsset | null }) | null;
};

export type LibraryExpanded = Omit<Library, 'miseEnAvant' | 'sliderSelection' | 'items' | 'imageCover'> & {
  miseEnAvant?: Array<ProductExpanded> | null;
  sliderSelection?: Array<ProductExpanded> | null;
  items?: Array<ProductExpanded> | null;
  imageCover?: (Omit<NonNullable<NonNullable<Library>['imageCover']>, 'asset'> & { asset?: SanityImageAsset | null }) | null;
};

export type SETTINGS_QUERY_RESULTExpanded = Omit<SETTINGS_QUERY_RESULT, 'mostSearched'> & {
  mostSearched?: ExhibitionExpanded | null;
};

export type HOME_QUERY_RESULTExpanded = Omit<HOME_QUERY_RESULT, 'tags' | 'rebonds' | 'imageCover'> & {
  tags?: Array<Tag> | null;
  rebonds?: ExhibitionExpanded | null;
  imageCover?: (Omit<NonNullable<NonNullable<HOME_QUERY_RESULT>['imageCover']>, 'asset'> & { asset?: SanityImageAsset | null }) | null;
};

export type PAGE_MODULAIRE_QUERY_RESULTExpanded = Omit<PAGE_MODULAIRE_QUERY_RESULT, 'tags' | 'rebonds' | 'imageCover'> & {
  tags?: Array<Tag> | null;
  rebonds?: ExhibitionExpanded | null;
  imageCover?: (Omit<NonNullable<NonNullable<PAGE_MODULAIRE_QUERY_RESULT>['imageCover']>, 'asset'> & { asset?: SanityImageAsset | null }) | null;
};

export type ARTIST_QUERY_RESULTExpanded = Omit<ARTIST_QUERY_RESULT, 'imageCover'> & {
  imageCover?: (Omit<NonNullable<NonNullable<ARTIST_QUERY_RESULT>['imageCover']>, 'asset'> & { asset?: SanityImageAsset | null }) | null;
};

export type ProjectExpanded = Omit<Project, 'contributions' | 'media'> & {
  contributions?: Array<ContributionExpanded> | null;
  media?: Array<NonNullable<Project['media']>[number] extends infer M ? M extends { _type: 'video' } ? Omit<M, 'video'> & { video?: { asset?: { playbackId?: string; data?: { aspect_ratio?: string; duration?: number } } | null } | null } : M : never> | null;
};
