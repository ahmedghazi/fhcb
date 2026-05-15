"use client";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import {
  Artist,
  Event,
  Exhibition,
  Library,
  PageModulaire,
  Product,
} from "../sanity-api/types/sanity.types";

interface HeaderContextProps {
  children: ReactNode;
}

type ContextProps = {
  modalType: "menu" | "search" | null;
  dispatchModalType: React.Dispatch<
    React.SetStateAction<"menu" | "search" | null>
  >;
  currentMenuItem:
    | PageModulaire
    | Exhibition
    | Event
    | Artist
    | Library
    | Product
    | null;
  dispatchCurrentMenuItem: React.Dispatch<
    React.SetStateAction<
      PageModulaire | Exhibition | Event | Artist | Library | Product | null
    >
  >;
};

const HeaderContext = createContext<ContextProps>({} as ContextProps);

export const HeaderContextProvider = ({ children }: HeaderContextProps) => {
  const [currentMenuItem, dispatchCurrentMenuItem] = useState<
    PageModulaire | Exhibition | Event | Artist | Library | Product | null
  >(null);
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
