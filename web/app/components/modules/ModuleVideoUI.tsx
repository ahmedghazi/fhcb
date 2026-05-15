"use client";
import React from "react";
import { VideoUI } from "@/app/sanity-api/types/sanity.types";
import ReactPlayer from "react-player";

type Props = {
  input: VideoUI;
};

const ModuleVideoUI = ({ input }: Props) => {
  const video = input.video;

  return (
    <section className='module module--video-ui'>
      <div className='module__inner'>
        {video?.url && (
          <div style={{ aspectRatio: "16 / 9" }} className='player-container'>
            <ReactPlayer
              src={video.url}
              controls={true}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        )}
        {video?.muxAsset && (
          <div style={{ aspectRatio: "16 / 9" }} className='player-container'>
            <ReactPlayer
              src={`https://stream.mux.com/${video.muxAsset.playbackId}.m3u8`}
              controls={true}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default ModuleVideoUI;
