"use client";
import React from "react";
import { PortableText } from "@portabletext/react";
import portableTextComponents from "@/app/sanity-api/portableTextComponents";
import Figure from "@/app/components/ui/Figure";
import useLocale from "@/app/context/LocaleContext";
import clsx from "clsx";
import { _localizeField } from "@/app/sanity-api/utils";
import { TextImageUI } from "@/app/sanity-api/types/sanity.types";

type Props = {
  input: TextImageUI;
};

const ModuleTextImageUI = ({ input }: Props) => {
  const { locale } = useLocale();
  const text = input.text?.[locale as "fr" | "en"] || input.text?.fr;

  return (
    <section
      className={clsx(
        "module module--text-image-ui",
        input.direction === "right" && "module--text-image-ui--reverse",
      )}>
      <div className='module__inner'>
        <div className='grid grid-cols-1 md:grid-cols-12 gap-gutter'>
          {input.image?.asset && (
            <div className='module__image md:col-span-5'>
              <Figure
                asset={input.image.asset}
                caption={_localizeField(input.image.caption)}
                alt={_localizeField(input.image.alt)}
                author={input.image.author}
                copyright={input.image.copyright || ""}
              />
              {/* <pre>{JSON.stringify(input.image, null, 2)}</pre> */}
            </div>
          )}
          {text && (
            <div className='module__text text md:col-span-6'>
              <PortableText value={text} components={portableTextComponents} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ModuleTextImageUI;
