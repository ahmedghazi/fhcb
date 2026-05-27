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

interface HeaderContextProps {
  children: ReactNode;
}

export type NavMenuItem = {
  imageCover?: {
    asset?: SanityImageAssetFull | null;
  } | null;
} | null;

type ContextProps = {
  modalType: "menu" | "search" | null;
  dispatchModalType: React.Dispatch<
    React.SetStateAction<"menu" | "search" | null>
  >;
  currentMenuItem: NavMenuItem;
  dispatchCurrentMenuItem: React.Dispatch<React.SetStateAction<NavMenuItem>>;
};

const HeaderContext = createContext<ContextProps>({} as ContextProps);

export const HeaderContextProvider = ({ children }: HeaderContextProps) => {
  const [currentMenuItem, dispatchCurrentMenuItem] =
    useState<NavMenuItem>(null);
  const [modalType, dispatchModalType] = useState<"menu" | "search" | null>(
    null,
  );

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
      }}>
      {children}
    </HeaderContext.Provider>
  );
};

export default function useHeader() {
  return useContext(HeaderContext);
}
