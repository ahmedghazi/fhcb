import {
  EventExpanded,
  ExhibitionExpanded,
  ImagesUIExpanded,
  VideoUIExpanded,
  TextImageUIExpanded,
} from "./sanity-expanded.types";
import {
  Artist,
  Exhibition,
  FeaturedCardsUI,
  GridCardUI,
  Library,
  ListsUI,
  ListUI,
  LocaleString,
  NewsCardUI,
  PageModulaire,
  Product,
  Programme,
  ProgrammeUI,
  Slug,
  SliderCardUI,
  TextSidebarUI,
  TextUI,
} from "./sanity.types";

export type MostSearchedItem = {
  _type: string;
  slug?: Slug | null;
  title?: LocaleString | null;
};

export type PostTypes =
  | PageModulaire
  | Exhibition
  | Event
  | Artist
  | Library
  | Product
  | any;
export type ModuleType =
  | TextUI
  | ImagesUIExpanded
  | VideoUIExpanded
  | TextImageUIExpanded
  | TextSidebarUI
  | ListUI
  | ListsUI
  | SliderCardUI
  | GridCardUI
  | ProgrammeUI
  | FeaturedCardsUI
  | NewsCardUI;

export interface ModulesList {
  modules?: Array<
    | ({
        _key: string;
      } & TextUI)
    | ({
        _key: string;
      } & ImagesUIExpanded)
    | ({
        _key: string;
      } & VideoUIExpanded)
    | ({
        _key: string;
      } & TextImageUIExpanded)
    | ({
        _key: string;
      } & TextSidebarUI)
    | ({
        _key: string;
      } & ListUI)
    | ({
        _key: string;
      } & ListsUI)
    | ({
        _key: string;
      } & SliderCardUI)
    | ({
        _key: string;
      } & GridCardUI)
    | ({
        _key: string;
      } & ProgrammeUI)
    | ({
        _key: string;
      } & FeaturedCardsUI)
    | ({
        _key: string;
      } & NewsCardUI)
  >;
}

export interface ProgrammeExtend extends Programme {
  resolvedItems?: (ExhibitionExpanded | EventExpanded)[];
}
