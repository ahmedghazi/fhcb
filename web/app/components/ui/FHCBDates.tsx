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
  displayLocations?: boolean;
};

const LocationSlot = ({ location }: { location: Location }) => {
  const localizedTitle: string = _localizeField(location.title)
    .replace(/, cube/gi, "")
    .replace(/, tube/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  return (
    <div className={clsx("location", location.inSite && "location--is-insite")}>
      {localizedTitle}
    </div>
  );
};

const FHCBDates = ({ input, displayLocations = true }: Props) => {
  const { locale } = useLocale();
  const dates = input || [];
  const hasSeveralDates = dates.length > 1;
  const ossSiteLocations = ["offSite", "travelling"];
  const hasDatesOffSite = dates.some(
    (el) => !!el.locationType && ossSiteLocations.includes(el.locationType),
  );
  // console.log("displayLocations", displayLocations);
  return (
    <div
      className={clsx(
        "fhcb-dates",
        hasSeveralDates && "fhcb-dates--multiple",
        hasDatesOffSite && "fhcb-dates--with-offsite",
      )}>
      {dates.map((date: FhcbDate, index) => {
        if (!date) return null;
        const fmt = _fhcbDates(date, locale);

        return (
          <div
            key={index}
            className={clsx(
              "fhcb-date",
              dateIsInSite(date) ? "in-site" : "off-site",
              date.location && "has-location",
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
                {/* <pre>{JSON.stringify(date, null, 2)}</pre> */}
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
      })}
    </div>
  );
};

export default FHCBDates;
