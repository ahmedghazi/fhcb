"use client";
import React from "react";
import Figure from "@/app/components/ui/Figure";
import { _localizeField } from "@/app/sanity-api/utils";
import { SupportUIExpanded } from "@/app/sanity-api/types/sanity-expanded.types";

type Props = {
  input: SupportUIExpanded;
};

const ModuleSupportUI = ({ input }: Props) => {
  const { title, subtitle, image, cta } = input;

  const localizedTitle = _localizeField(title);
  const localizedSubtitle = _localizeField(subtitle);

  const ctaLabel = cta?.internal?.label
    ? _localizeField(cta.internal.label)
    : _localizeField(cta?.external?.label);
  const ctaHref = cta?.external?.link || null;

  return (
    <section className='module module--support-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          <div className='module__text  flex flex-col '>
            <div className='header'>
              {localizedTitle && (
                <h2 className='module__title c-h1_5'>{localizedTitle}</h2>
              )}
              {localizedSubtitle && (
                <p className='module__subtitle'>{localizedSubtitle}</p>
              )}
            </div>
            <div className='footer'>
              {ctaLabel && ctaHref && (
                <a
                  href={ctaHref}
                  className='module__cta btn'
                  target='_blank'
                  rel='noopener noreferrer'>
                  {ctaLabel}
                </a>
              )}
            </div>
          </div>
          {image?.asset && (
            <div className='module__image '>
              <Figure
                asset={image.asset}
                caption={_localizeField(image.asset?.title) || ""}
                alt={_localizeField(image.asset?.altText)}
                author={_localizeField(image.asset?.description)}
                copyright={_localizeField(image.asset?.creditLine)}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ModuleSupportUI;
