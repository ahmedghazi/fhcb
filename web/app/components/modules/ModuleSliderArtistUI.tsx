"use client";
import React, { useEffect, useState } from "react";
import { _linkResolver, _localizeField } from "@/app/sanity-api/utils";
import { SliderArtistUI } from "@/app/sanity-api/types/sanity.types";
import { PostTypes } from "@/app/sanity-api/types/extra-types";
import SlickSlider from "../ui/SlickSlider";
import CardImageImages from "../ui/cards/CardImageImages";
import CardFeuilletage from "../ui/cards/CardFeuilletage";
import { Link } from "next-view-transitions";
import CardSerieThematique from "../ui/cards/CardSerieThematique";
import CardConversation from "../ui/cards/CardConversation";
import CardType from "../ui/cards/CardType";

type Props = {
  input: SliderArtistUI | any;
  limit?: number;
};

const ModuleSliderArtistUI = ({ input, limit = 10 }: Props) => {
  const { artist, items, cta } = input;
  // start with the original (server-rendered) order, already capped to `limit`, to avoid a
  // hydration mismatch, then shuffle (and re-cap) client-side after mount
  const [shuffledItems, setShuffledItems] = useState(items?.slice(0, limit));

  useEffect(() => {
    if (!items) return;
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledItems(shuffled.slice(0, limit));
  }, [items, limit]);
  return (
    <section className='module module--slider-artist-ui'>
      <div className='module__inner'>
        <div className='container-fluid'>
          {artist && <h2 className='module__title c-h1_5'>{artist.name}</h2>}
        </div>
        {shuffledItems && (
          <SlickSlider
            settings={{
              infinite: true,
              // centerMode: true,
              variableWidth: true,
            }}>
            {shuffledItems.map((item: PostTypes, index: number) => (
              <div key={`${item && item._id}-${index}`}>
                <CardType input={item} context='slider' />
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
