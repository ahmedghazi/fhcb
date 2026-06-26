"use client";
import { _localizeField } from "@/app/sanity-api/utils";
import { SanityFilterDef } from "./filters.types";

type FilterCheckboxDef = Extract<SanityFilterDef, { _type: "filterCheckbox" }>;

type Props = {
  def: FilterCheckboxDef;
  activeValues: string[];
  onToggle: (key: string, value: string) => void;
};

const FilterCheckbox = ({ def, activeValues, onToggle }: Props) => {
  const opts = def.filterOptions ?? [];

  return (
    <div className='ui-filters ui-filter__wrapper ui-filter__checkbox'>
      <div className='ui-filters__summary'>
        {/* {def.radioLabel && (
        <span className='ui-filter__label'>
          {_localizeField(def.radioLabel)}
        </span>
      )} */}
        {/* <pre>{JSON.stringify(opts)}</pre> */}
        <fieldset className='ui-filters__radio'>
          {opts?.map((opt) => (
            <label key={opt._id}>
              <input
                className='ui-checkbox'
                type='checkbox'
                name={def.filterKey}
                value={opt._id}
                checked={activeValues.includes(opt._id)}
                // onChange={() => onSelect(def.filterKey, opt._id)}
                onChange={() => onToggle(def.filterKey, opt._id)}
              />
              <span>{_localizeField(opt.name ?? opt.title)}</span>
            </label>
          ))}
        </fieldset>
      </div>
    </div>
  );
};

export default FilterCheckbox;
