"use client";
import React, { createContext, useContext, ReactNode, useState } from "react";
import { LOCALE_COOKIE_NAME, LOCALE_COOKIE_MAX_AGE } from "@/app/config/cookies";

interface LocaleContextProps {
  children: ReactNode;
  initialLocale?: string;
}

type ContextProps = {
  locale: string;
  dispatch: React.Dispatch<React.SetStateAction<string>>;
};

const LocaleContext = createContext<ContextProps>({} as ContextProps);

export const LocaleContextProvider = ({
  children,
  initialLocale = "fr",
}: LocaleContextProps) => {
  const [locale, setLocale] = useState<string>(initialLocale);

  const dispatch: React.Dispatch<React.SetStateAction<string>> = (value) => {
    setLocale((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      if (typeof document !== "undefined") {
        document.cookie = `${LOCALE_COOKIE_NAME}=${next}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`;
      }
      return next;
    });
  };

  return (
    <LocaleContext.Provider value={{ locale, dispatch }}>
      {children}
    </LocaleContext.Provider>
  );
};

export default function useLocale() {
  return useContext(LocaleContext);
}
