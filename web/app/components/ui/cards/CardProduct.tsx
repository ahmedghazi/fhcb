import { Artist, Product } from "@/app/sanity-api/types/sanity.types";
import clsx from "clsx";
import React from "react";
import Figure from "../Figure";
import {
  _linkResolver,
  _localizeField,
  _localizeText,
} from "@/app/sanity-api/utils";
import { ProductExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { Link } from "next-view-transitions";

type Props = {
  input: ProductExpanded;
  look?: "l1a" | "l3";
};

const CardProduct = ({ input, look = "l1a" }: Props) => {
  const { _type, title, artist, imageCover, prix, tags } = input;
  const tagsList = tags?.map((tag) => _localizeField(tag.title)).join(", ");

  const isLandscapeOrPortrait =
    (imageCover?.asset?.metadata?.dimensions?.aspectRatio ?? 0) >= 1
      ? "is-landscape"
      : "is-portrait";
  return (
    <div
      className={clsx(
        "card",
        `card--${look}`,
        look === "l3" && "md:col-span-2",
        `card--${_type}`,
        `card--${isLandscapeOrPortrait}`,
      )}>
      {look === "l1a" && (
        <>
          <div className='card__header'>
            <div className='card__tag c-tag'>{tagsList}</div>
            <h2 className='card__title c-h2'>{artist?.name}</h2>
            <div className='card__subtitle c-h3'>{_localizeField(title)}</div>
          </div>
          <div className='card__figure'>
            <Figure asset={imageCover?.asset} />
          </div>
        </>
      )}
      {look === "l3" && (
        <>
          <div className='card__header__figure'>
            <div className='card__header'>
              <div className='top'>
                <div className='card__tag c-tag'>{"item.tag"}</div>
                <h2 className='card__title c-h2'>{artist?.name}</h2>

                <div className='card__subtitle c-h3'>
                  {_localizeField(title)}
                </div>
              </div>

              <div className='bottom'>
                {prix && <div className='card__info c-body-xs'>{prix}€</div>}
              </div>
            </div>
            <div className='card__figure'>
              <Figure asset={imageCover?.asset} />
            </div>
          </div>
        </>
      )}
      <div className='card__footer'>
        {look === "l1a" && <div className='card__info c-body-xs'>{prix}€</div>}
        <div className='btns'>
          {/* <button className='btn btn--primary'>Bouton primary</button> */}
          <Link href={_linkResolver(input)} className='btn btn--primary'>
            {_localizeText("discover")}
          </Link>
          <button className='btn btn--secondary'>Bouton secondary</button>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
