"use client";
import { _fhcbDates } from "@/app/lib/utils";
import { FhcbDate } from "@/app/sanity-api/types/sanity.types";
import useLocale from "@/app/context/LocaleContext";
import React from "react";
import { time } from "console";

type Props = {
  input: FhcbDate[];
};

const FHCBDates = ({ input }: Props) => {
  const { locale } = useLocale();
  const dates = input || [];

  return (
    <div className='fhcb-dates'>
      {dates.map((date, index) => {
        const fmt = _fhcbDates(date, locale);

        if (fmt.type === "different-years") {
          return (
            <div key={index}>
              <time dateTime={date.du ?? undefined}>{fmt.du}</time>
              <br />
              <time dateTime={date.au ?? undefined}>→ {fmt.au}</time>
            </div>
          );
        }

        if (fmt.type === "same-year") {
          return (
            <div key={index}>
              <time dateTime={date.du ?? undefined}>
                {fmt.du} → {fmt.au} {fmt.year}
              </time>
            </div>
          );
        }

        if (fmt.type === "with-time") {
          return (
            <div key={index}>
              <time dateTime={date.du ?? undefined}>
                {fmt.date} | {fmt.timeStart}
                {fmt.timeEnd ? `–${fmt.timeEnd}` : ""}
              </time>
            </div>
          );
        }

        return (
          <div key={index}>
            <time dateTime={date.du ?? undefined}>{fmt.date}</time>
          </div>
        );
      })}
    </div>
  );
};

export default FHCBDates;
