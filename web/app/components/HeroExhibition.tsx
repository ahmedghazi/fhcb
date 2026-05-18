"use client";
import React from "react";
import { Exhibition } from "../sanity-api/types/sanity.types";
import { _localizeField } from "../sanity-api/utils";
import { ExhibitionExpanded } from "../sanity-api/types/sanity-expanded.types";
import FHCBDates from "./ui/FHCBDates";
import Figure from "./ui/Figure";

type Props = {
  input: ExhibitionExpanded;
};

const HeroExhibition = ({ input }: Props) => {
  const { title, artists, imageCover, dates } = input;
  const artistList = artists?.map((artist) => artist.name).join(", ");
  return (
    <section className='hero-exhibition bg-mauve'>
      <div className='container-fluid'>
        <div className='grid md:grid-cols-2 gap-gutter'>
          <div className='hero__figure'>
            <Figure
              asset={imageCover?.asset}
              caption={_localizeField(imageCover?.asset?.title || "")}
              alt={_localizeField(imageCover?.asset?.altText)}
              author={_localizeField(imageCover?.asset?.description)}
              copyright={_localizeField(imageCover?.asset?.creditLine)}
            />
          </div>
          <div className='hero__header'>
            <div className='top'>
              <div className='hero__tag c-tag'>{"item.tag"}</div>
              <h2 className='hero__title c-h1'>{artistList}</h2>
              <div className='hero__subtitle c-title-expo'>
                {_localizeField(title)}
              </div>
            </div>

            <div className='bottom'>
              {dates && (
                <div className='hero__info'>
                  <FHCBDates input={dates} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroExhibition;
