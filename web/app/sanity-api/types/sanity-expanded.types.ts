// AUTO-GENERATED EXTENDED TYPES - DO NOT EDIT MANUALLY
// Generated on: 2026-05-19T13:55:19.211Z
// Run 'npm run typegen' to regenerate
// Project structure: web="../../web", studio="./"
// Detection method: configuration file

import type {
  Article,
  Partenaire,
  Settings,
  Exhibition,
  PageModulaire,
  Tag,
  Artist,
  Product,
  Event,
  Programme,
  Library,
  SETTINGS_QUERY_RESULT,
  HOME_QUERY_RESULT,
  PAGE_MODULAIRE_QUERY_RESULT,
  ARTIST_QUERY_RESULT,
  EXPHIBITION_QUERY_RESULT,
  PROGRAMME_QUERY_RESULT,
  Project,
  TextImageUI,
  KeyVal,
  ImageInGrid,
  Video,
  LinkIcon,
  Embed,
  Seo,
  VideoUI,
  ImagesUI,
  SidebarGenerique,
  KeyValGroup,
  TextSidebarUI,
  SanityImageAsset
} from './sanity.types'

export type SanityImageAssetFull = SanityImageAsset & {
  creditLine?: string;
};

export type ArticleExpanded = Omit<Article, 'imageCover'> & {
  imageCover?: (Omit<NonNullable<NonNullable<Article>['imageCover']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type PartenaireExpanded = Omit<Partenaire, 'imageCover'> & {
  imageCover?: (Omit<NonNullable<NonNullable<Partenaire>['imageCover']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type ArtistExpanded = Omit<Artist, 'imageCover'> & {
  imageCover?: (Omit<NonNullable<NonNullable<Artist>['imageCover']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type ExhibitionExpanded = Omit<Exhibition, 'artists' | 'tags' | 'rebonds' | 'imageCover'> & {
  artists?: Array<ArtistExpanded> | null;
  tags?: Array<Tag> | null;
  rebonds?: ExhibitionExpanded | null;
  imageCover?: (Omit<NonNullable<NonNullable<Exhibition>['imageCover']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type SettingsExpanded = Omit<Settings, 'mostSearched'> & {
  mostSearched?: ExhibitionExpanded | null;
};

export type PageModulaireExpanded = Omit<PageModulaire, 'tags' | 'rebonds' | 'imageCover'> & {
  tags?: Array<Tag> | null;
  rebonds?: ExhibitionExpanded | null;
  imageCover?: (Omit<NonNullable<NonNullable<PageModulaire>['imageCover']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type ProductExpanded = Omit<Product, 'artist' | 'tags' | 'rebonds' | 'imageCover' | 'images'> & {
  artist?: ArtistExpanded | null;
  tags?: Array<Tag> | null;
  rebonds?: ExhibitionExpanded | null;
  imageCover?: (Omit<NonNullable<NonNullable<Product>['imageCover']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
  images?: (Omit<NonNullable<NonNullable<Product>['images']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type EventExpanded = Omit<Event, 'artists' | 'tags' | 'rebonds' | 'imageCover'> & {
  artists?: Array<ArtistExpanded> | null;
  tags?: Array<Tag> | null;
  rebonds?: ExhibitionExpanded | null;
  imageCover?: (Omit<NonNullable<NonNullable<Event>['imageCover']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type ProgrammeExpanded = Omit<Programme, 'imageCover'> & {
  imageCover?: (Omit<NonNullable<NonNullable<Programme>['imageCover']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type LibraryExpanded = Omit<Library, 'miseEnAvant' | 'sliderSelection' | 'items' | 'imageCover'> & {
  miseEnAvant?: Array<ProductExpanded> | null;
  sliderSelection?: Array<ProductExpanded> | null;
  items?: Array<ProductExpanded> | null;
  imageCover?: (Omit<NonNullable<NonNullable<Library>['imageCover']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type SETTINGS_QUERY_RESULTExpanded = Omit<SETTINGS_QUERY_RESULT, 'mostSearched'> & {
  mostSearched?: ExhibitionExpanded | null;
};

export type HOME_QUERY_RESULTExpanded = Omit<HOME_QUERY_RESULT, 'tags' | 'rebonds' | 'imageCover'> & {
  tags?: Array<Tag> | null;
  rebonds?: ExhibitionExpanded | null;
  imageCover?: (Omit<NonNullable<NonNullable<HOME_QUERY_RESULT>['imageCover']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type PAGE_MODULAIRE_QUERY_RESULTExpanded = Omit<PAGE_MODULAIRE_QUERY_RESULT, 'tags' | 'rebonds' | 'imageCover'> & {
  tags?: Array<Tag> | null;
  rebonds?: ExhibitionExpanded | null;
  imageCover?: (Omit<NonNullable<NonNullable<PAGE_MODULAIRE_QUERY_RESULT>['imageCover']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type ARTIST_QUERY_RESULTExpanded = Omit<ARTIST_QUERY_RESULT, 'imageCover'> & {
  imageCover?: (Omit<NonNullable<NonNullable<ARTIST_QUERY_RESULT>['imageCover']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type EXPHIBITION_QUERY_RESULTExpanded = Omit<EXPHIBITION_QUERY_RESULT, 'tags' | 'rebonds'> & {
  tags?: Array<Tag> | null;
  rebonds?: ExhibitionExpanded | null;
};

export type PROGRAMME_QUERY_RESULTExpanded = Omit<PROGRAMME_QUERY_RESULT, 'imageCover'> & {
  imageCover?: (Omit<NonNullable<NonNullable<PROGRAMME_QUERY_RESULT>['imageCover']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type ProjectExpanded = Omit<Project, 'contributions' | 'media'> & {
  contributions?: Array<ContributionExpanded> | null;
  media?: Array<NonNullable<Project['media']>[number] extends infer M ? M extends { _type: 'video' } ? Omit<M, 'video'> & { video?: { asset?: { playbackId?: string; data?: { aspect_ratio?: string; duration?: number } } | null } | null } : M : never> | null;
};

export type TextImageUIExpanded = Omit<TextImageUI, 'image'> & {
  image?: (Omit<NonNullable<NonNullable<TextImageUI>['image']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type KeyValExpanded = Omit<KeyVal, 'image'> & {
  image?: (Omit<NonNullable<NonNullable<KeyVal>['image']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type ImageInGridExpanded = Omit<ImageInGrid, 'image'> & {
  image?: (Omit<NonNullable<NonNullable<ImageInGrid>['image']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type VideoExpanded = Omit<Video, 'placeholder'> & {
  placeholder?: (Omit<NonNullable<NonNullable<Video>['placeholder']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type LinkIconExpanded = Omit<LinkIcon, 'icon'> & {
  icon?: (Omit<NonNullable<NonNullable<LinkIcon>['icon']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type EmbedExpanded = Omit<Embed, 'placeholder'> & {
  placeholder?: (Omit<NonNullable<NonNullable<Embed>['placeholder']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type SeoExpanded = Omit<Seo, 'metaImage'> & {
  metaImage?: (Omit<NonNullable<NonNullable<Seo>['metaImage']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type VideoUIExpanded = Omit<VideoUI, 'video'> & {
  video?: VideoExpanded | null;
};

export type ImagesUIExpanded = Omit<ImagesUI, 'items'> & {
  items?: Array<
    {
      _key: string;
    } & ImageInGridExpanded
  > | null;
};

export type SidebarGeneriqueExpanded = Omit<SidebarGenerique, 'commissariat' | 'coProduction' | 'partenaires'> & {
  commissariat?: Array<
    {
      _key: string;
    } & KeyValExpanded
  > | null;
  coProduction?: Array<
    | ({
        _key: string;
      } & KeyValExpanded)
    | ({
        _key: string;
      } & PartenaireExpanded)
  > | null;
  partenaires?: Array<
    | ({
        _key: string;
      } & KeyValExpanded)
    | ({
        _key: string;
      } & PartenaireExpanded)
  > | null;
};

export type KeyValGroupExpanded = Omit<KeyValGroup, 'items'> & {
  items?: Array<
    | ({
        _key: string;
      } & KeyValExpanded)
    | ({
        _key: string;
      } & PartenaireExpanded)
  > | null;
};

export type TextSidebarUIExpanded = Omit<TextSidebarUI, 'sidebar'> & {
  sidebar?: SidebarGeneriqueExpanded | null;
};
