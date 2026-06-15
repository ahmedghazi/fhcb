"use client";
import React from "react";
import { _linkResolver, _localizeField } from "@/app/sanity-api/utils";
import { SliderCardUI } from "@/app/sanity-api/types/sanity.types";
import { PostTypes } from "@/app/sanity-api/types/extra-types";
import CardProduct from "../ui/cards/CardProduct";
import CardPage from "../ui/cards/CardPage";
import CardArtist from "../ui/cards/CardArtist";
import CardEvent from "../ui/cards/CardEvent";
import CardExhibition from "../ui/cards/CardExhibition";
import KeenSlider from "../ui/KeenSlider";
import CardImageImages from "../ui/cards/CardImageImages";
import CardFeuilletage from "../ui/cards/CardFeuilletage";
import CardPageModulaire from "../ui/cards/CardPageModulaire";
import { Link } from "next-view-transitions";

type Props = {
  input: SliderCardUI | any;
};

const ModuleSliderCardUI = ({ input }: Props) => {
  const { title, items, cta } = input;

  return (
    <section className='module module--slider-card-ui'>
      <div className='container-fluid-'>
        <div className='module__inner'>
          {title && (
            <h2 className='module__title c-h1_5'>{_localizeField(title)}</h2>
          )}
          {items && (
            <KeenSlider>
              {items.map((item: PostTypes, index: number) => (
                <div
                  key={`${item && item._id}-${index}`}
                  className='keen-slider__slide'>
                  {item && item._type === "product" && (
                    <CardProduct input={item} size='sm' />
                  )}
                  {item && item._type === "pageModulaire" && (
                    <CardPageModulaire input={item} size='md' />
                  )}
                  {item && item._type === "artist" && (
                    <CardArtist input={item} />
                  )}
                  {item && item._type === "event" && (
                    <CardEvent input={item} size='md' />
                  )}
                  {item && item._type === "exhibition" && (
                    <CardExhibition input={item} size='md' />
                  )}
                  {item && item._type === "imageImages" && (
                    <CardImageImages input={item} />
                  )}
                  {item && item._type === "feuilletage" && (
                    <CardFeuilletage input={item} />
                  )}
                </div>
              ))}
            </KeenSlider>
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
      </div>
    </section>
  );
};

export default ModuleSliderCardUI;
