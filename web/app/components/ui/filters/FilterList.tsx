"use client";
import { _localizeField } from "@/app/sanity-api/utils";
import { FilterRadioOption, SanityFilterDef } from "./filters.types";
import { useState } from "react";
import clsx from "clsx";

type FilterListDef = Extract<SanityFilterDef, { _type: "filterList" }>;

type Props = {
  def: FilterListDef;
  opts: FilterRadioOption[];
  activeValues: string[];
  onToggle: (key: string, value: string) => void;
};

const FilterList = ({ def, opts, activeValues, onToggle }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedLetter, setSelectedLetter] = useState<string[]>([]);

  const letters = Array.from(
    new Set(
      opts.map((o) =>
        (_localizeField(o.name ?? o.title) ?? "").charAt(0).toUpperCase(),
      ),
    ),
  ).sort();

  return (
    <div
      className={clsx(
        "ui-filters ui-filter__wrapper ui-filter__list",
        open && "is-open",
      )}>
      <label htmlFor={`filter-list-${def._key}`} onClick={() => setOpen(!open)}>
        {_localizeField(def.radioLabel)}
      </label>
      <div className='ui-filter__detail'>
        <div className='ui-filter__list-alpha'>
          {letters.map((letter) => (
            <button
              key={letter}
              className={clsx(
                "ui-filter__list-alpha-btn btn--chip",
                selectedLetter?.includes(letter) && "is-active",
              )}
              onClick={() => {
                setSelectedLetter((prev) => {
                  if (prev?.includes(letter)) {
                    return prev.filter((l) => l !== letter);
                  }
                  return [...(prev || []), letter];
                });
              }}>
              {letter}
            </button>
          ))}
        </div>
        <div className='ui-filter__list-items'>
          {letters.map((letter) => (
            <div
              key={letter}
              id={`filter-list-${def._key}-${letter}`}
              hidden={
                selectedLetter.length > 0 &&
                !selectedLetter.some((l) => l.startsWith(letter))
              }>
              {opts
                .filter(
                  (o) =>
                    (_localizeField(o.name ?? o.title) ?? "")
                      .charAt(0)
                      .toUpperCase() === letter,
                )
                .sort((a, b) =>
                  (_localizeField(a.name ?? a.title) ?? "").localeCompare(
                    _localizeField(b.name ?? b.title) ?? "",
                  ),
                )
                .map((opt) => (
                  <label key={opt._id} className='ui-filters__checkbox'>
                    <input
                      className='ui-checkbox'
                      type='checkbox'
                      name={def.radioKey}
                      value={opt._id}
                      checked={activeValues.includes(opt._id)}
                      onChange={() => onToggle(def.radioKey, opt._id)}
                    />
                    <span>{_localizeField(opt.name ?? opt.title)}</span>
                  </label>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterList;
