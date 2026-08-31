import React, { useEffect, useState } from "react";

import { ProductVariant } from "@/app/sanity-api/types/sanity.types";
import clsx from "clsx";

type VariantsListProps = {
  input: Array<
    {
      _key: string;
    } & ProductVariant
  >;
  onChange: (variant: ProductVariant) => void;
};
const VariantsList = ({ input, onChange }: VariantsListProps) => {
  const [selectedKey, setSelectedKey] = useState<string | undefined>(() =>
    input.length === 1 ? input[0]._key : undefined,
  );
  const _onToggle = (value: { _key: string } & ProductVariant) => {
    setSelectedKey(value._key);
    onChange(value);
  };
  useEffect(() => {
    if (input.length === 1) {
      _onToggle(input[0]);
    }
  }, [input]);

  return (
    <ul
      className={clsx(
        "variants-list",
        input.length === 1 && "variants-list--single",
      )}>
      {input?.map((item, i) => (
        <li key={i}>
          <label
            className={clsx(
              "ui-filter__checkbox",
              item._key === selectedKey && "ui-filter__checkbox-checked",
            )}>
            <input
              className='ui-checkbox'
              type='radio'
              name={"language"}
              value={item.title}
              checked={item._key === selectedKey}
              onChange={() => _onToggle(item)}
            />
            <span>{item.title}</span>
          </label>
        </li>
      ))}
    </ul>
  );
};

export default VariantsList;
