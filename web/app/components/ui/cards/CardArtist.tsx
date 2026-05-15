import { Artist } from "@/app/sanity-api/types/sanity.types";
import clsx from "clsx";
import React from "react";
import Figure from "../Figure";
import { Link } from "next-view-transitions";
import { _linkResolver, _localizeText } from "@/app/sanity-api/utils";

type Props = {
  input: Artist;
};

const CardArtist = ({ input }: Props) => {
  const { _type, name, imageCover } = input;
  return (
    <div
      className={clsx(
        "card card--l2 md:col-span-2",
        _type && `card--${_type}`,
      )}>
      <div className='card__header'>
        <div className='card__tag c-tag'>{_type}</div>
        <h2 className='card__title c-h2'>{name}</h2>
      </div>
      <div className='card__figure'>
        <Figure asset={imageCover?.asset} />
      </div>
      <div className='card__footer'>
        <div className='btns'>
          {/* <button className='btn btn--primary'>Bouton primary</button> */}
          <Link href={_linkResolver(input)} className='btn btn--primary'>
            {_localizeText("discoverTheArtist")}
          </Link>
          {/* <button className='btn btn--secondary'>Bouton secondary</button> */}
        </div>
      </div>
    </div>
  );
};

export default CardArtist;
