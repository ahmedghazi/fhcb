"use client";
import React, { useEffect, useState } from "react";
import useLocale from "@/app/context/LocaleContext";
import { NewsCardUI } from "@/app/sanity-api/types/sanity.types";
import {
  EventExpanded,
  ExhibitionExpanded,
  ProductExpanded,
} from "@/app/sanity-api/types/sanity-expanded.types";
import CardEvent from "../ui/cards/CardEvent";
import CardProduct from "../ui/cards/CardProduct";
import { _localizeField } from "@/app/sanity-api/utils";
import CardExhibition from "../ui/cards/CardExhibition";

type NewsCardUIResolved = NewsCardUI & {
  exhibitions?: ExhibitionExpanded[];
  events?: EventExpanded[];
  product?: ProductExpanded[];
};

type Props = {
  input: NewsCardUIResolved;
};

const ModuleNewsCardUI = ({ input }: Props) => {
  const { gridSize, title } = input;
  const exhibitions = input.exhibitions || [];
  const events = input.events || [];
  const products = input.product || [];
  const cols = gridSize || 4;
  // const titleText = title?.[locale as "fr" | "en"] || title?.fr;

  // const [events, setEvents] = useState<EventExpanded[]>([]);
  // const [products, setProducts] = useState<ProductExpanded[]>([]);

  // useEffect(() => {
  //   fetch("/api/news-items")
  //     .then((r) => r.json())
  //     .then(({ events, products }) => {
  //       setEvents(events ?? []);
  //       setProducts(products ?? []);
  //     });
  // }, []);

  // const hasItems = events.length > 0 || products.length > 0;

  return (
    <section className='module module--news-card-ui'>
      <div className='module__inner'>
        {title && (
          <h2 className='module__title c-h1_5'>{_localizeField(title)}</h2>
        )}

        <div className={`grid md:grid-cols-${cols} items-start gap-gutter`}>
          {exhibitions.map((item, index: number) => (
            <CardExhibition
              key={`exhibitions-${item._id}-${index}`}
              input={item}
              size='sm'
            />
          ))}
          {events.map((item, index: number) => (
            <CardEvent
              key={`event-${item._id}-${index}`}
              input={item}
              size='sm'
            />
          ))}
          {products.map((item, index: number) => (
            <CardProduct
              key={`product-${item._id}-${index}`}
              input={item}
              size='sm'
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModuleNewsCardUI;
