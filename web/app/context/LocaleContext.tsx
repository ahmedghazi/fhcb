"use client";
import React, { createContext, useContext, ReactNode, useState } from "react";

interface LocaleContextProps {
  children: ReactNode;
}

type ContextProps = {
  locale: string;
  dispatch: React.Dispatch<React.SetStateAction<string>>;
};

const LocaleContext = createContext<ContextProps>({} as ContextProps);

export const LocaleContextProvider = ({ children }: LocaleContextProps) => {
  const [locale, dispatch] = useState<string>("fr");

  return (
    <LocaleContext.Provider value={{ locale, dispatch }}>
      {children}
    </LocaleContext.Provider>
  );
};

export default function useLocale() {
  return useContext(LocaleContext);
}
