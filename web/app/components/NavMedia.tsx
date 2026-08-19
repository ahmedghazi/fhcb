import React from "react";
import Figure from "./ui/Figure";
import { _localizeField } from "../sanity-api/utils";
import { NavMenuItem } from "../context/HeaderContext";

type Props = {
  input: NavMenuItem;
};

const NavMedia = ({ input }: Props) => {
  if (!input?.images?.length) return null;

  return (
    <div className='nav-media'>
      <div className='flex items-end gap-gutter'>
        {input.images.map((img, i) => (
          <div key={i} className='imageCover'>
            <Figure
              width={1000}
              asset={img.asset}
              caption={_localizeField(img.asset?.title) || ""}
              alt={_localizeField(img.asset?.altText)}
              author={_localizeField(img.asset?.description)}
              copyright={_localizeField(img.asset?.creditLine)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavMedia;
