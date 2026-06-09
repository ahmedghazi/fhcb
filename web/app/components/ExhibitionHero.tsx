"use client";
import React from "react";
import { Exhibition, FhcbDate } from "../sanity-api/types/sanity.types";
import { _localizeField, _localizeText } from "../sanity-api/utils";
import { ExhibitionExpanded } from "../sanity-api/types/sanity-expanded.types";
import FHCBDates from "./ui/FHCBDates";
import Figure from "./ui/Figure";
import clsx from "clsx";
import { _isCurrentExhibition, _isPastExhibition } from "../lib/utils";
import CardTags from "./ui/cards/CardTags";

type Props = {
  input: ExhibitionExpanded;
};

const ExhibitionHero = ({ input }: Props) => {
  const { title, artists, imageCover, dates, tags, color } = input;
  const artistList = artists?.map((artist) => artist.name).join(", ");
  const isCurrentExhibition = _isCurrentExhibition(dates || []);
  const isPast = _isPastExhibition(dates || []);
  return (
    <section
      className={clsx(
        "exhibition-hero bg-mauve-",
        isCurrentExhibition && "exhibition-hero--is-current",
        isPast && "exhibition-hero--is-past",
      )}
      style={{
        backgroundColor: isCurrentExhibition
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
              {/* <div className='card__tag c-tag'>
                {isCurrentExhibition && _localizeText("currentExhibition")}
                {!isCurrentExhibition && _localizeText("pastExhibition")}
              </div> */}
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExhibitionHero;
