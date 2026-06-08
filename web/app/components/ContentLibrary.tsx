"use client";
import React from "react";
import { LIBRARY_QUERY_RESULT } from "../sanity-api/types/sanity.types";
import GridMasonry from "./ui/GridMasonry";
import CardProduct from "./ui/cards/CardProduct";
import { ProductExpanded } from "../sanity-api/types/sanity-expanded.types";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { _localizeText } from "../sanity-api/utils";
import Modules from "./modules";
import ModuleSliderCardUI from "./modules/ModuleSliderCardUI";
import ModuleGridCardUI from "./modules/ModuleGridCardUI";
import "../components/modules/index.scss";
type Props = {
  input: LIBRARY_QUERY_RESULT;
};

const ContentLibrary = ({ input }: Props) => {
  if (!input) return null;
  const {
    items: moreItems,
    hasMore,
    sentinelRef,
  } = useInfiniteScroll<ProductExpanded>({
    url: "/api/library/items",
  });

  const _renderModules = () => {
    return input.modules?.map((module) => {
      switch (module._type) {
        case "sliderCardUI":
          return <ModuleSliderCardUI key={module._key} input={module} />;
        case "gridCardUI":
          return <ModuleGridCardUI key={module._key} input={module} />;

        default:
          return null;
      }
    });
  };

  return (
    <div className='content content--library'>
      <div className='container-fluid'>
        <div className='filters'>filters</div>
      </div>
      {input.modules && <div className='modules'>{_renderModules()}</div>}

      {input.items && (
        <div className='container-fluid'>
          <section className='product'>
            <h2 className='c-h1_5'>{_localizeText("allProducts")}</h2>
            <GridMasonry columns={4}>
              {input.items.map((item, i) => (
                <CardProduct input={item as any} key={i} size='sm' />
              ))}
              {moreItems.map((item, i) => (
                <CardProduct input={item as any} key={`more-${i}`} size='sm' />
              ))}
            </GridMasonry>
            {hasMore && <div ref={sentinelRef} aria-hidden />}
          </section>
        </div>
      )}
    </div>
  );
};

export default ContentLibrary;
