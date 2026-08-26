"use client";
import React from "react";
import { _localizeText } from "../sanity-api/utils";
import CardType from "./ui/cards/CardType";
import { ArtistExpanded } from "../sanity-api/types/sanity-expanded.types";
import CardArtist from "./ui/cards/CardArtist";

type Props = {
  input: any;
  title: string;
};

const RebondsExhibition = ({ input, title }: Props) => {
  return (
    <section className='rebonds rebonds--exhibition'>
      {/* <div className='container-fluid'>
        <h2 className='c-h1_5'>{_localizeText("aroundTheExhibition")}</h2>
        <div className='grid--centered'>
          {artists?.map((item: any, i: number) => (
            <CardType key={i} input={item} context='rebonds' />
          ))}
          {input?.map((item: any, i: number) => (
            <CardType key={i} input={item} context='rebonds' />
          ))}
        </div>
      </div > */}
      <div className='container-fluid'>
        {title && <h2 className='c-h1_5'>{_localizeText(title)}</h2>}

        <div className='grid--centered'>
          {input?.map((item: any, i: number) => (
            <CardType key={i} input={item} context='rebonds' />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RebondsExhibition;
