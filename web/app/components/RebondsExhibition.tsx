"use client";
import React from "react";
import { _localizeText } from "../sanity-api/utils";
import CardType from "./ui/cards/CardType";
import { ArtistExpanded } from "../sanity-api/types/sanity-expanded.types";
import CardArtist from "./ui/cards/CardArtist";

type Props = {
  input: any;
  artists: ArtistExpanded[];
};

const RebondsExhibition = ({ input, artists }: Props) => {
  return (
    <section className='rebonds rebonds--exhibition'>
      <div className='container-fluid'>
        <h2 className='c-h1_5'>{_localizeText("aroundTheExhibition")}</h2>
        <div className='grid--centered'>
          {/* <pre>{JSON.stringify(artists, null, 2)}</pre> */}
          {artists?.map((item: any, i: number) => (
            <CardType key={i} input={item} context='rebonds' />
          ))}
          {input?.map((item: any, i: number) => (
            <CardType key={i} input={item} context='rebonds' />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RebondsExhibition;
