"use client";
import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { SETTINGS_QUERY_RESULT } from "../sanity-api/types/sanity.types";

const PageContext = createContext({
  settings: {} as SETTINGS_QUERY_RESULT,
});

interface PageContextProps {
  children: ReactNode;
  settings: SETTINGS_QUERY_RESULT;
}

export const PageContextProvider = (props: PageContextProps) => {
  const { children, settings } = props;
  const pathname = usePathname();
  // const settings = { pathname };

  const _format = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
    const vw = window.innerWidth * 0.01;
    document.documentElement.style.setProperty("--vw", `${vw}px`);

    const docHeight = document.documentElement.scrollHeight;
    document.documentElement.style.setProperty("--doc-h", `${docHeight}px`);

    const header = document.querySelector("header");
    if (header) {
      const headerBounding = header.getBoundingClientRect();
      document.documentElement.style.setProperty(
        "--header-h",
        headerBounding.height + "px",
      );
    }

    const footer = document.querySelector("footer");
    if (footer) {
      const footerBounding = footer.getBoundingClientRect();
      document.documentElement.style.setProperty(
        "--footer-h",
        footerBounding.height + "px",
      );
    }

    const containerFluid = document.querySelector(".container-fluid");
    if (containerFluid) {
      const bodyBounding = document.body.getBoundingClientRect();
      const containerFluidBounding = containerFluid.getBoundingClientRect();
      document.documentElement.style.setProperty(
        "--container-fluid-w",
        containerFluidBounding.width + "px",
      );
      const edges = (bodyBounding.width - containerFluidBounding.width) / 2;
      document.documentElement.style.setProperty("--edge-w", edges + "px");
    }

    const gridder = document.querySelector(".gridder");
    if (gridder) {
      const children = gridder.querySelectorAll(".gridder__item");
      if (children.length > 0) {
        Array.from(children).forEach((element) => {
          const bounding = element.getBoundingClientRect();
          const size = element.getAttribute("data-size");
          document.documentElement.style.setProperty(
            `--gridder-${size}`,
            bounding.width + "px",
          );
        });
      }
    }
    document.body.classList.remove("is-loading");
  };

  const _scroll = () => {
    const scrollY = window.scrollY > 77;
    if (scrollY) {
      document.body.classList.add("scrolled");
    }
  };

  useEffect(() => {
    _format();
    window.addEventListener("resize", _format);
    document.addEventListener("scroll", _scroll);
    document.documentElement.classList.remove("is-loading");

    return () => {
      window.removeEventListener("resize", _format);
      document.removeEventListener("scroll", _scroll);
    };
  }, []);

  useEffect(() => {
    document.body.dataset.slug = pathname;
  }, [pathname]);

  return (
    <PageContext.Provider value={{ settings }}>{children}</PageContext.Provider>
  );
};

export const usePageContext = () => useContext(PageContext);
