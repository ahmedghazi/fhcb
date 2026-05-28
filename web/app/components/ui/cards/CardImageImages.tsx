"use client";
import { ImageImages } from "@/app/sanity-api/types/sanity.types";
import {
  _linkResolver,
  _localizeField,
  _localizeText,
} from "@/app/sanity-api/utils";
import Link from "next/link";
import React from "react";
import Embed from "../Embed";
import { ImageImagesExpanded } from "@/app/sanity-api/types/sanity-expanded.types";

type Props = {
  input: ImageImagesExpanded;
  size?: "sm" | "md" | "lg";
};

const CardImageImages = ({ input, size = "md" }: Props) => {
  const { index, speaker, title, video } = input;
  return (
    <div className='card card--md card--image-images'>
      <div className='card__inner'>
        <div className='card__header'>
          <div className='card__tag c-tag'>une image, des images #{index} </div>
          {title && (
            <h2 className='card__title c-h2'>{_localizeField(title)}</h2>
          )}
          {speaker && <div className='card__subtitle c-h3'>{speaker}</div>}
        </div>
        <div className='card__media'>{video && <Embed input={video} />}</div>
        <div className='card__footer'>
          <div className='btns'>
            <Link href={_linkResolver(input)} className='btn btn--primary'>
              {_localizeText("discover")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardImageImages;
