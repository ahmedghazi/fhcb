"use client";
import React from "react";
import { SETTINGS_QUERY_RESULT } from "../sanity-api/types/sanity.types";
import useHeader from "../context/HeaderContext";
import Figure from "./ui/Figure";
import SearchForm from "./ui/SearchForm";
import { _localizeField } from "../sanity-api/utils";
import { PortableText } from "@portabletext/react";
import portableTextComponents from "../sanity-api/portableTextComponents";
import NavMessage from "./NavMessage";
import NavMedia from "./NavMedia";
import clsx from "clsx";

type Props = {
  settings: NonNullable<SETTINGS_QUERY_RESULT>;
};

const NavModal = ({ settings }: Props) => {
  const { modalType, currentMenuItem, currentMenuMessage } = useHeader();

  return (
    <div
      className={clsx("nav-modal", modalType && `nav-modal--${modalType}`)}
      data-lenis-prevent>
      <div className='container-fluid h-full'>
        <div className='inner'>
          <aside>
            {currentMenuMessage && <NavMessage input={currentMenuMessage} />}
          </aside>
          {!!currentMenuItem?.images?.length && <NavMedia input={currentMenuItem} />}

          {modalType === "search" && <SearchForm settings={settings} />}
        </div>
      </div>
    </div>
  );
};

export default NavModal;
