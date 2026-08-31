"use client";
import React from "react";
import {
  Product,
  PRODUCT_QUERY_RESULT,
} from "../sanity-api/types/sanity.types";
import {
  _linkResolver,
  _localizeField,
  _localizeText,
  _parseJsonStringArray,
} from "../sanity-api/utils";
// import { urlFor } from "../sanity-api/sanity-utils";
// import useCart from "../context/CartContext";
import Figure from "./ui/Figure";
import Rebonds from "./Rebonds";
import BtnAddToCart from "./shop/BtnAddToCart";
import { ProductExpanded } from "../sanity-api/types/sanity-expanded.types";
import { PortableText } from "@portabletext/react";
import portableTextComponents from "../sanity-api/portableTextComponents";
import { _date, _pickRelatedWithQuota, artistsToString } from "../lib/utils";
import useLocale from "../context/LocaleContext";
import SlickSlider from "./ui/SlickSlider";

type Props = {
  input: PRODUCT_QUERY_RESULT;
};

const ContentProduct = ({ input }: Props) => {
  if (!input) return null;
  const { locale } = useLocale();
  const {
    imageCover,
    title,
    text,
    price,
    artists,
    artistName,
    images,
    publicationDate,
    rebondsAuto,
    relatedProductsByArtist,
    relatedProductsByTag,
    editeur,
    auteurs,
    traducteurs,
    direction_editoriale,
    isbn,
    reliure,
    dimensions,
    nombre_de_pages,
    version_linguistique,
    totalInventory,
  } = input;
  // const mergedRelated = [
  //   ...(relatedProductsByArtist || []),
  //   ...(relatedProductsByTag || []),
  //   ...(randomProducts || []),
  // ].slice(0, 4);
  // const related = _pickRelatedWithQuota(
  //   [relatedProductsByArtist, relatedProductsByTag, randomProducts],
  //   [2, 1, 1],
  //   4,
  // );

  const isLowStock = totalInventory && totalInventory < 10;

  return (
    <div className='content content--product'>
      <div className='container-fluid'>
        <div className='grid md:grid-cols-4 gap-gutter mb-lg items-start'>
          <div className='header'>
            <div>
              <h1 className='c-h2'>{_localizeField(title)}</h1>
              <div className='subtitle c-chapo c-chapo--i'>
                {artists && artists.length > 0 && artistsToString(artists)}
                {!artists && <span>{_parseJsonStringArray(artistName)}</span>}
              </div>
            </div>
            <div className='price c-h2'>{price} €</div>
            {/* <div className='stock'>
              {isLowStock ? _localizeText("isLowStock") : ""}
            </div> */}

            <BtnAddToCart input={input as unknown as ProductExpanded} />

            <ul className='sidebar'>
              {/* {artists && (
                <li className='sidebar__item'>
                  <div className='c-tag underline'>
                    {_localizeText("artist_s")}
                  </div>
                  <div className='c-body--tight'>
                    {artists.map((item, i) => (
                      <span key={i}>{item.name}</span>
                    ))}
                  </div>
                </li>
              )} */}
              {editeur && (
                <li className='sidebar__item'>
                  <div className='c-tag underline'>
                    {_localizeText("editor")}
                  </div>
                  <div className='c-body--tight'>{editeur}</div>
                </li>
              )}
              {direction_editoriale && (
                <li className='sidebar__item'>
                  <div className='c-tag underline'>
                    {_localizeText("direction_editoriale")}
                  </div>
                  <div className='c-body--tight'>{direction_editoriale}</div>
                </li>
              )}
              {auteurs && (
                <li className='sidebar__item'>
                  <div className='c-tag underline'>
                    {_localizeText("auteurs")}
                  </div>
                  <div className='c-body--tight'>
                    {_parseJsonStringArray(auteurs)}
                  </div>
                </li>
              )}
              {traducteurs && (
                <li className='sidebar__item'>
                  <div className='c-tag underline'>
                    {_localizeText("traducteurs")}
                  </div>
                  <div className='c-body--tight'>{traducteurs}</div>
                </li>
              )}
              {publicationDate && (
                <li className='sidebar__item'>
                  <div className='c-tag underline'>
                    {_localizeText("publicationDate")}
                  </div>
                  <div className='c-body--tight'>
                    {_date(publicationDate, locale)}
                  </div>
                </li>
              )}
              {(dimensions ||
                nombre_de_pages ||
                reliure ||
                version_linguistique) && (
                <li className='sidebar__item'>
                  {dimensions && (
                    <div className='c-body--tight'>
                      {_localizeField(dimensions)}
                    </div>
                  )}
                  {nombre_de_pages && (
                    <div className='c-body--tight'>
                      {_localizeField(nombre_de_pages)}
                    </div>
                  )}
                  {reliure && (
                    <div className='c-body--tight'>
                      {_localizeField(reliure)}
                    </div>
                  )}
                  {/* {version_linguistique && (
                    <div className='c-body--tight'>
                      {_localizeField(version_linguistique)}
                    </div>
                  )} */}
                  {/* {isbn && <div className='c-body--tight'>ISBN: {isbn}</div>} */}

                  {/* {traducteurs && (
                    <div className='c-body--tight'>{traducteurs}</div>
                  )}
                  {direction_editoriale && (
                    <div className='c-body--tight'>{direction_editoriale}</div>
                  )} */}
                </li>
              )}

              {isbn && (
                <li className='sidebar__item'>
                  <div className='c-tag underline'>{_localizeText("isbn")}</div>
                  <div className='c-body--tight'>{isbn}</div>
                </li>
              )}
            </ul>
          </div>
          {images && (
            <div className='slider md:col-span-3 '>
              <SlickSlider
                controlsFloating
                isSingle={images.length === 0}
                settings={{
                  infinite: true,
                  adaptiveHeight: true,
                  // centerMode: true,
                  // variableWidth: true,
                }}>
                {imageCover && (
                  <div
                    key={`${imageCover && imageCover.asset?._id}-00`}
                    className='product-slider__slide'>
                    <Figure
                      asset={imageCover.asset}
                      width={2000}
                      sizes='800px'
                    />
                  </div>
                )}
                {images.map((item, index: number) => (
                  <div
                    key={`${item && item.asset?._id}-${index}`}
                    className='product-slider__slide'>
                    <Figure asset={item.asset} sizes='800px' />
                  </div>
                ))}
              </SlickSlider>
            </div>
          )}
        </div>
        {text && (
          <div className='grid md:grid-cols-4 gap-gutter'>
            <div className='md:col-span-3-'></div>
            <div className='md:col-span-2'>
              <div className='text'>
                <PortableText
                  value={_localizeField(text)}
                  components={portableTextComponents}
                />
              </div>
            </div>
            <div className='md:col-span-1'></div>
          </div>
        )}
      </div>

      {/* {related && related.length > 0 && (
        <Rebonds input={related} title='aroundThertist' />
      )} */}

      {/* <pre>{JSON.stringify(relatedProductsByArtist, null, 2)}</pre> */}
      {/* {relatedProductsByArtist && (
        <Rebonds input={relatedProductsByArtist} title='sameArtist' />
      )} */}
      {/* <pre>{JSON.stringify(relatedProductsByArtist, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(mergedRelated[0], null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(rebondsAuto, null, 2)}</pre> */}

      {/* {rebondsAuto?.map((rebond, i) => (
        <Rebonds
          key={i}
          input={rebond?.resolvedItems}
          title={rebond?.title || undefined}
          items={rebond?.items}
        />
      ))}

      {related && related.length > 0 && (
        <Rebonds input={related} title='discoverToo' />
      )} */}
    </div>
  );
};

export default ContentProduct;
