import useCart from "@/app/context/CartContext";
import { urlFor } from "@/app/sanity-api/sanity-utils";
import { ProductExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import {
  Product,
  PRODUCT_QUERY_RESULT,
} from "@/app/sanity-api/types/sanity.types";
import {
  _linkResolver,
  _localizeField,
  _localizeText,
} from "@/app/sanity-api/utils";
import React from "react";

type Props = {
  input: ProductExpanded;
};

const BtnAddToCart = ({ input }: Props) => {
  const { addToCart } = useCart();
  const { imageCover, title, price, shopifyId, variants } = input;

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
    <button className='add-to-cart btn' onClick={_handleAddToCart}>
      {_localizeText("addToCart")}
    </button>
  );
};

export default BtnAddToCart;
