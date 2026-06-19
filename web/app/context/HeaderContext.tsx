"use client";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { SanityImageAssetFull } from "../sanity-api/types/sanity-expanded.types";
import { publish } from "pubsub-js";
import { LocaleBlockContent } from "../sanity-api/types/sanity.types";
import { ModulesList } from "../sanity-api/types/extra-types";

interface HeaderContextProps {
  children: ReactNode;
}

export type NavMenuImage = {
  asset?: SanityImageAssetFull | null;
};

export type NavMenuItem = {
  images?: NavMenuImage[];
} | null;

type MODAL_TYPES = "base" | "menu" | "search" | null;
type ContextProps = {
  modalType: MODAL_TYPES;
  dispatchModalType: React.Dispatch<React.SetStateAction<MODAL_TYPES>>;
  currentMenuItem: NavMenuItem;
  dispatchCurrentMenuItem: React.Dispatch<React.SetStateAction<NavMenuItem>>;
  currentMenuMessage: LocaleBlockContent | null;
  dispatchCurrentMenuMessage: React.Dispatch<
    React.SetStateAction<LocaleBlockContent | null>
  >;
};

const HeaderContext = createContext<ContextProps>({} as ContextProps);

export const HeaderContextProvider = ({ children }: HeaderContextProps) => {
  const [currentMenuItem, dispatchCurrentMenuItem] =
    useState<NavMenuItem>(null);
  const [currentMenuMessage, dispatchCurrentMenuMessage] =
    useState<LocaleBlockContent | null>(null);
  const [modalType, dispatchModalType] = useState<MODAL_TYPES>(null);

  useEffect(() => {
    if (currentMenuItem) {
      dispatchModalType("menu");
    } else {
      dispatchModalType(null);
    }
    // console.log(currentMenuItem);
    // document.body.classList.toggle("nav-open", !!currentMenuItem);
  }, [currentMenuItem]);

  useEffect(() => {
    // console.log(currentMenuItem);
    document.body.classList.toggle("nav-open", modalType !== null);
    publish("TOGGLE_SCROLL", modalType === null);
  }, [modalType]);

  return (
    <HeaderContext.Provider
      value={{
        currentMenuItem,
        dispatchCurrentMenuItem,
        modalType,
        dispatchModalType,
        currentMenuMessage,
        dispatchCurrentMenuMessage,
      }}>
      {children}
    </HeaderContext.Provider>
  );
};

export default function useHeader() {
  return useContext(HeaderContext);
}
