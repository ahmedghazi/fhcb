"use client";
import React from "react";

import { _localizeField, _localizeText } from "../sanity-api/utils";
import { ArtistExpanded } from "../sanity-api/types/sanity-expanded.types";
import { Artist } from "../sanity-api/types/sanity.types";
import CardArtist from "./ui/cards/CardArtist";

type Props = {
  input?: ArtistExpanded[];
};

const RebondsArtistes = ({ input }: Props) => {
  //query api to get 4 random artist

  return (
    <section className='rebonds rebonds--image-images'>
      <div className='container-fluid'>
        <h2 className='c-h1_5'>{_localizeText("discoverToo")}</h2>
        <div className='grid--centered'>
          {input?.map((item, i) => (
            <CardArtist key={i} input={item} size='sm' />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RebondsArtistes;
