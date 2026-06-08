// AUTO-GENERATED EXTENDED TYPES - DO NOT EDIT MANUALLY
// Generated on: 2026-06-08T12:42:18.738Z
// Run 'npm run typegen' to regenerate
// Project structure: web="../../web", studio="./"
// Detection method: configuration file

import type {
  Article,
  Tag,
  Partenaire,
  Settings,
  Exhibition,
  PageModulaire,
  Artist,
  Product,
  Event,
  Programme,
  Feuilletage,
  Chercheur,
  ImageImages,
  Library,
  PAGE_MODULAIRE_QUERY_RESULT,
  ARTIST_QUERY_RESULT,
  EXPHIBITION_QUERY_RESULT,
  PROGRAMME_QUERY_RESULT,
  IMAGE_IMAGES_QUERY_RESULT,
  FEUILLETAGE_QUERY_RESULT,
  ARTICLE_QUERY_RESULT,
  LIBRARY_QUERY_RESULT,
  PRODUCT_QUERY_RESULT,
  NewsletterUI,
  SupportUI,
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

export type ArticleExpanded = Omit<Article, 'tags' | 'imageCover'> & {
  tags?: Array<Tag> | null;
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

export type ProgrammeExpanded = Omit<Programme, 'filterTags' | 'excludeTags' | 'imageCover'> & {
  filterTags?: Array<Tag> | null;
  excludeTags?: Array<Tag> | null;
  imageCover?: (Omit<NonNullable<NonNullable<Programme>['imageCover']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type FeuilletageExpanded = Omit<Feuilletage, 'artists' | 'chercheur' | 'tags' | 'rebonds' | 'imageCover'> & {
  artists?: Array<ArtistExpanded> | null;
  chercheur?: Chercheur | null;
  tags?: Array<Tag> | null;
  rebonds?: ExhibitionExpanded | null;
  imageCover?: (Omit<NonNullable<NonNullable<Feuilletage>['imageCover']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type ImageImagesExpanded = Omit<ImageImages, 'chercheur' | 'artists' | 'rebonds' | 'imageCover'> & {
  chercheur?: Chercheur | null;
  artists?: Array<ArtistExpanded> | null;
  rebonds?: Array<ImageImagesExpanded> | null;
  imageCover?: (Omit<NonNullable<NonNullable<ImageImages>['imageCover']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type LibraryExpanded = Omit<Library, 'miseEnAvant' | 'sliderSelection' | 'items' | 'imageCover'> & {
  miseEnAvant?: Array<ProductExpanded> | null;
  sliderSelection?: Array<ProductExpanded> | null;
  items?: Array<ProductExpanded> | null;
  imageCover?: (Omit<NonNullable<NonNullable<Library>['imageCover']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type PAGE_MODULAIRE_QUERY_RESULTExpanded = Omit<PAGE_MODULAIRE_QUERY_RESULT, 'imageCover'> & {
  imageCover?: (Omit<NonNullable<NonNullable<PAGE_MODULAIRE_QUERY_RESULT>['imageCover']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type ARTIST_QUERY_RESULTExpanded = Omit<ARTIST_QUERY_RESULT, 'imageCover'> & {
  imageCover?: (Omit<NonNullable<NonNullable<ARTIST_QUERY_RESULT>['imageCover']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type EXPHIBITION_QUERY_RESULTExpanded = Omit<EXPHIBITION_QUERY_RESULT, 'tags' | 'rebonds'> & {
  tags?: Array<Tag> | null;
  rebonds?: ExhibitionExpanded | null;
};

export type PROGRAMME_QUERY_RESULTExpanded = Omit<PROGRAMME_QUERY_RESULT, 'filterTags' | 'excludeTags' | 'imageCover'> & {
  filterTags?: Array<Tag> | null;
  excludeTags?: Array<Tag> | null;
  imageCover?: (Omit<NonNullable<NonNullable<PROGRAMME_QUERY_RESULT>['imageCover']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type IMAGE_IMAGES_QUERY_RESULTExpanded = Omit<IMAGE_IMAGES_QUERY_RESULT, 'artists' | 'imageCover'> & {
  artists?: Array<ArtistExpanded> | null;
  imageCover?: (Omit<NonNullable<NonNullable<IMAGE_IMAGES_QUERY_RESULT>['imageCover']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type FEUILLETAGE_QUERY_RESULTExpanded = Omit<FEUILLETAGE_QUERY_RESULT, 'artists' | 'tags' | 'imageCover'> & {
  artists?: Array<ArtistExpanded> | null;
  tags?: Array<Tag> | null;
  imageCover?: (Omit<NonNullable<NonNullable<FEUILLETAGE_QUERY_RESULT>['imageCover']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type ARTICLE_QUERY_RESULTExpanded = Omit<ARTICLE_QUERY_RESULT, 'tags' | 'imageCover'> & {
  tags?: Array<Tag> | null;
  imageCover?: (Omit<NonNullable<NonNullable<ARTICLE_QUERY_RESULT>['imageCover']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type LIBRARY_QUERY_RESULTExpanded = Omit<LIBRARY_QUERY_RESULT, 'miseEnAvant' | 'sliderSelection' | 'imageCover'> & {
  miseEnAvant?: Array<ProductExpanded> | null;
  sliderSelection?: Array<ProductExpanded> | null;
  imageCover?: (Omit<NonNullable<NonNullable<LIBRARY_QUERY_RESULT>['imageCover']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type PRODUCT_QUERY_RESULTExpanded = Omit<PRODUCT_QUERY_RESULT, 'tags' | 'rebonds' | 'imageCover'> & {
  tags?: Array<Tag> | null;
  rebonds?: ExhibitionExpanded | null;
  imageCover?: (Omit<NonNullable<NonNullable<PRODUCT_QUERY_RESULT>['imageCover']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type NewsletterUIExpanded = Omit<NewsletterUI, 'image'> & {
  image?: (Omit<NonNullable<NonNullable<NewsletterUI>['image']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
};

export type SupportUIExpanded = Omit<SupportUI, 'image'> & {
  image?: (Omit<NonNullable<NonNullable<SupportUI>['image']>, 'asset'> & { asset?: SanityImageAssetFull | null }) | null;
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

export type SidebarGeneriqueExpanded = Omit<SidebarGenerique, 'commissariat' | 'coProduction' | 'partenaires' | 'keyVal'> & {
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
  keyVal?: Array<
    {
      _key: string;
    } & KeyValExpanded
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
