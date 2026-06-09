"use client";
import { _fhcbDates, dateIsInSite } from "@/app/lib/utils";
import { FhcbDate, Location } from "@/app/sanity-api/types/sanity.types";
import useLocale from "@/app/context/LocaleContext";
import React from "react";
import { time } from "console";
import { _localizeField } from "@/app/sanity-api/utils";
import clsx from "clsx";

type Props = {
  input: FhcbDate[];
};

const LocationSlot = ({ location }: { location: Location }) => {
  return (
    <div className={clsx("location", location.inSite && "location--is-insite")}>
      {_localizeField(location.title)}
    </div>
  );
};

const FHCBDates = ({ input }: Props) => {
  const { locale } = useLocale();
  const dates = input || [];
  const hasSeveralDates = dates.length > 1;
  return (
    <div
      className={clsx("fhcb-dates", hasSeveralDates && "fhcb-dates--multiple")}>
      {dates.map((date: FhcbDate, index) => {
        if (!date) return null;
        const fmt = _fhcbDates(date, locale);

        return (
          <div
            key={index}
            className={clsx(
              "fhcb-date",
              dateIsInSite(date) ? "in-site" : "off-site",
            )}>
            {fmt.type === "different-years" && (
              <>
                <time dateTime={date.du ?? undefined}>{fmt.du}</time>
                <br />
                <time dateTime={date.au ?? undefined}>→ {fmt.au}</time>
                {date.location && (
                  <LocationSlot
                    location={date.location as unknown as Location}
                  />
                )}
              </>
            )}
            {fmt.type === "same-year" && (
              <>
                <time dateTime={date.du ?? undefined}>
                  {fmt.du} → {fmt.au} {fmt.year}
                </time>
                {date.location && (
                  <LocationSlot
                    location={date.location as unknown as Location}
                  />
                )}
              </>
            )}
            {fmt.type === "with-time" && (
              <>
                <time dateTime={date.du ?? undefined}>
                  {fmt.date} | {fmt.timeStart}
                  {fmt.timeEnd ? `–${fmt.timeEnd}` : ""}
                </time>
                {date.location && (
                  <LocationSlot
                    location={date.location as unknown as Location}
                  />
                )}
              </>
            )}
            {fmt.type !== "with-time" &&
              fmt.type !== "same-year" &&
              fmt.type !== "different-years" && (
                <>
                  <time dateTime={date.du ?? undefined}>{fmt.date}</time>
                  {date.location && (
                    <LocationSlot
                      location={date.location as unknown as Location}
                    />
                  )}
                </>
              )}
          </div>
        );
        /*if (fmt.type === "different-years") {
          return (
            <div key={index} className='fhcb-date'>
              <time dateTime={date.du ?? undefined}>{fmt.du}</time>
              <br />
              <time dateTime={date.au ?? undefined}>→ {fmt.au}</time>
              {date.location && (
                <LocationSlot location={date.location as unknown as Location} />
              )}
            </div>
          );
        }

        if (fmt.type === "same-year") {
          return (
            <div key={index} className='fhcb-date'>
              <time dateTime={date.du ?? undefined}>
                {fmt.du} → {fmt.au} {fmt.year}
              </time>
              {date.location && (
                <LocationSlot location={date.location as unknown as Location} />
              )}
            </div>
          );
        }

        if (fmt.type === "with-time") {
          return (
            <div key={index} className='fhcb-date'>
              <time dateTime={date.du ?? undefined}>
                {fmt.date} | {fmt.timeStart}
                {fmt.timeEnd ? `–${fmt.timeEnd}` : ""}
              </time>
              {date.location && (
                <LocationSlot location={date.location as unknown as Location} />
              )}
            </div>
          );
        }*/

        // return (
        //   <div key={index} className='fhcb-date'>
        //     <time dateTime={date.du ?? undefined}>{fmt.date}</time>
        //     {date.location && (
        //       <LocationSlot location={date.location as unknown as Location} />
        //     )}
        //   </div>
        // );
      })}
    </div>
  );
};

export default FHCBDates;
