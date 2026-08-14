import React, { ReactNode } from "react";
import SlickSlider from "./SlickSlider";

type Props = {
  children: ReactNode;
};

const SliderCards = ({ children }: Props) => {
  return (
    <div className='slider-cards'>
      <SlickSlider
        settings={{
          infinite: true,
          // centerMode: true,
          variableWidth: true,
        }}>
        {children}
      </SlickSlider>
    </div>
  );
};

export default SliderCards;
