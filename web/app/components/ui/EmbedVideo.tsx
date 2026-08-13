"use client";
import React from "react";
import clsx from "clsx";
import ReactPlayer from "react-player";
import { Embed, Video } from "@/app/sanity-api/types/sanity.types";

type Props = {
  input: Video;
};

const EmbedVideo = ({ input }: Props) => {
  return (
    <div className='embed'>
      {input.embedUrl && (
        <div
          style={{ aspectRatio: "16 / 9" }}
          className={clsx("player-container")}>
          <ReactPlayer
            src={input.embedUrl}
            controls={true}
            light={true}
            style={{ width: "100%", height: "100%", aspectRatio: "16 / 9" }}
          />
        </div>
      )}
    </div>
  );
};

export default EmbedVideo;
