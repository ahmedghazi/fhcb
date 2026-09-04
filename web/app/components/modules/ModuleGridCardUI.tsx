"use client";
import React, { Fragment } from "react";
import Link from "next/link";
import { _linkResolver, _localizeField } from "@/app/sanity-api/utils";
import Figure from "@/app/components/ui/Figure";
import useLocale from "@/app/context/LocaleContext";
import { GridCardUI } from "@/app/sanity-api/types/sanity.types";
import { PostTypes } from "@/app/sanity-api/types/extra-types";
import CardType from "../ui/cards/CardType";
import BtnCta from "../ui/btns/BtnCta";

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
                  <CardType input={item} context='grid' size={input.size} />
                </Fragment>
              ))}
            </div>
          )}

          {cta && (
            <div className='footer'>
              {cta.internal && (
                // <Link className='btn' href={_linkResolver(cta.internal.link)}>
                //   {_localizeField(cta.internal.label)}
                // </Link>
                <BtnCta input={cta.internal} />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ModuleGridCardUI;
