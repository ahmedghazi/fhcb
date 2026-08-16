import React from "react";
import { FeaturedCardsUI } from "@/app/sanity-api/types/sanity.types";
import { ExhibitionExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import CardExhibitionFeatured from "../ui/cards/CardExhibitionFeatured";
import CardVideoMux from "../ui/cards/CardVideoMux";

type Props = {
  input: FeaturedCardsUI;
};

const ModuleFeaturedCardsUI = ({ input }: Props) => {
  const items = input.items as unknown as ExhibitionExpanded[];
  const video = input.cardVideoMux;
  const [primary, secondary] = items ?? [];

  return (
    <section className='module module--featured-cards-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          <div className='featured-cards-grid'>
            {primary && (
              <div className='featured-cards-grid__primary'>
                <CardExhibitionFeatured
                  input={primary}
                  imageSizes='(max-width: 767px) 90vw, 35vw'
                />
              </div>
            )}
            <div className='featured-cards-grid__secondary'>
              {video && <CardVideoMux input={video} />}
              {secondary && (
                <CardExhibitionFeatured
                  input={secondary}
                  imageSizes='(max-width: 767px) 90vw, 50vw'
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModuleFeaturedCardsUI;
