import { SanityImageAssetFull } from "@/app/sanity-api/types/sanity-expanded.types";
import clsx from "clsx";
import React from "react";
import Figure from "../Figure";
import { Link } from "next-view-transitions";

type Props = {
  _type: string;
  tags?: string;
  title: string;
  subTitle?: string;
  info?: string;
  infoNode?: React.ReactNode;
  imageCover: SanityImageAssetFull;
  linkPrimary: string;
  linkPrimaryLabel: string;
};

const CardInnerMD = ({
  _type,
  tags,
  title,
  subTitle,
  info,
  infoNode,
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
            <h3 className='card__title c-h2'>{title}</h3>
            {subTitle && <div className='card__subTitle c-h3'>{subTitle}</div>}
          </div>
          <div className='card__media'>
            <Figure asset={imageCover} />
          </div>
          <div className='card__footer'>
            {info && <div className='card__info c-body-xs'>{info}</div>}
            {infoNode && <div className='card__info c-body-xs'>{infoNode}</div>}
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
            <div className='card__header md:col-span-4'>
              <div className='header'>
                {tags && <div className='card__tag c-tag'>{tags}</div>}
                <h3 className='card__title c-h2'>{title}</h3>
                {subTitle && (
                  <div className='card__subTitle c-h3'>{subTitle}</div>
                )}
              </div>
              <div className='footer'>
                {info && <div className='card__info c-body-xs'>{info}</div>}
                {infoNode && (
                  <div className='card__info c-body-xs'>{infoNode}</div>
                )}
              </div>
            </div>
            <div className='card__media  md:col-span-8'>
              <Figure asset={imageCover} />
            </div>
          </div>
          <div className='card__footer'>
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
