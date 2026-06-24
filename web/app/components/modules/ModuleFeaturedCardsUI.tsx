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
  const ref = useRef<HTMLDivElement>(null);
  const items = input.items as unknown as ExhibitionExpanded[];
  const video = input.video;

  const cards: React.ReactNode[] = (items ?? []).map((item, index) => (
    <CardExhibitionFeatured key={`${item._id}-${index}`} input={item} />
  ));
  if (video) {
    cards.splice(1, 0, <CardVideo key='video' input={video} />);
  }

  return (
    <section className='module module--featured-cards-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          <div ref={ref}>
            <GridMasonryDessandro>{cards}</GridMasonryDessandro>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModuleFeaturedCardsUI;
