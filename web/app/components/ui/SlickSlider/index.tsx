"use client";
import React, { ReactNode, useRef } from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.scss";

type Props = {
  children: ReactNode;
  perView?: number | "auto";
  controlsFloating?: boolean;
  settings?: Partial<Settings>;
};

const SlickSlider = ({
  children,
  perView = "auto",
  controlsFloating = false,
  settings: settingsOverride = {},
}: Props) => {
  const sliderRef = useRef<Slider>(null);

  const isAuto = perView === "auto";

  const settings: Settings = {
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    arrows: !controlsFloating,
    cssEase: "cubic-bezier(0.53, 0, 0.36, 1)",
    prevArrow: <Arrow left />,
    nextArrow: <Arrow />,
    ...(isAuto
      ? { variableWidth: true, slidesToShow: 1 }
      : { slidesToShow: perView as number }),
    ...settingsOverride,
  };

  return (
    <div className='slick-slider-container'>
      <Slider ref={sliderRef} {...settings}>
        {children}
      </Slider>
      {controlsFloating && (
        <div className='slick-slider__controls slick-slider__controls-floating'>
          <div
            className='prev'
            onClick={() => sliderRef.current?.slickPrev()}
          />
          <div
            className='next'
            onClick={() => sliderRef.current?.slickNext()}
          />
        </div>
      )}
    </div>
  );
};

export default SlickSlider;

function Arrow(props: { left?: boolean; onClick?: (e: any) => void }) {
  return (
    <svg
      onClick={props.onClick}
      className={`arrow ${props.left ? "arrow--left" : "arrow--right"}`}
      xmlns='http://www.w3.org/2000/svg'
      width='44'
      height='44'
      viewBox='0 0 44 44'
      fill='none'>
      <circle cx='22' cy='22' r='21.5' stroke='black' />
      {props.left && (
        <path
          d='M12.4355 21.8291L23.4805 13.2451L23.4805 15.5303L15.7021 21.1846L15.7754 21.4189C16.6982 21.3018 17.5918 21.2725 18.6172 21.2578L32.9434 21.2578L32.9434 23.2354L18.6172 23.25C17.5918 23.25 16.6982 23.2061 15.7754 23.0889L15.7021 23.3232L23.4805 28.9775L23.4805 31.2773L12.4355 22.6934L12.4355 21.8291Z'
          fill='black'
        />
      )}
      {!props.left && (
        <path
          d='M30.5645 22.1709L19.5195 30.7549V28.4697L27.2979 22.8154L27.2246 22.5811C26.3018 22.6982 25.4082 22.7275 24.3828 22.7422H10.0566V20.7646L24.3828 20.75C25.4082 20.75 26.3018 20.7939 27.2246 20.9111L27.2979 20.6768L19.5195 15.0225V12.7227L30.5645 21.3066V22.1709Z'
          fill='black'
        />
      )}
    </svg>
  );
}
