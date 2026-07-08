"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  _linkResolver,
  _localizeField,
  _localizeText,
} from "../sanity-api/utils";
import { SETTINGS_QUERY_RESULT } from "../sanity-api/types/sanity.types";
import NavModal from "./NavModal";
import useHeader from "../context/HeaderContext";
import clsx from "clsx";
import HeaderMobile from "./HeaderMobile";
import HeaderDesktop from "./HeaderDesktop";
import { useScroll } from "../hooks/useScroll";

type Props = {
  settings: SETTINGS_QUERY_RESULT;
};

const Header = ({ settings }: Props) => {
  const { modalType, dispatchModalType } = useHeader();
  const { scrollDirection } = useScroll();
  // const { cartCount, toggleCart } = useCart();

  if (!settings) return null;

  return (
    <header
      className={clsx(
        "header",
        modalType && "is-modal-open",
        scrollDirection && `is-${scrollDirection}`,
      )}
      // onMouseEnter={() => dispatchModalType("base")}
      // onMouseLeave={() => dispatchModalType(null)}
    >
      <NavModal settings={settings} />

      <div className='container-fluid'>
        <HeaderMobile settings={settings} />
        <HeaderDesktop settings={settings} />
      </div>
    </header>
  );
};

export default Header;
