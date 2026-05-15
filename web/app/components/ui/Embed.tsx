"use client";
import React from "react";
import clsx from "clsx";
import ReactPlayer from "react-player";

type Props = {
  input: any;
};

const Embed = ({ input }: Props) => {
  return (
    <div className="embed">
      {input?.url && (
        <div
          style={{ aspectRatio: "16 / 9" }}
          className={clsx("player-container")}>
          <ReactPlayer
            src={input.url}
            controls={true}
            style={{ width: "100%", height: "100%", aspectRatio: "16 / 9" }}
          />
        </div>
      )}
      {input?.iframe && (
        <div dangerouslySetInnerHTML={{ __html: input.iframe }} />
      )}
    </div>
  );
};

export default Embed;
