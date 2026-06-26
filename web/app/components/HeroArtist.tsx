"use client";
import React, { useEffect } from "react";
import Modules from "./modules";
import { PostTypes } from "../sanity-api/types/extra-types";
import {
  Artist,
  ARTIST_QUERY_RESULT,
  LinkExternal,
} from "../sanity-api/types/sanity.types";
import { ArtistExpanded } from "../sanity-api/types/sanity-expanded.types";
import Figure from "./ui/Figure";
import { _localizeField } from "../sanity-api/utils";
import { PortableText } from "@portabletext/react";
import portableTextComponents from "../sanity-api/portableTextComponents";

type Props = {
  input: NonNullable<ARTIST_QUERY_RESULT>;
};

const HeroArtist = ({ input }: Props) => {
  const { text, imageCover, links } = input;
  // const _isRessource =
  return (
    <div className='hero-artist'>
      <div className='container-fluid'>
        <div className='grid md:grid-cols-2 gap-gutter'>
          <div className='group'>
            {imageCover && (
              <Figure
                asset={imageCover?.asset}
                caption={_localizeField(imageCover?.asset?.title || "")}
                alt={_localizeField(imageCover?.asset?.altText)}
                author={_localizeField(imageCover?.asset?.description)}
                copyright={_localizeField(imageCover?.asset?.creditLine)}
              />
            )}
            <div className='links'>
              {links?.map((item: LinkExternal, i: number) => (
                <a
                  key={i}
                  className='btn'
                  href={item.link}
                  target='_blank'
                  rel='noopener noreferrer'>
                  {_localizeField(item.label)}
                </a>
              ))}
            </div>
          </div>
          <div className='group'>
            <div className=' text'>
              <PortableText
                value={_localizeField(text)}
                components={portableTextComponents}
              />
            </div>
          </div>
        </div>
      </div>
      {/* <pre>{JSON.stringify(tags, null, 2)}</pre> */}
    </div>
  );
};

export default HeroArtist;
