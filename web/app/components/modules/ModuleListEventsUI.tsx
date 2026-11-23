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
  const hasTag = (slug: string) =>
    filterTags?.some((el) => el.slug?.current === slug);
  const isEventTour = hasTag("visite-commentee");
  // status tags maintained by /api/cron/update-event-tags
  const isEventCurrent = hasTag("evenement-en-cours");
  const isEventPast = hasTag("evenement-passe");

  const noResultText = isEventTour
    ? _localizeText("noResultEventTour")
    : isEventCurrent
      ? _localizeText("noResultEventCurrent")
      : isEventPast
        ? _localizeText("noResultEventPast")
        : _localizeText("noResultEventFutur");
  // console.log(cardSize);
  return (
    <section className='module module--list-events'>
      <div className='container-fluid'>
        {/* <pre>{JSON.stringify(resolvedItems, null, 2)}</pre> */}
        <div className='module__inner'>
          {(resolvedItems?.length ?? 0) > 0 && (
            <div
              className={
                cardSize !== "lg" ? "grid--centered" : "grid gap-gutter"
              }>
              {resolvedItems?.map((item: EventExpanded, index: number) => (
                <Fragment key={`${item._id}-${index}`}>
                  <CardEvent input={item} size={cardSize || "sm"} />
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
              <p>{noResultText}</p>
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
