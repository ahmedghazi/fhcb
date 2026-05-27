"use client";
import React from "react";
import clsx from "clsx";
import ReactPlayer from "react-player";
import { Video } from "@/app/sanity-api/types/sanity.types";

type Props = {
  input: Video;
};

const Embed = ({ input }: Props) => {
  return (
    <div className='embed'>
      {input.embedUrl && (
        <div
          style={{ aspectRatio: "16 / 9" }}
          className={clsx("player-container")}>
          <ReactPlayer
            src={input.embedUrl}
            controls={true}
            style={{ width: "100%", height: "100%", aspectRatio: "16 / 9" }}
          />
        </div>
      )}
      {/* {input?.iframe && (
        <div dangerouslySetInnerHTML={{ __html: input.iframe }} />
      )} */}
    </div>
  );
};

export default Embed;
