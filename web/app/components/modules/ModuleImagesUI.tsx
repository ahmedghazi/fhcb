"use client";
import React from "react";
import Figure from "@/app/components/ui/Figure";
import {
  ImageInGridExpanded,
  ImagesUIExpanded,
} from "@/app/sanity-api/types/sanity-expanded.types";
import clsx from "clsx";
import { _localizeField } from "@/app/sanity-api/utils";

type Props = {
  input: ImagesUIExpanded;
};

const ModuleImagesUI = ({ input }: Props) => {
  const { title, items, gridSize } = input;
  return (
    <section className='module module--images-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {title && <h2 className='module__title c-h1_5'>{title}</h2>}

          {items && (
            <div
              className={clsx("grid gap-gutter", {
                "md:grid-cols-4": gridSize === 4,
                "md:grid-cols-3": gridSize === 3,
                "md:grid-cols-2": gridSize === 2,
              })}>
              {items.map((item: ImageInGridExpanded, i: number) => (
                <div
                  key={i}
                  className={clsx(
                    "module__image-item",
                    `md:col-span-${item.colSize}`,
                  )}>
                  {item.image?.asset && (
                    <Figure
                      asset={item.image.asset}
                      caption={_localizeField(item.image.asset?.title) || ""}
                      alt={_localizeField(item.image.asset?.altText)}
                      author={_localizeField(item.image.asset?.description)}
                      copyright={_localizeField(item.image.asset?.creditLine)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ModuleImagesUI;
