import React from "react";
import { FeaturedCardsUI } from "@/app/sanity-api/types/sanity.types";
import { ExhibitionExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import CardExhibition from "../ui/cards/CardExhibition";

type Props = {
  input: FeaturedCardsUI;
};

const ModuleFeaturedCardsUI = ({ input }: Props) => {
  const { gridSize } = input;
  const cols = gridSize || 3;
  const items = input.items as unknown as ExhibitionExpanded[];

  return (
    <section className='module module--featured-cards-ui'>
      <div className='module__inner'>
        <div className={`grid md:grid-cols-${cols} items-start gap-gutter`}>
          {items?.map((item, index: number) => (
            <CardExhibition
              key={`${item._id}-${index}`}
              input={item}
              size='sm'
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModuleFeaturedCardsUI;
