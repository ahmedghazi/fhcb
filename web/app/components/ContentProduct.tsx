"use client";
import React from "react";
import {
  Artist,
  KeyVal,
  PRODUCT_QUERY_RESULT,
} from "../sanity-api/types/sanity.types";
import {
  _linkResolver,
  _localizeField,
  _localizeText,
  _parseJsonStringArray,
} from "../sanity-api/utils";
import { urlFor } from "../sanity-api/sanity-utils";
import useCart from "../context/CartContext";
import KeenSlider from "./ui/KeenSlider";
import Figure from "./ui/Figure";
import Rebonds from "./Rebonds";
import BtnAddToCart from "./ui/btns/BtnAddToCart";
import { ProductExpanded } from "../sanity-api/types/sanity-expanded.types";
import { PortableText } from "@portabletext/react";
import portableTextComponents from "../sanity-api/portableTextComponents";

type Props = {
  input: PRODUCT_QUERY_RESULT;
};

const ContentProduct = ({ input }: Props) => {
  const { addToCart } = useCart();

  if (!input) return null;
  const {
    imageCover,
    title,
    text,
    price,
    inStock,
    artists,
    images,
    // languages,
    metas,
    publicationDate,
    related,
    editeur,
    auteurs,
    traducteurs,
    direction_editoriale,
    isbn,
    reliure,
    dimensions,
    nombre_de_pages,
    shopifyId,
    variants,
    categories,
    totalInventory,
  } = input;

  const localizedTitle = (_localizeField(title) as string) || "";

  const isLowStock = totalInventory && totalInventory < 10;

  return (
    <div className='content content--product'>
      <div className='container-fluid'>
        <div className='grid md:grid-cols-4 gap-gutter mb-lg items-start'>
          <div className='header'>
            <div>
              <h1 className='c-h2'>{_localizeField(title)}</h1>
              {artists && artists.length > 0 && (
                <div className='subtitle c-chapo c-chapo--i'>
                  {(artists as unknown as Artist[])
                    .map((a) => a.name)
                    .join(", ")}
                </div>
              )}
            </div>
            <div className='price c-h2'>{price}€</div>
            <div className='stock'>
              {isLowStock ? _localizeText("isLowStock") : ""}
            </div>

            <BtnAddToCart input={input as unknown as ProductExpanded} />

            <ul className='sidebar'>
              {editeur && (
                <li className='sidebar__item'>
                  <div>{_localizeText("editor")}</div>
                  <div className='c-body--tight'>{editeur}</div>
                </li>
              )}
              {auteurs && (
                <li className='sidebar__item'>
                  <div>{_localizeText("auteurs")}</div>
                  <div className='c-body--tight'>
                    {_parseJsonStringArray(auteurs)}
                  </div>
                </li>
              )}
              {traducteurs && (
                <li className='sidebar__item'>
                  <div>{_localizeText("traducteurs")}</div>
                  <div className='c-body--tight'>{traducteurs}</div>
                </li>
              )}
              {direction_editoriale && (
                <li className='sidebar__item'>
                  <div>{_localizeText("direction_editoriale")}</div>
                  <div className='c-body--tight'>{direction_editoriale}</div>
                </li>
              )}
              {isbn && (
                <li className='sidebar__item'>
                  <div>ISBN</div>
                  <div className='c-body--tight'>{isbn}</div>
                </li>
              )}
              {reliure && (
                <li className='sidebar__item'>
                  <div>{_localizeText("reliure")}</div>
                  <div className='c-body--tight'>{reliure}</div>
                </li>
              )}
              {dimensions && (
                <li className='sidebar__item'>
                  <div>{_localizeText("dimensions")}</div>
                  <div className='c-body--tight'>{dimensions}</div>
                </li>
              )}
              {nombre_de_pages && (
                <li className='sidebar__item'>
                  <div>{_localizeText("nombre_de_pages")}</div>
                  <div className='c-body--tight'>{nombre_de_pages}</div>
                </li>
              )}
              {publicationDate && (
                <li className='sidebar__item'>
                  <div>{_localizeText("publicationDate")}</div>
                  <div className='c-body--tight'>{publicationDate}</div>
                </li>
              )}
              {/* {languages && (
                <li className='sidebar__item'>
                  <div>{_localizeText("Langues")}</div>
                  <div className='c-body--tight'>{languages}</div>
                </li>
              )} */}

              {categories && categories.length > 0 && (
                <li className='sidebar__item'>
                  <div>{_localizeText("categories")}</div>
                  <div className='c-body--tight'>
                    {categories
                      .map((cat) => cat && _localizeField(cat.title))
                      .filter(Boolean)
                      .join(", ")}
                  </div>
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
            <div className='slider md:col-span-3 '>
              <KeenSlider perView={1} controlsFloating={true}>
                {imageCover && (
                  <div
                    key={`${imageCover && imageCover.asset?._id}-00`}
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
        {text && (
          <div className='grid md:grid-cols-4 gap-gutter'>
            <div className='md:col-span-3-'></div>
            <div className='md:col-span-2'>
              <div className='text'>
                <PortableText
                  value={text}
                  components={portableTextComponents}
                />
              </div>
            </div>
            <div className='md:col-span-1'></div>
          </div>
        )}
      </div>
      {related && related.length > 0 && (
        <Rebonds input={related} title='aroundThertist' />
      )}
      {/* <pre>{JSON.stringify(related, null, 2)}</pre> */}
    </div>
  );
};

export default ContentProduct;
