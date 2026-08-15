"use client";
import React, { useEffect, useState } from "react";
import useLocale from "@/app/context/LocaleContext";
import { NewsCardUI } from "@/app/sanity-api/types/sanity.types";
import {
  ArticleExpanded,
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
import CardArticle from "../ui/cards/CardArticle";

type NewsCardUIResolved = NewsCardUI & {
  events?: EventExpanded[];
  eventsVisite?: EventExpanded[];
  product?: ProductExpanded;
  articles?: ArticleExpanded[];
  exhibitions?: ExhibitionExpanded[];
};

type Props = {
  input: NewsCardUIResolved;
};

const ModuleNewsCardUI = ({ input }: Props) => {
  const { title } = input;
  const events = input.events || [];
  const eventsVisite = input.eventsVisite || [];
  const product = input.product;
  const articles = input.articles || [];
  const exhibitions = input.exhibitions || [];
  // const feuilletages = input.feuilletage || [];
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
            {eventsVisite?.map((item, index: number) => (
              <CardEvent
                key={`event-visite-${item._id}-${index}`}
                input={item}
                size='sm'
              />
            ))}

            {product && <CardProduct input={product} size='sm' />}
            {/* <pre>{JSON.stringify(articles, null, 2)}</pre> */}
            {articles.map((item, index: number) => (
              <CardArticle
                key={`article-${item._id}-${index}`}
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModuleNewsCardUI;
