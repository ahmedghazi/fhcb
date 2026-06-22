"use client";
import { _localizeField, _localizeText } from "@/app/sanity-api/utils";
import React, { useState } from "react";
import { ActiveFilters, SanityFilterDef } from "./filters.types";
import FilterList from "./FilterList";
import FilterRadio from "./FilterRadio";
import clsx from "clsx";
import FilterCheckbox from "./FilterCheckbox";
import FilterToggle from "./FilterToggle";

type Props = {
  filterDefs: SanityFilterDef[];
  onChange: (filters: ActiveFilters) => void;
};

const FilterBar = ({ filterDefs, onChange }: Props) => {
  const [active, setActive] = useState<ActiveFilters>({});
  const isFiltering = Object.keys(active).length != 0;

  const _update = (key: string, value: string) => {
    const next = { ...active, [key]: value };
    if (!value) delete next[key];
    setActive(next);
    onChange(next);
  };

  const _toggle = (key: string, value: string) => {
    console.log("toggle", key, value);
    const current = active[key];
    const arr = Array.isArray(current) ? current : current ? [current] : [];
    const next = {
      ...active,
      [key]: arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value],
    };
    if ((next[key] as string[]).length === 0) delete next[key];
    setActive(next);
    onChange(next);
  };

  const _reset = () => {
    setActive({});
    onChange({});
  };

  return (
    <div className={clsx("filters", isFiltering && "is-active")}>
      {/* <pre>{JSON.stringify(filterDefs, null, 2)}</pre> */}
      <div className='filters__inner'>
        <div className='flex gap-sm' suppressHydrationWarning>
          {filterDefs.map((def) => {
            if (def._type === "filterSort") {
              return (
                <div className='ui-filter__wrapper' key={def._key}>
                  <select
                    className='ui-filters ui-filters__select'
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
                <div className='ui-filters ui-filter__wrapper' key={def._key}>
                  <input
                    type='search'
                    value={active["search"] ?? ""}
                    onChange={(e) => _update("search", e.target.value)}
                    placeholder={_localizeText("search")}
                    className='ui-filters__search'
                  />
                </div>
              );
            }

            if (def._type === "filterList") {
              const rawOpts = def.filterOptions ?? [];
              const opts = rawOpts.map((opt) =>
                typeof opt === "string"
                  ? { _id: opt, _type: "language" as const, name: opt }
                  : opt,
              );

              return (
                <FilterList
                  key={def._key}
                  def={def}
                  opts={opts}
                  activeValues={
                    Array.isArray(active[def.filterKey])
                      ? (active[def.filterKey] as string[])
                      : active[def.filterKey]
                        ? [active[def.filterKey] as string]
                        : []
                  }
                  onToggle={_toggle}
                />
              );
            }

            if (def._type === "filterCheckbox") {
              return (
                <FilterCheckbox
                  key={def._key}
                  def={def}
                  activeValues={
                    Array.isArray(active[def.filterKey])
                      ? (active[def.filterKey] as string[])
                      : active[def.filterKey]
                        ? [active[def.filterKey] as string]
                        : []
                  }
                  onToggle={_toggle}
                />
              );
            }

            if (def._type === "filterRadio") {
              return (
                <FilterRadio
                  key={def._key}
                  def={def}
                  activeValue={
                    Array.isArray(active[def.filterKey])
                      ? ""
                      : ((active[def.filterKey] as string) ?? "")
                  }
                  onSelect={_update}
                />
              );
            }

            if (def._type === "filterToggle") {
              return (
                <FilterToggle
                  key={def._key}
                  def={def}
                  active={!!active[def.filterKey]}
                  onChange={_update}
                />
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
