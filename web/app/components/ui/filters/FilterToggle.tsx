"use client";
import { _localizeField } from "@/app/sanity-api/utils";
import { SanityFilterDef } from "./filters.types";

type FilterToggleDef = Extract<SanityFilterDef, { _type: "filterToggle" }>;

type Props = {
  def: FilterToggleDef;
  active: boolean;
  onChange: (key: string, value: string) => void;
};

const FilterToggle = ({ def, active, onChange }: Props) => {
  return (
    <div className='ui-filters ui-filter__wrapper ui-filter__toggle'>
      <div className='ui-filters__summary'>
        <label>
          <input
            className='ui-checkbox'
            type='checkbox'
            name={def.filterKey}
            checked={active}
            onChange={(e) =>
              onChange(def.filterKey, e.target.checked ? "true" : "")
            }
          />
          <span>{_localizeField(def.filterLabel)}</span>
        </label>
      </div>
    </div>
  );
};

export default FilterToggle;
