"use client";
import React, { Fragment } from "react";
import Link from "next/link";
import { _linkResolver } from "@/app/sanity-api/utils";
import Figure from "@/app/components/ui/Figure";
import useLocale from "@/app/context/LocaleContext";
import { GridCardUI } from "@/app/sanity-api/types/sanity.types";
import CardProduct from "../ui/cards/CardProduct";
import { PostTypes } from "@/app/sanity-api/types/extra-types";
import CardPage from "../ui/cards/CardPage";
import CardArtist from "../ui/cards/CardArtist";
import CardEvent from "../ui/cards/CardEvent";
import CardExhibition from "../ui/cards/CardExhibition";

type Props = {
  input: GridCardUI;
};

const ModuleGridCardUI = ({ input }: Props) => {
  const { locale } = useLocale();
  const title = input.title?.[locale as "fr" | "en"] || input.title?.fr;

  return (
    <section className='module module--grid-card-ui'>
      <div className='module__inner'>
        {title && <h2 className='module__title'>{title}</h2>}
        {input.items && (
          <div className='grid md:grid-cols-4 items-start- gap-gutter'>
            {input.items.map((item: PostTypes, index: number) => (
              <Fragment key={`${item && item._id}-${index}`}>
                {item && item._type === "exhibition" && (
                  <CardExhibition input={item} size='sm' />
                )}
                {item && item._type === "product" && (
                  <CardProduct input={item} size='sm' />
                )}
                {item && item._type === "pageModulaire" && (
                  <CardPage input={item} size='sm' />
                )}
                {item && item._type === "artist" && <CardArtist input={item} />}
                {item && item._type === "event" && (
                  <CardEvent input={item} size='sm' />
                )}
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ModuleGridCardUI;
