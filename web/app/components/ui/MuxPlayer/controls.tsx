import React from "react";

type Props = {
  progress: number;
  muted: boolean;
};

const Controls = ({ progress, muted }: Props) => {
  // const style = {
  //   transform: `scaleX(${progress})`,
  //   transformOrigin: "left",
  // };
  console.log(progress);
  return (
    <div className='controls'>
      <div className='timeline'>
        <div
          className='timeline__bar'
          style={{ transform: `scaleX(${progress})`, transformOrigin: "left" }}
        />
      </div>
      {/* <div className='progress'>{progress}</div> */}
      <div className='muted'>{muted ? "Muted" : ""}</div>
    </div>
  );
};

export default Controls;
