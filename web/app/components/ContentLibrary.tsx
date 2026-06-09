"use client";
import React, { useEffect } from "react";
import { LIBRARY_QUERY_RESULT } from "../sanity-api/types/sanity.types";
import GridMasonry from "./ui/GridMasonry";
import CardProduct from "./ui/cards/CardProduct";
import { ProductExpanded } from "../sanity-api/types/sanity-expanded.types";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { _localizeText } from "../sanity-api/utils";
import Modules from "./modules";
import ModuleSliderCardUI from "./modules/ModuleSliderCardUI";
import ModuleGridCardUI from "./modules/ModuleGridCardUI";
import ModuleListProductUI from "./modules/ModuleListProductUI";
import "../components/modules/index.scss";
import { subscribe, unsubscribe } from "pubsub-js";
import clsx from "clsx";
type Props = {
  input: LIBRARY_QUERY_RESULT;
};

const ContentLibrary = ({ input }: Props) => {
  if (!input) return null;
  const [isFiltering, setIsFiltering] = React.useState(false);
  // const {
  //   items: moreItems,
  //   hasMore,
  //   sentinelRef,
  // } = useInfiniteScroll<ProductExpanded>({
  //   url: "/api/library/items",
  // });

  useEffect(() => {
    const token = subscribe("IS_FILTERING", (e, d) => {
      setIsFiltering(d);
    });
    return () => {
      unsubscribe(token);
    };
  }, []);

  const _renderModules = () => {
    return input.modules?.map((module) => {
      switch (module._type) {
        case "sliderCardUI":
          return <ModuleSliderCardUI key={module._key} input={module} />;
        case "gridCardUI":
          return <ModuleGridCardUI key={module._key} input={module} />;
        case "listProductUI":
          return (
            <ModuleListProductUI key={module._key} input={module as any} />
          );

        default:
          return null;
      }
    });
  };

  return (
    <div
      className={clsx(
        "content content--library",
        isFiltering && "is-filtering",
      )}>
      {input.modules && <div className='modules'>{_renderModules()}</div>}
    </div>
  );
};

export default ContentLibrary;
