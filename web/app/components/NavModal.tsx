import React from "react";
import { SETTINGS_QUERY_RESULT } from "../sanity-api/types/sanity.types";
import useHeader from "../context/HeaderContext";
import Figure from "./ui/Figure";
import SearchForm from "./ui/SearchForm";
import { _localizeField } from "../sanity-api/utils";

type Props = {
  settings: NonNullable<SETTINGS_QUERY_RESULT>;
};

const NavModal = ({ settings }: Props) => {
  const { modalType, currentMenuItem } = useHeader();

  return (
    <div className='nav-modal' data-lenis-prevent>
      <div className='inner'>
        <aside>aside</aside>
        {currentMenuItem?.imageCover && (
          <div className='imageCover'>
            <Figure
              width={300}
              asset={currentMenuItem.imageCover.asset}
              caption={
                _localizeField(currentMenuItem.imageCover.asset?.title) || ""
              }
              alt={_localizeField(currentMenuItem.imageCover.asset?.altText)}
              author={_localizeField(
                currentMenuItem.imageCover.asset?.description,
              )}
              copyright={_localizeField(
                currentMenuItem.imageCover.asset?.creditLine,
              )}
            />
          </div>
        )}

        {modalType === "search" && <SearchForm settings={settings} />}
      </div>
    </div>
  );
};

export default NavModal;
