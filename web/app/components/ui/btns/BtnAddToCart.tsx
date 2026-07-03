import useCart from "@/app/context/CartContext";
import { urlFor } from "@/app/sanity-api/sanity-utils";
import { ProductExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import {
  Product,
  PRODUCT_QUERY_RESULT,
  ProductVariant,
} from "@/app/sanity-api/types/sanity.types";
import {
  _linkResolver,
  _localizeField,
  _localizeText,
} from "@/app/sanity-api/utils";
import React from "react";

type VariantsListProps = {
  input: Array<
    {
      _key: string;
    } & ProductVariant
  >;
};
const VariantsList = ({ input }: VariantsListProps) => {
  const _onToggle = (value: string) => {
    console.log(value);
  };
  return (
    <ul className='variants-list'>
      {input?.map((item, i) => (
        <li key={i}>
          <label className='ui-filter__checkbox'>
            <input
              className='ui-checkbox'
              type='radio'
              name={"language"}
              value={item.title}
              // checked={activeValues.includes(opt._id)}
              onChange={() => _onToggle(item.title || "")}
            />
            <span>{item.title}</span>
          </label>
        </li>
      ))}
    </ul>
  );
};

type Props = {
  input: ProductExpanded;
};

const BtnAddToCart = ({ input }: Props) => {
  const { addToCart } = useCart();
  const { imageCover, title, price, shopifyId, variants } = input;
  const isSimpleProduct = !variants || variants.length === 0;
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
    <div className='form-add-to-cart'>
      {!isSimpleProduct && <VariantsList input={variants || []} />}
      <button className='add-to-cart btn' onClick={_handleAddToCart}>
        {_localizeText("addToCart")}
      </button>
    </div>
  );
};

export default BtnAddToCart;
