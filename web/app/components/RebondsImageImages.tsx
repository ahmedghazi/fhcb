"use client";
import React from "react";

import { _localizeField, _localizeText } from "../sanity-api/utils";
import CardImageImages from "./ui/cards/CardImageImages";
import { ImageImagesExpanded } from "../sanity-api/types/sanity-expanded.types";

type Props = {
  input?: ImageImagesExpanded[];
};

const RelatedImageImages = ({ input }: Props) => {
  return (
    <section className='rebonds rebonds--image-images'>
      <div className='container-fluid'>
        <h2 className='c-h1_5'>{_localizeText("discoverToo")}</h2>
        <div className='grid--centered'>
          {input?.map((item, i) => (
            <CardImageImages key={i} input={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedImageImages;
