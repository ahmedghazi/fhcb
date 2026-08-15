"use client";
import React from "react";
import { VideoUIExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import LogoFHCB from "../LogoFHCB";
import EmbedVideo from "../ui/EmbedVideo";

type Props = {
  input: VideoUIExpanded;
};

const ModuleVideoUI = ({ input }: Props) => {
  const video = input.video;
  return (
    <section className='module module--video-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          <EmbedVideo
            embedUrl={video?.embedUrl}
            placeholderUrl={video?.placeholder?.asset?.url}
          />
          {/* <LogoFHCB type='icon' /> */}
          {/* {video?.muxAsset && (
          <div style={{ aspectRatio: "16 / 9" }} className='player-container'>
            <ReactPlayer
              src={`https://stream.mux.com/${video.muxAsset.playbackId}.m3u8`}
              controls={true}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        )} */}
        </div>
      </div>
    </section>
  );
};

export default ModuleVideoUI;
