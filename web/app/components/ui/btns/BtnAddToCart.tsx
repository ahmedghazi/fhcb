import useCart from "@/app/context/CartContext";
import { urlFor } from "@/app/sanity-api/sanity-utils";
import { ProductExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import {
  PRODUCT_QUERY_RESULT,
  ProductVariant,
} from "@/app/sanity-api/types/sanity.types";
import {
  _linkResolver,
  _localizeField,
  _localizeText,
} from "@/app/sanity-api/utils";
import clsx from "clsx";
import React, { useEffect, useState } from "react";

type VariantsListProps = {
  input: Array<
    {
      _key: string;
    } & ProductVariant
  >;
  onChange: (variant: ProductVariant) => void;
};
const VariantsList = ({ input, onChange }: VariantsListProps) => {
  const _onToggle = (value: ProductVariant) => {
    onChange(value);
  };
  useEffect(() => {
    if (input.length === 1) {
      _onToggle(input[0]);
    }
  }, [input]);

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
              checked={input.length === 1}
              // checked={activeValues.includes(opt._id)}
              onChange={() => _onToggle(item || "")}
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
  const [variant, setVariant] = useState<ProductVariant | null>(null);

  const _handleAddToCart = () => {
    const activeVariant = isSimpleProduct ? variants?.[0] : variant;
    const variantId = activeVariant?.shopifyVariantId || shopifyId;
    if (!variantId) return;
    addToCart({
      id: variantId.split("/").pop()!,
      title: localizedTitle,
      variant: !isSimpleProduct
        ? (activeVariant?.title ?? undefined)
        : undefined,
      price: activeVariant?.price ?? price ?? 0,
      image: imageCover?.asset ? urlFor(imageCover.asset, 200) : undefined,
      href: _linkResolver(input),
    });
  };

  return (
    <div className='form-add-to-cart'>
      {!isSimpleProduct && (
        <VariantsList input={variants || []} onChange={setVariant} />
      )}
      <button
        className={clsx(
          "add-to-cart btn",
          !isSimpleProduct && !variant && "disabled",
        )}
        onClick={_handleAddToCart}>
        {_localizeText("addToCart")}
      </button>
    </div>
  );
};

export default BtnAddToCart;
