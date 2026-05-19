import React from "react";
import { Settings } from "../sanity-api/types/sanity.types";
import useHeader from "../context/HeaderContext";
import Figure from "./ui/Figure";
import SearchForm from "./ui/SearchForm";

type Props = {
  settings: Settings;
};

const NavModal = ({ settings }: Props) => {
  const { modalType, currentMenuItem } = useHeader();
  return (
    <div className='nav-modal'>
      <div className='inner'>
        <aside>aside</aside>
        {currentMenuItem?.imageCover && (
          <div className='imageCover'>
            <Figure asset={currentMenuItem.imageCover.asset} />
          </div>
        )}

        {modalType === "search" && <SearchForm settings={settings} />}
      </div>
    </div>
  );
};

export default NavModal;
