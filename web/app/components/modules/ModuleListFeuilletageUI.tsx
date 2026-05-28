"use client";
import React, { Fragment } from "react";
import useLocale from "@/app/context/LocaleContext";
import CardFeuilletage from "../ui/cards/CardFeuilletage";
import { FeuilletageExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { ListFeuilletageUI } from "@/app/sanity-api/types/sanity.types";
import FiltersFeuilletage from "../ui/filters/FiltersFeuilletage";

type Props = {
  input: ListFeuilletageUI & { items?: FeuilletageExpanded[] };
};

const ModuleListFeuilletageUI = ({ input }: Props) => {
  return (
    <section className='module module--list-feuilletage-ui'>
      <div className='module__inner'>
        <FiltersFeuilletage />
        {input.items && (
          <div className='grid md:grid-cols-4 items-start gap-gutter'>
            {input.items.map((item: FeuilletageExpanded, index: number) => (
              <Fragment key={`${item._id}-${index}`}>
                <CardFeuilletage input={item} size='md' />
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ModuleListFeuilletageUI;
