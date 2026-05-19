import { EventExpanded, ExhibitionExpanded } from "./sanity-expanded.types";
import {
  Artist,
  Exhibition,
  GridCardUI,
  ImagesUI,
  Library,
  ListsUI,
  ListUI,
  PageModulaire,
  Product,
  Programme,
  ProgrammeUI,
  SliderCardUI,
  TextImageUI,
  TextSidebarUI,
  TextUI,
  VideoUI,
} from "./sanity.types";

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
  | ImagesUI
  | VideoUI
  | TextImageUI
  | TextSidebarUI
  | ListUI
  | ListsUI
  | SliderCardUI
  | GridCardUI
  | ProgrammeUI;

export interface ModulesList {
  modules?: Array<
    | ({
        _key: string;
      } & TextUI)
    | ({
        _key: string;
      } & ImagesUI)
    | ({
        _key: string;
      } & VideoUI)
    | ({
        _key: string;
      } & TextImageUI)
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
  >;
}

export interface ProgrammeExtend extends Programme {
  resolvedItems?: (ExhibitionExpanded | EventExpanded)[];
}
