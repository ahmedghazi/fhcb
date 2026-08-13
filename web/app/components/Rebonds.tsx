"use client";
import CardType from "./ui/cards/CardType";
import { _localizeField, _localizeText } from "../sanity-api/utils";

type Props = {
  // input: NonNullable<FEUILLETAGE_QUERY_RESULT>["related"];
  input: any;
  // an i18n key ("discoverToo"), or a free-form (possibly localized) editorial title, e.g. rebond.title
  title?: string | Record<string, string> | null;
};

const Rebonds = ({ input, title }: Props) => {
  if (!input || input.length === 0) return null;
  const resolvedTitle = _localizeField(title) || "discoverToo";
  return (
    <section className='rebonds mb-lg'>
      <div className='container-fluid'>
        <h2 className='c-h1_5'>{_localizeText(resolvedTitle)}</h2>
        <div className='grid--centered'>
          {input?.map((item: any, i: number) => (
            <CardType key={i} input={item} context='rebonds' />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Rebonds;
