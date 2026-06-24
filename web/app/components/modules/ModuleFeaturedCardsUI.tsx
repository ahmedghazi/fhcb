import React, { useEffect, useRef } from "react";
import { FeaturedCardsUI } from "@/app/sanity-api/types/sanity.types";
import { ExhibitionExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import CardExhibitionFeatured from "../ui/cards/CardExhibitionFeatured";
import CardVideo from "../ui/cards/CardVideo";
import GridMasonryDessandro from "../ui/GridMasonryDessandro";

type Props = {
  input: FeaturedCardsUI;
};

const ModuleFeaturedCardsUI = ({ input }: Props) => {
  const { gridSize } = input;
  const ref = useRef<HTMLDivElement>(null);
  const items = input.items as unknown as ExhibitionExpanded[];
  const video = input.video;

  return (
    <section className='module module--featured-cards-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          <div ref={ref}>
            <GridMasonryDessandro>
              {video && <CardVideo input={video} />}
              {items?.map((item, index: number) => (
                <CardExhibitionFeatured
                  key={`${item._id}-${index}`}
                  input={item}
                />
              ))}
            </GridMasonryDessandro>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModuleFeaturedCardsUI;
