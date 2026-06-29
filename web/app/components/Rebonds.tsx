"use client";

import CardType from "./ui/cards/CardType";
import { _localizeText } from "../sanity-api/utils";

type Props = {
  // input: NonNullable<FEUILLETAGE_QUERY_RESULT>["related"];
  input: any;
  title?: string;
};

const Rebonds = ({ input, title = "discoverToo" }: Props) => {
  if (!input || input.length === 0) return null;
  return (
    <section className='rebonds mb-lg'>
      <div className='container-fluid'>
        <h2 className='c-h1_5'>{_localizeText(title)}</h2>
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
