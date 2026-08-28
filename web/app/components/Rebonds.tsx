"use client";
import CardType from "./ui/cards/CardType";
import {
  _localizeField,
  _localizeText,
  _orderRebondsByItems,
} from "../sanity-api/utils";
import SliderCards from "./ui/SliderCards";
import clsx from "clsx";

type Props = {
  // input: NonNullable<FEUILLETAGE_QUERY_RESULT>["related"];
  input: any;
  // an i18n key ("discoverToo"), or a free-form (possibly localized) editorial title, e.g. rebond.title
  title?: string | Record<string, string> | null;
  // rebond.items (the editor-picked scenario order) — when provided, input is re-sorted to match it
  // instead of rebondsResolver's fixed GROQ concatenation order (grouped by document type)
  items?: string[] | null;
  layout?: "grid" | "slider";
  className?: string;
  // orderType: "unset" | "two_by_types" | "three_by_types";
};

const Rebonds = ({
  input,
  title,
  items,
  layout = "grid",
  className = "",
}: Props) => {
  if (!input || input.length === 0) return null;
  const resolvedTitle = _localizeField(title) || "";
  const orderedInput = items ? _orderRebondsByItems(items, input) : input;
  return (
    <section className={clsx("rebonds mb-lg", className)}>
      <pre>{JSON.stringify(items, null, 2)}</pre>
      <div className='container-fluid'>
        {resolvedTitle && (
          <h2 className='c-h1_5'>{_localizeText(resolvedTitle)}</h2>
        )}
        {layout === "grid" && (
          <div className='grid--centered'>
            {orderedInput?.map((item: any, i: number) => (
              <CardType key={i} input={item} context='rebonds' />
            ))}
          </div>
        )}
      </div>
      {layout === "slider" && (
        <SliderCards>
          {orderedInput?.map((item: any, i: number) => (
            <CardType key={i} input={item} context='rebonds' />
          ))}
        </SliderCards>
      )}
    </section>
  );
};

export default Rebonds;
