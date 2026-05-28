"use client";
import React, { Fragment } from "react";
import useLocale from "@/app/context/LocaleContext";
import CardArticle from "../ui/cards/CardArticle";
import { ArticleExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { ListSerieThematiqueUI } from "@/app/sanity-api/types/sanity.types";

type Props = {
  input: ListSerieThematiqueUI & { items?: ArticleExpanded[] };
};

const ModuleListSerieThematiqueUI = ({ input }: Props) => {
  return (
    <section className='module module--list-serie-thematique-ui'>
      <div className='module__inner'>
        {input.items && (
          <div className='grid md:grid-cols-4 items-start gap-gutter'>
            {input.items.map((item: ArticleExpanded, index: number) => (
              <Fragment key={`${item._id}-${index}`}>
                <CardArticle input={item} size='md' />
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ModuleListSerieThematiqueUI;
