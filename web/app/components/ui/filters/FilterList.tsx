"use client";
import { _localizeField } from "@/app/sanity-api/utils";
import { FilterRadioOption, SanityFilterDef } from "./filters.types";
import { useEffect, useState } from "react";
import useLocale from "@/app/context/LocaleContext";
import clsx from "clsx";
import { publish } from "pubsub-js";

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
  const { locale } = useLocale();

  useEffect(() => {
    publish("TOGGLE_SCROLL", !open);
  }, [open]);

  // Pure localizer — no hook, safe to call in loops
  const loc = (field: any): string => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[locale] ?? field["fr"] ?? "";
  };

  const letters = Array.from(
    new Set(
      opts.map((o) =>
        loc(o.name ?? o.title)
          .charAt(0)
          .toUpperCase(),
      ),
    ),
  ).sort();

  const activeLetters = new Set(
    opts
      .filter((o) => activeValues.includes(o._id))
      .map((o) =>
        loc(o.name ?? o.title)
          .charAt(0)
          .toUpperCase(),
      ),
  );

  return (
    <div
      className={clsx(
        "ui-filters ui-filter__wrapper ui-filter__list",
        open && "is-open",
      )}>
      <label htmlFor={`filter-list-${def._key}`} onClick={() => setOpen(!open)}>
        <span>{_localizeField(def.radioLabel)}</span>
        <svg
          width='8'
          height='9'
          viewBox='0 0 8 9'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M0 4.0625H1.2124L3.12939 6.96973L3.23096 6.94434C3.19287 6.65658 3.1696 6.2736 3.16113 5.79541L3.16113 0L4.23389 1.35151e-08L4.24023 5.79541C4.24023 6.22282 4.21696 6.60579 4.17041 6.94434L4.27832 6.96973L6.19531 4.0625H7.40137L3.88477 8.88672H3.5166L0 4.0625Z'
            fill='black'
          />
        </svg>
      </label>
      <div className='ui-filter__detail'>
        <div className='ui-filter__list-alpha'>
          {letters.map((letter) => (
            <button
              key={letter}
              className={clsx(
                "ui-filter__list-alpha-btn btn--chip",
                (selectedLetter?.includes(letter) ||
                  activeLetters.has(letter)) &&
                  "is-active",
              )}
              onClick={() => {
                setSelectedLetter((prev) =>
                  prev?.includes(letter)
                    ? prev.filter((l) => l !== letter)
                    : [...(prev || []), letter],
                );
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
                    loc(o.name ?? o.title)
                      .charAt(0)
                      .toUpperCase() === letter,
                )
                .sort((a, b) =>
                  loc(a.name ?? a.title).localeCompare(loc(b.name ?? b.title)),
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
                    <span>{loc(opt.name ?? opt.title)}</span>
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
