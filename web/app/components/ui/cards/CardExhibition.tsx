"use client";
import clsx from "clsx";
import React from "react";
import Figure from "../Figure";
import {
  _linkResolver,
  _localizeField,
  _localizeText,
} from "@/app/sanity-api/utils";
import FHCBDates from "../FHCBDates";
import { ExhibitionExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import Link from "next/link";
import {
  _isCurrentExhibition,
  _isFuturExhibition,
  _isHorsLesMurs,
  _isPastExhibition,
} from "@/app/lib/utils";

type Props = {
  input: ExhibitionExpanded;
  size?: "sm" | "md" | "lg";
};

const CardExhibition = ({ input, size = "md" }: Props) => {
  const { artists, imageCover, dates, tags } = input;
  const artistList = artists?.map((artist) => artist.name).join(", ");
  const isLandscape =
    (imageCover?.asset?.metadata?.dimensions?.width ?? 0) >
    (imageCover?.asset?.metadata?.dimensions?.height ?? 0);

  const isPastExhibition = _isPastExhibition(dates || []);
  const isCurrentExhibition = _isCurrentExhibition(dates || []);
  const isFuturExhibition = _isFuturExhibition(dates || []);
  const isHorsLesMurs = tags ? _isHorsLesMurs(tags) : false;
  return (
    <div
      className={clsx(
        "card card--exhibition",
        `card--${size}`,
        size === "md" && "md:col-span-2",
        size === "lg" && "md:col-span-4",
        isLandscape && `card--is-landscape`,
        !isLandscape && "card--is-portrait",
        isPastExhibition && "card--is-past",
        isCurrentExhibition && "card--is-current",
        isFuturExhibition && "card--is-futur",
        isHorsLesMurs && "card--is-hors-les-murs",
        "self-start ",
      )}>
      {isPastExhibition && (
        <PastCardExhibition
          input={input}
          artistList={artistList}
          isLandscape={isLandscape}
          size={size}
        />
      )}
      {isCurrentExhibition && (
        <CurrentCardExhibition
          input={input}
          artistList={artistList}
          isLandscape={isLandscape}
          size={size}
        />
      )}
      {isFuturExhibition && (
        <FuturCardExhibition
          input={input}
          artistList={artistList}
          isLandscape={isLandscape}
          size={size}
        />
      )}
      {isHorsLesMurs && (
        <CurrentCardExhibition
          input={input}
          artistList={artistList}
          isLandscape={isLandscape}
          size={size}
        />
      )}
      <pre>{JSON.stringify(tags, null, 2)}</pre>
    </div>
  );
};

export default CardExhibition;

type CardInnerProps = {
  input: ExhibitionExpanded;
  artistList?: string;
  isLandscape?: boolean;
  size?: "sm" | "md" | "lg";
};

const CurrentCardExhibition = ({
  input,
  artistList,
  size,
  isLandscape,
}: CardInnerProps) => {
  const { title, imageCover, dates } = input;

  return (
    <div className='card__inner'>
      {size === "sm" && (
        <>
          <div className='card__media'>
            <Figure asset={imageCover?.asset} />
          </div>
          <div className='card__body'>
            <div className='card__header'>
              <div className='card__tag c-tag'>
                {_localizeText("currentExhibition")}
              </div>
              {artistList && <h2 className='card__title c-h2'>{artistList}</h2>}
              <div className='card__subtitle c-h3'>{_localizeField(title)}</div>
            </div>
            <div className='card__footer'>
              {dates && (
                <div className='card__info'>
                  <FHCBDates input={dates} />
                </div>
              )}

              <div className='btns'>
                <Link href={_linkResolver(input)} className='btn btn--primary'>
                  {_localizeText("discoverTheExhibition")}
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {size === "md" && (
        <div className='grid md:grid-cols-12 gap-xs'>
          <div className='md:col-span-4'>
            <div className='card__body'>
              <div className='card__header'>
                <div className='card__tag c-tag'>
                  {_localizeText("currentExhibition")}
                </div>
                {artistList && (
                  <h2 className='card__title c-h2'>{artistList}</h2>
                )}
                <div className='card__subtitle c-h3'>
                  {_localizeField(title)}
                </div>
              </div>
              <div className='card__footer'>
                {dates && (
                  <div className='card__info'>
                    <FHCBDates input={dates} />
                  </div>
                )}

                <div className='btns'>
                  <Link
                    href={_linkResolver(input)}
                    className='btn btn--primary'>
                    {_localizeText("discoverTheExhibition")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className='md:col-span-8'>
            <div className='card__media'>
              <Figure asset={imageCover?.asset} />
            </div>
          </div>
        </div>
      )}

      {size === "lg" && (
        <div className='grid md:grid-cols-12 gap-xs'>
          <div className={clsx("md:col-span-4", isLandscape && "order-2")}>
            <div className='card__body'>
              <div className='card__header'>
                <div className='card__tag c-tag'>
                  {_localizeText("currentExhibition")}
                </div>
                {artistList && (
                  <h2 className='card__title c-h2'>{artistList}</h2>
                )}
                <div className='card__subtitle c-h3'>
                  {_localizeField(title)}
                </div>
              </div>
              <div className='card__footer'>
                {dates && (
                  <div className='card__info'>
                    <FHCBDates input={dates} />
                  </div>
                )}

                <div className='btns'>
                  <Link
                    href={_linkResolver(input)}
                    className='btn btn--primary'>
                    {_localizeText("discoverTheExhibition")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className={clsx("md:col-span-8", isLandscape && "order-1")}>
            <div className='card__media'>
              <Figure asset={imageCover?.asset} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const PastCardExhibition = ({
  input,
  artistList,
  isLandscape,
  size,
}: CardInnerProps) => {
  const { title, imageCover, dates } = input;

  return (
    <div className='card__inner'>
      {size === "sm" && (
        <>
          <div className='card__header'>
            <div className='card__tag c-tag'>
              {_localizeText("pastExhibition")}
            </div>
            {artistList && <h2 className='card__title c-h2'>{artistList}</h2>}
            <div className='card__subtitle c-h3'>{_localizeField(title)}</div>
          </div>
          <div className='card__media'>
            <Figure asset={imageCover?.asset} />
          </div>
          <div className='card__footer'>
            {dates && (
              <div className='card__info'>
                <FHCBDates input={dates} />
              </div>
            )}
            <div className='btns'>
              <Link href={_linkResolver(input)} className='btn btn--primary'>
                {_localizeText("discoverTheExhibition")}
              </Link>
            </div>
          </div>
        </>
      )}
      {size === "md" && (
        <div className='grid md:grid-cols-12 gap-xs'>
          <div className='md:col-span-4'>
            <div className='card__body'>
              <div className='card__header'>
                <div className='card__tag c-tag'>
                  {_localizeText("currentExhibition")}
                </div>
                {artistList && (
                  <h2 className='card__title c-h2'>{artistList}</h2>
                )}
                <div className='card__subtitle c-h3'>
                  {_localizeField(title)}
                </div>
              </div>
              <div className='card__footer'>
                {dates && (
                  <div className='card__info'>
                    <FHCBDates input={dates} />
                  </div>
                )}

                <div className='btns'>
                  <Link
                    href={_linkResolver(input)}
                    className='btn btn--primary'>
                    {_localizeText("discoverTheExhibition")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className='md:col-span-8'>
            <div className='card__media'>
              <Figure asset={imageCover?.asset} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FuturCardExhibition = ({
  input,
  artistList,
  isLandscape,
  size,
}: CardInnerProps) => {
  const { title, imageCover, dates } = input;

  return (
    <div className='card__inner'>
      {size === "sm" && (
        <>
          <div className='card__header'>
            <div className='card__tag c-tag'>
              {_localizeText("futurExhibition")}
            </div>
            {artistList && <h2 className='card__title c-h2'>{artistList}</h2>}
            <div className='card__subtitle c-h3'>{_localizeField(title)}</div>
          </div>
          <div className='card__media'>
            <Figure asset={imageCover?.asset} />
          </div>
          <div className='card__footer'>
            {dates && (
              <div className='card__info'>
                <FHCBDates input={dates} />
              </div>
            )}
            <div className='btns'>
              <Link href={_linkResolver(input)} className='btn btn--primary'>
                {_localizeText("discoverTheExhibition")}
              </Link>
            </div>
          </div>
        </>
      )}
      {size === "md" && (
        <div className='grid md:grid-cols-12 gap-xs'>
          <div className='md:col-span-4'>
            <div className='card__body'>
              <div className='card__header'>
                <div className='card__tag c-tag'>
                  {_localizeText("currentExhibition")}
                </div>
                {artistList && (
                  <h2 className='card__title c-h2'>{artistList}</h2>
                )}
                <div className='card__subtitle c-h3'>
                  {_localizeField(title)}
                </div>
              </div>
              <div className='card__footer'>
                {dates && (
                  <div className='card__info'>
                    <FHCBDates input={dates} />
                  </div>
                )}

                <div className='btns'>
                  <Link
                    href={_linkResolver(input)}
                    className='btn btn--primary'>
                    {_localizeText("discoverTheExhibition")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className='md:col-span-8'>
            <div className='card__media'>
              <Figure asset={imageCover?.asset} />
            </div>
          </div>
        </div>
      )}
      {size === "lg" && (
        <div className='grid md:grid-cols-12 gap-xs'>
          <div className={clsx("md:col-span-4", isLandscape && "order-2")}>
            <div className='card__body'>
              <div className='card__header'>
                <div className='card__tag c-tag'>
                  {_localizeText("currentExhibition")}
                </div>
                {artistList && (
                  <h2 className='card__title c-h2'>{artistList}</h2>
                )}
                <div className='card__subtitle c-h3'>
                  {_localizeField(title)}
                </div>
              </div>
              <div className='card__footer'>
                {dates && (
                  <div className='card__info'>
                    <FHCBDates input={dates} />
                  </div>
                )}

                <div className='btns'>
                  <Link
                    href={_linkResolver(input)}
                    className='btn btn--primary'>
                    {_localizeText("discoverTheExhibition")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className={clsx("md:col-span-8", isLandscape && "order-1")}>
            <div className='card__media'>
              <Figure asset={imageCover?.asset} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
