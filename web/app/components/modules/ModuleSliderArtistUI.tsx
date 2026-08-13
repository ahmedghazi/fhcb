"use client";
import React from "react";
import { _linkResolver, _localizeField } from "@/app/sanity-api/utils";
import { SliderArtistUI } from "@/app/sanity-api/types/sanity.types";
import { PostTypes } from "@/app/sanity-api/types/extra-types";
import SlickSlider from "../ui/SlickSlider";
import CardImageImages from "../ui/cards/CardImageImages";
import CardFeuilletage from "../ui/cards/CardFeuilletage";
import { Link } from "next-view-transitions";
import CardSerieThematique from "../ui/cards/CardSerieThematique";

type Props = {
  input: SliderArtistUI | any;
};

const ModuleSliderArtistUI = ({ input }: Props) => {
  const { artist, items, cta } = input;
  console.log(items);
  return (
    <section className='module module--slider-artist-ui'>
      <div className='module__inner'>
        <div className='container-fluid'>
          {artist && <h2 className='module__title c-h1_5'>{artist.name}</h2>}
        </div>
        {items && (
          <SlickSlider
            settings={{
              infinite: true,
              // centerMode: true,
              variableWidth: true,
            }}>
            {items.map((item: PostTypes, index: number) => (
              <div key={`${item && item._id}-${index}`}>
                {item && item._type === "imageImages" && (
                  <CardImageImages input={item} />
                )}
                {item && item._type === "feuilletage" && (
                  <CardFeuilletage input={item} />
                )}
                {item && item._type === "serieThematique" && (
                  <CardSerieThematique input={item} />
                )}
              </div>
            ))}
          </SlickSlider>
        )}
        {cta && (
          <div className='footer'>
            {cta.internal && (
              <Link className='btn' href={_linkResolver(cta.internal.link)}>
                {_localizeField(cta.internal.label)}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ModuleSliderArtistUI;
