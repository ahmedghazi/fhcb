"use client";
import React, { useEffect, useState } from "react";
import useLocale from "@/app/context/LocaleContext";
import { NewsCardUI } from "@/app/sanity-api/types/sanity.types";
import {
  EventExpanded,
  ExhibitionExpanded,
  FeuilletageExpanded,
  ProductExpanded,
} from "@/app/sanity-api/types/sanity-expanded.types";
import CardEvent from "../ui/cards/CardEvent";
import CardProduct from "../ui/cards/CardProduct";
import { _localizeField } from "@/app/sanity-api/utils";
import CardExhibition from "../ui/cards/CardExhibition";
import CardFeuilletage from "../ui/cards/CardFeuilletage";

type NewsCardUIResolved = NewsCardUI & {
  exhibitions?: ExhibitionExpanded[];
  events?: EventExpanded[];
  product?: ProductExpanded[];
  feuilletage?: FeuilletageExpanded[];
};

type Props = {
  input: NewsCardUIResolved;
};

const ModuleNewsCardUI = ({ input }: Props) => {
  const { gridSize, title } = input;
  const exhibitions = input.exhibitions || [];
  const events = input.events || [];
  const products = input.product || [];
  const feuilletages = input.feuilletage || [];
  const cols = gridSize || 12;

  return (
    <section className='module module--news-card-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {title && (
            <h2 className='module__title c-h1_5'>{_localizeField(title)}</h2>
          )}

          <div className='grid--centered'>
            {events.map((item, index: number) => (
              <CardEvent
                key={`event-${item._id}-${index}`}
                input={item}
                size='md'
              />
            ))}
            {exhibitions.map((item, index: number) => (
              <CardExhibition
                key={`exhibitions-${item._id}-${index}`}
                input={item}
                size='md'
              />
            ))}

            {products.map((item, index: number) => (
              <CardProduct
                key={`product-${item._id}-${index}`}
                input={item}
                size='sm'
              />
            ))}
            {feuilletages.map((item, index: number) => (
              <CardFeuilletage
                key={`feuilletage-${item._id}-${index}`}
                input={item}
                size='md'
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModuleNewsCardUI;
