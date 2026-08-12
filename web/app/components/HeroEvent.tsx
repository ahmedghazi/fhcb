"use client";
import React from "react";
import { _localizeField, _localizeText } from "../sanity-api/utils";
import { EventExpanded } from "../sanity-api/types/sanity-expanded.types";
import FHCBDates from "./ui/FHCBDates";
import Figure from "./ui/Figure";
import clsx from "clsx";
import {
  _isCurrentByDates,
  _isCurrentOrFuturByDates,
  _isPastByDates,
  _isVisiteGuidee,
} from "../lib/utils";
import CardTags from "./ui/cards/CardTags";

type Props = {
  input: EventExpanded;
};

const HeroEvent = ({ input }: Props) => {
  const { title, subTitle, artists, imageCover, dates, tags, links } = input;
  const artistList = artists?.map((artist) => artist.name).join(", ");
  const isVisiteGuidee = _isVisiteGuidee(tags || []);
  // const isCurrentOrFuturByDates = _isCurrentOrFuturByDates(dates || []);
  const isPast = _isPastByDates(dates || []);
  return (
    <section
      className={clsx(
        "hero-event bg-beige",
        // isCurrentOrFuturByDates && "hero-event--is-current",
        isPast && "hero-event--is-past",
        isVisiteGuidee && "bg-jaune",
      )}
      style={
        {
          // backgroundColor: "var(--color-mauve)",
        }
      }>
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
              <CardTags input={tags || []} />

              {/* <h2 className='hero__title c-h1'>{artistList}</h2>
              <div className='hero__subtitle c-title-expo'>
                {_localizeField(title)}
              </div> */}

              <h2 className='hero__title c-h1'>{_localizeField(title)}</h2>
              <div className='hero__subtitle c-title-expo'>
                {_localizeField(subTitle)}
              </div>
            </div>

            <div className='bottom'>
              {dates && (
                <div className='hero__info'>
                  <FHCBDates input={dates} />
                </div>
              )}
              {!isPast && (
                <div className='pt-sm'>
                  {links?.map((item, i: number) => (
                    <a
                      key={i}
                      className='btn '
                      href={item.link}
                      target='_blank'
                      rel='noopener noreferrer'>
                      {_localizeField(item.label)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroEvent;
