import { SanityImageAssetFull } from "@/app/sanity-api/types/sanity-expanded.types";
import clsx from "clsx";
import React, { ReactNode } from "react";
import Figure from "../Figure";
import { Link } from "next-view-transitions";

type Props = {
  _type: string;
  tags: string;
  title: string;
  subtitle?: string;
  info?: string;
  infoNode?: ReactNode;
  imageCover: SanityImageAssetFull;
  linkPrimary: string;
  linkPrimaryLabel: string;
};

const CardInnerSM = ({
  _type,
  tags,
  title,
  subtitle,
  info,
  infoNode,
  imageCover,
  linkPrimary,
  linkPrimaryLabel,
}: Props) => {
  return (
    <div className={clsx("card__inner")}>
      <div className='card__header'>
        {tags && <div className='card__tag c-tag'>{tags}</div>}
        <h2 className='card__title c-h2'>{title}</h2>
        {subtitle && <div className='card__subtitle c-h3'>{subtitle}</div>}
      </div>
      {imageCover && (
        <div className='card__media'>
          <Figure asset={imageCover} />
        </div>
      )}
      <div className='card__footer'>
        {info && <div className='card__info c-body-xs'>{info}</div>}
        {infoNode && <div className='card__info c-body-xs'>{infoNode}</div>}
        <div className='btns'>
          <Link href={linkPrimary} className='btn btn--primary'>
            {linkPrimaryLabel}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardInnerSM;
