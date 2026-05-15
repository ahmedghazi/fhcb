"use client";
import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";

const PageContext = createContext({});

interface PageContextProps {
  children: ReactNode;
}

export const PageContextProvider = (props: PageContextProps) => {
  const { children } = props;
  const pathname = usePathname();
  const [isInfos, setIsInfos] = useState<boolean>(false);
  const settings = { pathname };

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

  useEffect(() => {
    _format();
    window.addEventListener("resize", _format);
    document.documentElement.classList.remove("is-loading");

    return () => {
      window.removeEventListener("resize", _format);
    };
  }, []);

  useEffect(() => {
    document.body.dataset.slug = pathname;
  }, [pathname]);

  return (
    <PageContext.Provider value={{ settings, isInfos, setIsInfos }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePageContext = () => useContext(PageContext);
