"use client";
import CardType from "./ui/cards/CardType";
import { _localizeField, _localizeText, _orderRebondsByItems } from "../sanity-api/utils";

type Props = {
  // input: NonNullable<FEUILLETAGE_QUERY_RESULT>["related"];
  input: any;
  // an i18n key ("discoverToo"), or a free-form (possibly localized) editorial title, e.g. rebond.title
  title?: string | Record<string, string> | null;
  // rebond.items (the editor-picked scenario order) — when provided, input is re-sorted to match it
  // instead of rebondsResolver's fixed GROQ concatenation order (grouped by document type)
  items?: string[] | null;
};

const Rebonds = ({ input, title, items }: Props) => {
  if (!input || input.length === 0) return null;
  const resolvedTitle = _localizeField(title) || "discoverToo";
  const orderedInput = items ? _orderRebondsByItems(items, input) : input;
  return (
    <section className='rebonds mb-lg'>
      <div className='container-fluid'>
        <h2 className='c-h1_5'>{_localizeText(resolvedTitle)}</h2>
        <div className='grid--centered'>
          {orderedInput?.map((item: any, i: number) => (
            <CardType key={i} input={item} context='rebonds' />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Rebonds;
