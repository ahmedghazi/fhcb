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

type ContextProps = {
  settings: SETTINGS_QUERY_RESULT;
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
};

// const PageContext = createContext({
//   settings: {} as SETTINGS_QUERY_RESULT,

// });
const PageContext = createContext<ContextProps>({} as ContextProps);

interface PageContextProps {
  children: ReactNode;
  settings: SETTINGS_QUERY_RESULT;
}

export const PageContextProvider = (props: PageContextProps) => {
  const { children, settings } = props;
  const pathname = usePathname();
  const [color, setColor] = useState<string>("");
  // const settings = { pathname };

  const _format = () => {
    // Read every measurement first, then write the CSS vars after — reading
    // a bounding rect right after writing an inline style forces a
    // synchronous reflow, so interleaving reads/writes here (as this used
    // to) triggers one per line instead of a single batched layout pass.
    const vh = window.innerHeight * 0.01;
    const vw = window.innerWidth * 0.01;

    const header = document.querySelector("header");
    const headerHeight = header?.getBoundingClientRect().height;

    const footer = document.querySelector("footer");
    const footerHeight = footer?.getBoundingClientRect().height;

    const containerFluid = document.querySelector(".container-fluid");
    const bodyBounding = containerFluid
      ? document.body.getBoundingClientRect()
      : null;
    const containerFluidBounding = containerFluid?.getBoundingClientRect();

    const gridder = document.querySelector(".gridder");
    const gridderItems = gridder
      ? Array.from(gridder.querySelectorAll(".gridder__item")).map(
          (element) => ({
            size: element.getAttribute("data-size"),
            width: element.getBoundingClientRect().width,
          }),
        )
      : [];

    const docHeight = document.documentElement.scrollHeight;

    const root = document.documentElement.style;
    root.setProperty("--vh", `${vh}px`);
    root.setProperty("--vw", `${vw}px`);
    root.setProperty("--doc-h", `${docHeight}px`);
    if (headerHeight !== undefined) {
      root.setProperty("--header-h", `${headerHeight}px`);
    }
    if (footerHeight !== undefined) {
      root.setProperty("--footer-h", `${footerHeight}px`);
    }
    if (bodyBounding && containerFluidBounding) {
      root.setProperty(
        "--container-fluid-w",
        `${containerFluidBounding.width}px`,
      );
      const edges = (bodyBounding.width - containerFluidBounding.width) / 2;
      root.setProperty("--edge-w", `${edges}px`);
    }
    gridderItems.forEach(({ size, width }) => {
      root.setProperty(`--gridder-${size}`, `${width}px`);
    });

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
    setColor("");
  }, [pathname]);

  return (
    <PageContext.Provider value={{ settings, color, setColor }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePageContext = () => useContext(PageContext);
