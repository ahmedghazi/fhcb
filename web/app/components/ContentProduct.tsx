"use client";
import React from "react";
import {
  Artist,
  KeyVal,
  Product,
  PRODUCT_QUERY_RESULT,
} from "../sanity-api/types/sanity.types";
import { _localizeField, _localizeText } from "../sanity-api/utils";
import KeenSlider from "./ui/KeenSlider";
import Figure from "./ui/Figure";
import Rebonds from "./Rebonds";

type Props = {
  input: PRODUCT_QUERY_RESULT;
};

const ContentProduct = ({ input }: Props) => {
  if (!input) return null;
  console.log(input);
  const {
    imageCover,
    title,
    price,
    artist,
    images,
    isbn,
    editeur,
    languages,
    metas,
    publicationDate,
    related,
  } = input;
  // const creditsKeys = ["isbn", "editeur", "languages", "metas"];
  return (
    <div className='content content--product'>
      <div className='container-fluid'>
        <div className='grid md:grid-cols-4 gap-gutter mb-lg'>
          <div className='header'>
            <div>
              <h1 className='c-h2'>{_localizeField(title)}</h1>
              {artist && (
                <div className='subtitle c-chapo c-chapo--i'>
                  {(artist as unknown as Artist).name}
                </div>
              )}
            </div>
            <div className='price c-h2'>{price}€</div>
            <button className='add-to-cart btn'>
              {_localizeText("addToCart")}
            </button>
            <ul className='sidebar'>
              {editeur && (
                <li className='sidebar__item'>
                  <div>{_localizeText("editor")}</div>
                  <div className='c-body--tight'>{editeur}</div>
                </li>
              )}
              {publicationDate && (
                <li className='sidebar__item'>
                  <div>{_localizeText("publicationDate")}</div>
                  <div className='c-body--tight'>{publicationDate}</div>
                </li>
              )}
              {languages && (
                <li className='sidebar__item'>
                  <div>{_localizeText("Langues")}</div>
                  <div className='c-body--tight'>{languages}</div>
                </li>
              )}
              {isbn && (
                <li className='sidebar__item'>
                  <div>ISBN</div>
                  <div className='c-body--tight'>{isbn}</div>
                </li>
              )}

              {metas?.map((item: KeyVal, i: number) => (
                <li className='sidebar__item' key={i}>
                  {item && (
                    <div className='c-body--tight'>
                      {_localizeField(item.text)}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          {images && (
            <div className='slider md:col-span-3'>
              <KeenSlider perView={1}>
                {imageCover && (
                  <div
                    key={`${imageCover && imageCover.asset?._ref}-00`}
                    className='keen-slider__slide'>
                    <Figure asset={imageCover.asset} width={2000} />
                  </div>
                )}
                {images.map((item, index: number) => (
                  <div
                    key={`${item && item.asset?._id}-${index}`}
                    className='keen-slider__slide'>
                    <Figure asset={item.asset} />
                  </div>
                ))}
              </KeenSlider>
            </div>
          )}
        </div>
        <div className='grid md:grid-cols-4 gap-gutter'>
          <div className='md:col-span-3-'></div>
          <div className='md:col-span-2'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa earum
            at, doloribus quia commodi iure quas quis ad reprehenderit
            dignissimos ullam natus, incidunt corporis, ducimus esse saepe sit
            perspiciatis asperiores.
          </div>
          <div className='md:col-span-1'></div>
        </div>
      </div>
      {related && <Rebonds input={related} />}
      {/* <pre>{JSON.stringify(related, null, 2)}</pre> */}
    </div>
  );
};

export default ContentProduct;
