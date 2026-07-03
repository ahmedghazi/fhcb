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
} from "../sanity-api/utils";
import { urlFor } from "../sanity-api/sanity-utils";
import useCart from "../context/CartContext";
import KeenSlider from "./ui/KeenSlider";
import Figure from "./ui/Figure";
import Rebonds from "./Rebonds";
import BtnAddToCart from "./ui/btns/BtnAddToCart";
import { ProductExpanded } from "../sanity-api/types/sanity-expanded.types";

type Props = {
  input: PRODUCT_QUERY_RESULT;
};

const ContentProduct = ({ input }: Props) => {
  const { addToCart } = useCart();

  if (!input) return null;
  const {
    imageCover,
    title,
    price,
    inStock,
    artists,
    images,
    isbn,
    editeur,
    languages,
    metas,
    publicationDate,
    related,
    shopifyId,
    variants,
  } = input;

  const localizedTitle = (_localizeField(title) as string) || "";

  const _handleAddToCart = () => {
    const variantId = variants?.[0]?.shopifyVariantId || shopifyId;
    if (!variantId) return;
    addToCart({
      id: variantId.split("/").pop()!,
      title: localizedTitle,
      price: variants?.[0]?.price ?? price ?? 0,
      image: imageCover?.asset ? urlFor(imageCover.asset, 200) : undefined,
      href: _linkResolver(input),
    });
  };

  return (
    <div className='content content--product'>
      <div className='container-fluid'>
        <div className='grid md:grid-cols-4 gap-gutter mb-lg'>
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
              {inStock ? _localizeText("inStock") : _localizeText("outOfStock")}
            </div>
            {/* <button className='add-to-cart btn' onClick={_handleAddToCart}>
              {_localizeText("addToCart")}
            </button> */}
            <BtnAddToCart input={input as unknown as ProductExpanded} />
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
      {related && related.length > 0 && (
        <Rebonds input={related} title='aroundThertist' />
      )}
      {/* <pre>{JSON.stringify(related, null, 2)}</pre> */}
    </div>
  );
};

export default ContentProduct;
