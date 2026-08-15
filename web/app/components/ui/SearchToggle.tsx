"use client";
import React, { useEffect, useRef, useState } from "react";
import { _linkResolver } from "@/app/sanity-api/utils";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import useHeader from "@/app/context/HeaderContext";
import styles from "./Search.module.css";

const SearchToggle = () => {
  const [active, setActive] = useState<boolean>(false);

  const pathname = usePathname();
  const { modalType, dispatchModalType } = useHeader();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (active) {
      dispatchModalType("search");
    } else {
      dispatchModalType(null);
    }
  }, [active]);

  useEffect(() => {
    if (modalType === "search") {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [modalType]);

  // reset
  useEffect(() => {
    setActive(false);
  }, [pathname]);

  return (
    <div
      className={clsx(
        styles.search,
        "search-toggle",
        active ? "is-active" : "",
      )}>
      <button
        className={styles.toggle}
        // onMouseLeave={() => dispatchModalType(null)}
        // onMouseEnter={() => {
        //   dispatchModalType("search");
        // }}
        aria-label='Rechercher'
        onClick={() => setActive(!active)}>
        <svg
          width='24'
          height='20'
          viewBox='0 0 24 20'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M16.9506 14.8496L22.6016 18.2816M18.6436 9.59961C18.6436 14.5702 14.6047 18.5996 9.62258 18.5996C4.64041 18.5996 0.601562 14.5702 0.601562 9.59961C0.601562 4.62905 4.64041 0.599609 9.62258 0.599609C14.6047 0.599609 18.6436 4.62905 18.6436 9.59961Z'
            stroke='var(--color-secondary)'
            fill='none'
            strokeWidth='1.2'
            strokeLinecap='round'
          />
        </svg>
      </button>
    </div>
  );
};

export default SearchToggle;
