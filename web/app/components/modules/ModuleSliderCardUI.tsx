"use client";
import React, { Fragment } from "react";
import { _linkResolver, _localizeField } from "@/app/sanity-api/utils";
import { SliderCardUI } from "@/app/sanity-api/types/sanity.types";
import { PostTypes } from "@/app/sanity-api/types/extra-types";
import SlickSlider from "../ui/SlickSlider";
import { Link } from "next-view-transitions";
import CardType from "../ui/cards/CardType";
import BtnCta from "../ui/btns/BtnCta";

type Props = {
  input: SliderCardUI | any;
};

const ModuleSliderCardUI = ({ input }: Props) => {
  const { title, items, cta } = input;

  return (
    <section className='module module--slider-card-ui'>
      <div className='module__inner'>
        <div className='container-fluid'>
          {title && (
            <h2 className='module__title c-h1_5'>{_localizeField(title)}</h2>
          )}
        </div>

        {items && (
          <div className='items'>
            {items.length > 2 && (
              <SlickSlider
                settings={{
                  infinite: true,
                  // centerMode: true,
                  variableWidth: true,
                }}>
                {items.map((item: PostTypes, index: number) => (
                  <div key={`${item && item._id}-${index}`}>
                    <CardType input={item} context='slider' />
                  </div>
                ))}
              </SlickSlider>
            )}
            {items.length <= 2 && (
              <div className='grid--centered'>
                {input.items.map((item: PostTypes, index: number) => (
                  <Fragment key={`${item && item._id}-${index}`}>
                    <CardType input={item} context='grid' size={input.size} />
                  </Fragment>
                ))}
              </div>
            )}
          </div>
        )}

        {cta && (
          <div className='footer'>
            {cta.internal && (
              // <Link className='btn' href={_linkResolver(cta.internal.link)}>
              //   {_localizeField(cta.internal.label)}
              // </Link>
              <BtnCta input={cta.internal} />
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ModuleSliderCardUI;
