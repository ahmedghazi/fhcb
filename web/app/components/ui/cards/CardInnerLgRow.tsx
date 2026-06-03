import { SanityImageAssetFull } from "@/app/sanity-api/types/sanity-expanded.types";
import clsx from "clsx";
import React, { ReactNode } from "react";
import Figure from "../Figure";
import { Link } from "next-view-transitions";

type Props = {
  _type: string;
  tags?: ReactNode;
  supTitle?: string;
  title: string;
  subTitle?: string;
  info?: string;
  infoNode?: ReactNode;
  imageCover: SanityImageAssetFull;
  linkPrimary: string;
  linkPrimaryLabel: string;
  textSpan?: string;
  imgSpan?: string;
};

const CardInnerLgRow = ({
  tags,
  supTitle,
  title,
  subTitle,
  info,
  infoNode,
  imageCover,
  linkPrimary,
  linkPrimaryLabel,
  textSpan = "md:col-span-4",
  imgSpan = "md:col-span-8",
}: Props) => (
  <div className='card__inner'>
    <div className='grid md:grid-cols-12 gap-xs'>
      <div className={clsx("card__body", textSpan)}>
        <div className='card__header'>
          {tags && <div className='card__tag c-tag'>{tags}</div>}
          {supTitle && <div className='card__sup-title c-body'>{supTitle}</div>}
          <h3 className='card__title c-h2'>{title}</h3>
          {subTitle && <div className='card__subTitle c-h3'>{subTitle}</div>}
        </div>
        <div className='card__footer'>
          {info && <div className='card__info c-body-xs'>{info}</div>}
          {infoNode && <div className='card__info c-body-xs'>{infoNode}</div>}
          {linkPrimary && (
            <div className='btns'>
              <Link href={linkPrimary} className='btn btn--primary'>
                {linkPrimaryLabel}
              </Link>
            </div>
          )}
        </div>
      </div>
      {imageCover && (
        <div className={clsx("card__media", imgSpan)}>
          <Figure asset={imageCover} />
        </div>
      )}
    </div>
    {/* <div className='card__footer'>
      {linkPrimary && (
        <div className='btns'>
          <Link href={linkPrimary} className='btn btn--primary'>
            {linkPrimaryLabel}
          </Link>
        </div>
      )}
    </div> */}
  </div>
);

export default CardInnerLgRow;
