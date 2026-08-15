"use client";
import React from "react";
import clsx from "clsx";
import ReactPlayer from "react-player";
import { Embed } from "@/app/sanity-api/types/sanity.types";

type Props = {
  input: Embed;
};

const EmbedComponent = ({ input }: Props) => {
  return (
    <div className='embed'>
      {input.url && (
        <div
          style={{ aspectRatio: "16 / 9" }}
          className={clsx("player-container")}>
          <ReactPlayer
            src={input.url}
            controls={true}
            light={true}
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

export default EmbedComponent;
