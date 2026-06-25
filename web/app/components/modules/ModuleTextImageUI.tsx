"use client";
import React from "react";
import { PortableText } from "@portabletext/react";
import portableTextComponents from "@/app/sanity-api/portableTextComponents";
import Figure from "@/app/components/ui/Figure";
import useLocale from "@/app/context/LocaleContext";
import clsx from "clsx";
import { _localizeField } from "@/app/sanity-api/utils";
import { TextImageUIExpanded } from "@/app/sanity-api/types/sanity-expanded.types";

type Props = {
  input: TextImageUIExpanded;
};

const ModuleTextImageUI = ({ input }: Props) => {
  const { title, image, text, direction } = input;
  const localizedText = _localizeField(text);
  return (
    <section
      className={clsx(
        "module module--text-image-ui",
        direction === "right" && "module--text-image-ui--reverse",
      )}>
      <div className='container-fluid'>
        <div className='module__inner'>
          <div className='grid grid-cols-1 md:grid-cols-12 gap-gutter'>
            {image?.asset && (
              <div className='module__image md:col-span-5'>
                <Figure
                  asset={image.asset}
                  caption={_localizeField(image.asset?.title) || ""}
                  alt={_localizeField(image.asset?.altText)}
                  author={_localizeField(image.asset?.description)}
                  copyright={_localizeField(image.asset?.creditLine)}
                />
              </div>
            )}
            {localizedText && (
              <div className='module__text text md:col-span-7'>
                {title && (
                  <h2 className='module__title c-h1_5'>
                    {_localizeField(title)}
                  </h2>
                )}
                <PortableText
                  value={localizedText}
                  components={portableTextComponents}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModuleTextImageUI;
