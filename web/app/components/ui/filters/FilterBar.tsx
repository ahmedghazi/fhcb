"use client";
import { _localizeField, _localizeText } from "@/app/sanity-api/utils";
import React, { useState } from "react";
import { ActiveFilters, SanityFilterDef } from "./filters.types";
import clsx from "clsx";

type Props = {
  filterDefs: SanityFilterDef[];
  onChange: (filters: ActiveFilters) => void;
};

const FilterBar = ({ filterDefs, onChange }: Props) => {
  const [active, setActive] = useState<ActiveFilters>({});
  console.log(active);
  const isFiltering = Object.keys(active).length != 0;

  const _update = (key: string, value: string) => {
    console.log(key, value);
    const next = { ...active, [key]: value };
    setActive(next);
    onChange(next);
  };

  const _reset = () => {
    setActive({});
    onChange({});
  };

  return (
    <div className={clsx("filters", isFiltering && "is-active")}>
      <div className='filters__inner'>
        <div className='flex gap-sm' suppressHydrationWarning>
          {filterDefs.map((def) => {
            if (def._type === "filterSort") {
              return (
                <div className='ui-filter__wrapper'>
                  <select
                    className='ui-filters ui-filters__select'
                    key={def._key}
                    value={active["sort"] ?? ""}
                    onChange={(e) => _update("sort", e.target.value)}
                    aria-label={_localizeText("sort")}>
                    <option value=''>{_localizeText("sort")}</option>
                    {def.sortOptions?.map((opt) => (
                      <option
                        key={opt._key}
                        value={`${opt.field}-${opt.direction}`}>
                        {_localizeField(opt.label)}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            if (def._type === "filterSearch") {
              return (
                <div className='ui-filters ui-filter__wrapper'>
                  <input
                    key={def._key}
                    type='search'
                    value={active["search"] ?? ""}
                    onChange={(e) => _update("search", e.target.value)}
                    placeholder={_localizeText("search")}
                    className='ui-filters__search'
                  />
                </div>
              );
            }

            if (def._type === "filterRadio") {
              return (
                <div className='ui-filters ui-filter__wrapper'>
                  <fieldset key={def._key} className='ui-filters__radio'>
                    {/* {def.radioLabel && (
                    <legend>{_localizeField(def.radioLabel)}</legend>
                  )} */}
                    {/* <label>
                    <input
                      type='radio'
                      name={def.radioKey}
                      value=''
                      checked={!active[def.radioKey]}
                      onChange={() => _update(def.radioKey, "")}
                    />
                    <span>{_localizeText("all")}</span>
                  </label> */}
                    {def.radioOptions?.map((opt) => (
                      <label key={opt._id}>
                        <input
                          type='radio'
                          name={def.radioKey}
                          value={opt._id}
                          checked={active[def.radioKey] === opt._id}
                          onChange={() => _update(def.radioKey, opt._id)}
                        />
                        <span>{_localizeField(opt.name ?? opt.title)}</span>
                      </label>
                    ))}
                  </fieldset>
                </div>
              );
            }

            return null;
          })}
        </div>
        <button onClick={_reset} className={clsx("reset")}>
          {_localizeText("resetFilters")}
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
