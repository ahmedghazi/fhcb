"use client";
import { RessourcesUI } from "@/app/sanity-api/types/sanity.types";
import React, { Fragment } from "react";
import CardImageImages from "../ui/cards/CardImageImages";
import CardFeuilletage from "../ui/cards/CardFeuilletage";
import { _linkResolver, _localizeField } from "@/app/sanity-api/utils";
import {
  FeuilletageExpanded,
  ImageImagesExpanded,
  SerieThematiqueExpanded,
  PageModulaireExpanded,
  ConversationExpanded,
} from "@/app/sanity-api/types/sanity-expanded.types";
import CardPageModulaire from "../ui/cards/CardPageModulaire";
import CardBranche from "../ui/cards/CardBranche";
import CardSerieThematique from "../ui/cards/CardSerieThematique";
import CardType from "../ui/cards/CardType";
import CardConversation from "../ui/cards/CardConversation";
import Link from "next/link";
import BtnCta from "../ui/btns/BtnCta";

type Props = {
  input: RessourcesUI & {
    feuilletage?: FeuilletageExpanded;
    imageImages: ImageImagesExpanded;
    serieThematique: SerieThematiqueExpanded;
    conversation: ConversationExpanded;
    branches: PageModulaireExpanded;
  };
};

const ModuleRessourcesUI = ({ input }: Props) => {
  const {
    title,
    branches,
    feuilletage,
    imageImages,
    serieThematique,
    conversation,
    cta,
  } = input;
  // const items: Array<
  //   FeuilletageExpanded | ImageImagesExpanded | SerieThematiqueExpanded
  // > = [
  //   ...(feuilletages ?? []),
  //   ...(imageImages ?? []),
  //   ...(serieThematique ?? []),
  // ];
  const itemsFlatten = [
    feuilletage,
    imageImages,
    serieThematique,
    conversation,
  ];
  return (
    <section className='module module--ressources-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {title && (
            <h2 className='module__title c-h1_5'>{_localizeField(title)}</h2>
          )}
          {/* <pre>{JSON.stringify(items)}</pre> */}
          <div className='grid--centered mb-gutter'>
            {itemsFlatten.map((item, i) => (
              <Fragment key={i}>
                {item?._type === "feuilletage" && (
                  <CardFeuilletage input={item} size='md' />
                )}
                {item?._type === "imageImages" && (
                  <CardImageImages input={item} size='md' />
                )}
              </Fragment>
            ))}
          </div>
          <div className='grid--centered'>
            {branches.map((item, i) => (
              <CardBranche
                key={i}
                input={item as unknown as PageModulaireExpanded}
                size='sm'
              />
            ))}
          </div>

          {cta && (
            <div className='footer pt-md'>
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

export default ModuleRessourcesUI;
