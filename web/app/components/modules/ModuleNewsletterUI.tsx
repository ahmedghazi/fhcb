"use client";
import React from "react";
import Figure from "@/app/components/ui/Figure";
import { _localizeField } from "@/app/sanity-api/utils";
import { NewsletterUIExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import BtnCta from "../ui/btns/BtnCta";
import BtnCtaExternal from "../ui/btns/BtnCtaExternal";

type Props = {
  input: NewsletterUIExpanded;
};

const ModuleNewsletterUI = ({ input }: Props) => {
  const { title, subtitle, image, newsletterUrl, cta } = input;

  const localizedTitle = _localizeField(title);
  const localizedSubtitle = _localizeField(subtitle);
  return (
    <section className='module module--newsletter-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          <div className='module__text md:col-span-6 flex flex-col '>
            <div className='header'>
              {localizedTitle && (
                <h2 className='module__title c-h1_5- c-h1-lg'>
                  {localizedTitle}
                </h2>
              )}
              {localizedSubtitle && (
                <p className='module__subtitle'>{localizedSubtitle}</p>
              )}
            </div>
            <div className='footer'>
              {/* {newsletterUrl && (
                <a
                  href={newsletterUrl}
                  className='module__cta btn'
                  target='_blank'
                  rel='noopener noreferrer'>
                  {localizedTitle || "Newsletter"}
                </a>
              )} */}
              {cta?.internal && <BtnCta input={cta.internal} />}
              {cta?.external && <BtnCtaExternal input={cta.external} />}
            </div>
          </div>
          {image?.asset && (
            <div className='module__image md:col-span-6'>
              <Figure
                asset={image.asset}
                caption={_localizeField(image.asset?.title) || ""}
                alt={_localizeField(image.asset?.altText)}
                author={_localizeField(image.asset?.description)}
                copyright={_localizeField(image.asset?.creditLine)}
                sizes='(max-width: 767px) 90vw, 45vw'
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ModuleNewsletterUI;
