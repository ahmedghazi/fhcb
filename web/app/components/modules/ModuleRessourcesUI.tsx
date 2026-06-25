"use client";
import { RessourcesUI } from "@/app/sanity-api/types/sanity.types";
import React, { Fragment } from "react";
import CardImageImages from "../ui/cards/CardImageImages";
import CardFeuilletage from "../ui/cards/CardFeuilletage";
import { _localizeField } from "@/app/sanity-api/utils";
import {
  FeuilletageExpanded,
  ImageImagesExpanded,
  SerieThematiqueExpanded,
  PageModulaireExpanded,
} from "@/app/sanity-api/types/sanity-expanded.types";
import CardPageModulaire from "../ui/cards/CardPageModulaire";
import CardBranche from "../ui/cards/CardBranche";
import CardSerieThematique from "../ui/cards/CardSerieThematique";

type Props = {
  input: RessourcesUI & {
    feuilletages?: FeuilletageExpanded;
    imageImages: ImageImagesExpanded;
    serieThematique: SerieThematiqueExpanded;
    branches: PageModulaireExpanded;
  };
};

const ModuleRessourcesUI = ({ input }: Props) => {
  const { title, branches, feuilletages, imageImages, serieThematique } = input;
  // const items: Array<
  //   FeuilletageExpanded | ImageImagesExpanded | SerieThematiqueExpanded
  // > = [
  //   ...(feuilletages ?? []),
  //   ...(imageImages ?? []),
  //   ...(serieThematique ?? []),
  // ];
  const itemsFlatten = [feuilletages, imageImages, serieThematique];
  return (
    <section className='module module--ressources-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {title && (
            <h2 className='module__title c-h1_5'>{_localizeField(title)}</h2>
          )}
          {/* <pre>{JSON.stringify(items)}</pre> */}
          <div className='grid--centered'>
            {itemsFlatten.map((item, i) => (
              <Fragment key={i}>
                {item?._type === "imageImages" && (
                  <CardImageImages input={item} size='md' />
                )}
                {item?._type === "feuilletage" && (
                  <CardFeuilletage input={item} size='md' />
                )}
                {item?._type === "serieThematique" && (
                  <CardSerieThematique input={item} size='md' />
                )}
              </Fragment>
            ))}

            {branches.map((item, i) => (
              <CardBranche
                key={i}
                input={item as unknown as PageModulaireExpanded}
                size='sm'
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModuleRessourcesUI;
