"use client";
import { Fragment } from "react";
import Link from "next/link";
import CardEvent from "../ui/cards/CardEvent";
import { EventExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { ListEventsUI, Tag } from "@/app/sanity-api/types/sanity.types";
import {
  _linkResolver,
  _localizeField,
  _localizeText,
} from "@/app/sanity-api/utils";

type Props = {
  input: Omit<ListEventsUI, "filterTags"> & {
    filterTags: Tag[];
    resolvedItems?: EventExpanded[];
    linkFallback?: any;
  };
};

const ModuleListEventsUI = ({ input }: Props) => {
  const { cardSize, resolvedItems, filterTags, linkFallback } = input;
  const isEventTour = filterTags?.some(
    (el) => el.slug?.current === "visite-commentee",
  );
  return (
    <section className='module module--list-events'>
      <div className='container-fluid'>
        {/* <pre>{JSON.stringify(filterTags, null, 2)}</pre> */}

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
                {isEventTour
                  ? _localizeText("noResultEventTour")
                  : _localizeText("noResultEventFutur")}
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
