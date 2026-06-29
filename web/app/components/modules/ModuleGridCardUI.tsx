"use client";
import React, { Fragment } from "react";
import Link from "next/link";
import { _linkResolver, _localizeField } from "@/app/sanity-api/utils";
import Figure from "@/app/components/ui/Figure";
import useLocale from "@/app/context/LocaleContext";
import { GridCardUI } from "@/app/sanity-api/types/sanity.types";
import CardProduct from "../ui/cards/CardProduct";
import { PostTypes } from "@/app/sanity-api/types/extra-types";
import CardPage from "../ui/cards/CardPage";
import CardArtist from "../ui/cards/CardArtist";
import CardEvent from "../ui/cards/CardEvent";
import CardExhibition from "../ui/cards/CardExhibition";
import CardPageModulaire from "../ui/cards/CardPageModulaire";
import CardArticle from "../ui/cards/CardArticle";

type Props = {
  input: GridCardUI | any;
};

const ModuleGridCardUI = ({ input }: Props) => {
  const { title, items, cta } = input;
  return (
    <section className='module module--grid-card-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {title && (
            <h2 className='module__title c-h1_5'>{_localizeField(title)}</h2>
          )}
          {items && (
            <div className='grid--centered'>
              {input.items.map((item: PostTypes, index: number) => (
                <Fragment key={`${item && item._id}-${index}`}>
                  {item && item._type === "exhibition" && (
                    <CardExhibition input={item} size='sm' />
                  )}
                  {/* {item && item._type === "exhibition" && (
                    <CardExhibition input={item} size='md' />
                    )} */}
                  {item && item._type === "product" && (
                    <CardProduct input={item} size={input.size || "sm"} />
                  )}
                  {item && item._type === "pageModulaire" && (
                    <CardPageModulaire input={item} size='md' />
                  )}
                  {item && item._type === "artist" && (
                    <CardArtist input={item} />
                  )}
                  {item && item._type === "event" && (
                    <CardEvent input={item} size='sm' />
                  )}
                  {item && item._type === "article" && (
                    <CardArticle input={item} size='sm' />
                  )}
                </Fragment>
              ))}
            </div>
          )}

          {cta && (
            <div className='footer'>
              {cta.internal && (
                <Link className='btn' href={_linkResolver(cta.internal.link)}>
                  {_localizeField(cta.internal.label)}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ModuleGridCardUI;
