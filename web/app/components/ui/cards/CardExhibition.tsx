import clsx from "clsx";
import React from "react";
import Figure from "../Figure";
import {
  _linkResolver,
  _localizeField,
  _localizeText,
} from "@/app/sanity-api/utils";
import FHCBDates from "../FHCBDates";
import { ExhibitionExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import Link from "next/link";

type Props = {
  input: ExhibitionExpanded;
};

const CardExhibition = ({ input }: Props) => {
  const { _type, title, artists, imageCover, dates } = input;
  const artistList = artists?.map((artist) => artist.name).join(", ");
  const isLandscapeOrPortrait =
    (imageCover?.asset?.metadata?.dimensions?.aspectRatio ?? 0) >= 1
      ? "is-landscape"
      : "is-portrait";
  return (
    <div
      className={clsx(
        "card card--l3 md:col-span-2",
        `card--${_type}`,
        `card--${isLandscapeOrPortrait}`,
        "self-start ",
      )}>
      <div className='card__header__figure'>
        <div className='card__header'>
          <div className='top'>
            <div className='card__tag c-tag'>{"item.tag"}</div>
            <h2 className='card__title c-h2'>{artistList}</h2>
            <div className='card__subtitle c-h3'>{_localizeField(title)}</div>

            {/* <div className='card__subtitle c-h3'>{item.subtitle}</div> */}
            {/* <div className='card__text c-body-sm'>{item.text}</div> */}
          </div>

          <div className='bottom'>
            {dates && (
              <div className='card__info'>
                <FHCBDates input={dates} />
              </div>
            )}
          </div>
        </div>
        <div className='card__figure'>
          <Figure asset={imageCover?.asset} />
        </div>
      </div>

      <div className='card__footer'>
        <div className='btns'>
          <Link href={_linkResolver(input)} className='btn btn--primary'>
            {_localizeText("discoverTheExhibition")}
          </Link>
          {/* <button className='btn btn--primary'>Bouton primary</button> */}
          {/* <button className='btn btn--secondary'>Bouton secondary</button> */}
        </div>
      </div>
    </div>
  );
};

export default CardExhibition;
