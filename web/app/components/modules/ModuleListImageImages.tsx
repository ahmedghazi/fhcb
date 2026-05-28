"use client";
import React, { Fragment } from "react";
import CardImageImages from "../ui/cards/CardImageImages";
import { ImageImagesExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { ListImageImages } from "@/app/sanity-api/types/sanity.types";
import { _localizeField } from "@/app/sanity-api/utils";

type Props = {
  input: ListImageImages & { items?: ImageImagesExpanded[] };
};

const ModuleListImageImages = ({ input }: Props) => {
  const { items } = input;

  return (
    <section className='module module--list-image-images'>
      <div className='module__inner'>
        <div className='filters'>filters</div>

        {items && (
          <div className='grid md:grid-cols-2 items-start gap-gutter'>
            {items.map((item: ImageImagesExpanded, index: number) => (
              <Fragment key={`${item._id}-${index}`}>
                <CardImageImages input={item} size='md' />
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ModuleListImageImages;
