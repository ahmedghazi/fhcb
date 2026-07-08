"use client";
import { _localizeField } from "@/app/sanity-api/utils";
import { SanityFilterDef } from "./filters.types";

type FilterRadioDef = Extract<SanityFilterDef, { _type: "filterRadio" }>;

type Props = {
  def: FilterRadioDef;
  activeValue: string;
  onSelect: (key: string, value: string) => void;
};

const FilterRadio = ({ def, activeValue, onSelect }: Props) => {
  const opts = def.filterOptions ?? [];

  return (
    <div className='ui-filters ui-filter__wrapper ui-filter__radio'>
      <div className='ui-filters__summary uppercase'>
        {def.filterLabel && (
          <span className='ui-filter__label'>
            {_localizeField(def.filterLabel)}
          </span>
        )}
        <fieldset className='ui-filters__radio'>
          {opts.map((opt) => (
            <label key={opt._id}>
              <input
                className='ui-radio'
                type='radio'
                name={def.filterKey}
                value={opt._id}
                checked={activeValue === opt._id}
                onChange={() => onSelect(def.filterKey, opt._id)}
              />
              <span>{_localizeField(opt.name ?? opt.title)}</span>
            </label>
          ))}
        </fieldset>
      </div>
    </div>
  );
};

export default FilterRadio;
