import { SanityImageAssetFull } from "@/app/sanity-api/types/sanity-expanded.types";
import clsx from "clsx";
import React from "react";
import Figure from "../Figure";
import { Link } from "next-view-transitions";

type Props = {
  _type: string;
  tags: string;
  title: string;
  subtitle?: string;
  info?: string;
  imageCover: SanityImageAssetFull;
  linkPrimary: string;
  linkPrimaryLabel: string;
};

const CardInnerMD = ({
  _type,
  tags,
  title,
  subtitle,
  info,
  imageCover,
  linkPrimary,
  linkPrimaryLabel,
}: Props) => {
  const isLandscape =
    (imageCover?.metadata?.dimensions?.width ?? 0) >
    (imageCover?.metadata?.dimensions?.height ?? 0);

  return (
    <div className={clsx("card__inner")}>
      {isLandscape && (
        <>
          <div className='card__header'>
            {tags && <div className='card__tag c-tag'>{tags}</div>}
            <h2 className='card__title c-h2'>{title}</h2>
            {subtitle && <div className='card__subtitle c-h3'>{subtitle}</div>}
          </div>
          <div className='card__media'>
            <Figure asset={imageCover} />
          </div>
          <div className='card__footer'>
            {info && <div className='card__info c-body-xs'>{info}</div>}
            <div className='btns'>
              <Link href={linkPrimary} className='btn btn--primary'>
                {linkPrimaryLabel}
              </Link>
            </div>
          </div>
        </>
      )}
      {!isLandscape && (
        <>
          <div className='grid md:grid-cols-12 gap-xs'>
            <div className='card__header md:col-span-7'>
              {tags && <div className='card__tag c-tag'>{tags}</div>}
              <h2 className='card__title c-h2'>{title}</h2>
              {subtitle && (
                <div className='card__subtitle c-h3'>{subtitle}</div>
              )}
            </div>
            <div className='card__media md:col-span-5'>
              <Figure asset={imageCover} />
            </div>
          </div>
          <div className='card__footer'>
            {info && <div className='card__info c-body-xs'>{info}</div>}
            <div className='btns'>
              <Link href={linkPrimary} className='btn btn--primary'>
                {linkPrimaryLabel}
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardInnerMD;
