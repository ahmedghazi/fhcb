import React from "react";

type Props = {
  start: string;
  end: string;
};

const BgGradient = ({ start, end }: Props) => {
  const style: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundImage: `linear-gradient(to bottom, ${start}, ${end})`,
    zIndex: -1,
  };
  return <div className="bg-gradient" style={style}></div>;
};

export default BgGradient;
