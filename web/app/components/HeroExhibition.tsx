"use client";
import React from "react";
import { _localizeField, _localizeText } from "../sanity-api/utils";
import { ExhibitionExpanded } from "../sanity-api/types/sanity-expanded.types";
import FHCBDates from "./ui/FHCBDates";
import Figure from "./ui/Figure";
import clsx from "clsx";
import { _isCurrentByDates, _isPastByDates } from "../lib/utils";
import CardTags from "./ui/cards/CardTags";

type Props = {
  input: ExhibitionExpanded;
};

const HeroExhibition = ({ input }: Props) => {
  const { title, artists, imageCover, dates, tags, color, links } = input;
  const artistList = artists?.map((artist) => artist.name).join(", ");
  const isCurrentByDates = _isCurrentByDates(dates || []);
  const isPast = _isPastByDates(dates || []);
  return (
    <section
      className={clsx(
        "hero-exhibition bg-mauve-",
        isCurrentByDates && "hero-exhibition--is-current",
        isPast && "hero-exhibition--is-past",
      )}
      style={{
        backgroundColor: !isPast
          ? (color as any)?.hex || "var(--color-mauve)"
          : "var(--color-mauve)",
      }}>
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
              {!isPast && links && (
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

export default HeroExhibition;
