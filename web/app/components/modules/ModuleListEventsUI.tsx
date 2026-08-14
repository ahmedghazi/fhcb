"use client";
import { Fragment } from "react";
import Link from "next/link";
import CardEvent from "../ui/cards/CardEvent";
import { EventExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { ListEventsUI, Tag } from "@/app/sanity-api/types/sanity.types";
import { _linkResolver, _localizeField } from "@/app/sanity-api/utils";

type Props = {
  input: Omit<ListEventsUI, "filterTags"> & {
    filterTags: Tag[];
    resolvedItems?: EventExpanded[];
    linkFallback?: any;
  };
};

const ModuleListEventsUI = ({ input }: Props) => {
  const { cardSize, resolvedItems, filterTags, linkFallback } = input;
  return (
    <section className='module module--list-events'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {(resolvedItems?.length ?? 0) > 0 && (
            <div
              className={
                cardSize !== "lg" ? "grid--centered" : "grid gap-gutter"
              }>
              {resolvedItems?.map((item: EventExpanded, index: number) => (
                <Fragment key={`${item._id}-${index}`}>
                  <CardEvent
                    input={item}
                    size={cardSize === "lg" ? "lg" : "sm"}
                  />
                </Fragment>
              ))}
            </div>
          )}
          {resolvedItems?.length === 0 && linkFallback?.internal && (
            <div className='text-center'>
              <Link
                className='btn'
                href={_linkResolver(linkFallback.internal.link)}>
                {_localizeField(linkFallback.internal.label)}
              </Link>
            </div>
          )}
          {resolvedItems?.length === 0 && (
            <div className='text-center'>
              <p>
                Il n&apos;y a pas d&apos;
                {filterTags?.map((tag) => (
                  <span key={tag._id} className='tag'>
                    {_localizeField(tag.title)}
                  </span>
                ))}{" "}
                actuellement.
              </p>
              {linkFallback?.internal && (
                <Link
                  className='btn'
                  href={_linkResolver(linkFallback.internal.link)}>
                  {_localizeField(linkFallback.internal.label)}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ModuleListEventsUI;
