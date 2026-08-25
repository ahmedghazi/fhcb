import React, { useEffect, useState } from "react";

import { ProductVariant } from "@/app/sanity-api/types/sanity.types";

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
    <ul className='variants-list'>
      {input?.map((item, i) => (
        <li key={i}>
          <label className='ui-filter__checkbox'>
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
