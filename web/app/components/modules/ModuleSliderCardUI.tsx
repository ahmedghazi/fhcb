"use client";
import React from "react";
import { _localizeField } from "@/app/sanity-api/utils";
import { SliderCardUI } from "@/app/sanity-api/types/sanity.types";
import { PostTypes } from "@/app/sanity-api/types/extra-types";
import CardProduct from "../ui/cards/CardProduct";
import CardPage from "../ui/cards/CardPage";
import CardArtist from "../ui/cards/CardArtist";
import CardEvent from "../ui/cards/CardEvent";
import CardExhibition from "../ui/cards/CardExhibition";
import KeenSlider from "../ui/KeenSlider";
import CardImageImages from "../ui/cards/CardImageImages";

type Props = {
  input: SliderCardUI;
};

const ModuleSliderCardUI = ({ input }: Props) => {
  const { title, items } = input;

  return (
    <section className='module module--slider-card-ui'>
      <div className='module__inner'>
        {title && <h2 className='module__title'>{_localizeField(title)}</h2>}
        {items && (
          <KeenSlider>
            {items.map((item: PostTypes, index) => (
              <div
                key={`${item && item._id}-${index}`}
                className='keen-slider__slide'>
                {item && item._type === "product" && (
                  <CardProduct input={item} size='md' />
                )}
                {item && item._type === "pageModulaire" && (
                  <CardPage input={item} size='md' />
                )}
                {item && item._type === "artist" && <CardArtist input={item} />}
                {item && item._type === "event" && (
                  <CardEvent input={item} size='md' />
                )}
                {item && item._type === "exhibition" && (
                  <CardExhibition input={item} size='md' />
                )}
                {item && item._type === "imageImages" && (
                  <CardImageImages input={item} />
                )}
              </div>
            ))}
          </KeenSlider>
        )}
      </div>
    </section>
  );
};

export default ModuleSliderCardUI;
