"use client";
import { Fragment } from "react";
import Link from "next/link";
import CardExhibition from "../ui/cards/CardExhibition";
import { ExhibitionExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { ListExhibitionsUI, Tag } from "@/app/sanity-api/types/sanity.types";
import { _isPast } from "@/app/lib/utils";
import { _linkResolver, _localizeField } from "@/app/sanity-api/utils";

type Props = {
  input: Omit<ListExhibitionsUI, "filterTags"> & {
    filterTags?: Tag[];
    resolvedItems?: ExhibitionExpanded[];
    linkFallback?: any;
  };
};

const ModuleListExhibitionsUI = ({ input }: Props) => {
  const { resolvedItems, filterTags, linkFallback } = input;
  const __isPast = (item: ExhibitionExpanded) => _isPast(item);

  return (
    <section className='module module--list-exhibitions'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {/* {filterTags && filterTags.length > 0 && (
            <div className='module__tags'>
              {filterTags.map((tag) => (
                <span key={tag._id} className='tag'>
                  {_localizeField(tag.title)}
                </span>
              ))}
            </div>
          )} */}
          <div className='grid gap-gutter'>
            {resolvedItems?.map((item: ExhibitionExpanded, index: number) => (
              <Fragment key={`${item._id}-${index}`}>
                <div className={`md:col-span-${__isPast(item) ? 1 : 4}`}>
                  <CardExhibition
                    input={item}
                    size={__isPast(item) ? "sm" : "lg"}
                  />
                </div>
              </Fragment>
            ))}
            {resolvedItems?.length === 0 && (
              <div className='text-center'>
                <p>
                  Il n&apos;y a pas d&apos;
                  {filterTags?.map((tag) => (
                    <span key={tag._id} className='tag'>
                      {_localizeField(tag.title)}{" "}
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
      </div>
    </section>
  );
};

export default ModuleListExhibitionsUI;
