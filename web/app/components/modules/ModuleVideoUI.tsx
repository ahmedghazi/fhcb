"use client";
import React from "react";
import ReactPlayer from "react-player";
import { VideoUIExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import LogoFHCB from "../LogoFHCB";
import { getYouTubeNoCookieUrl } from "@/app/lib/utils";

type Props = {
  input: VideoUIExpanded;
};

const ModuleVideoUI = ({ input }: Props) => {
  const video = input.video;
  const youtubeUrlToYoutubeNoCookies = video?.embedUrl
    ? getYouTubeNoCookieUrl(video.embedUrl)
    : video?.embedUrl;
  return (
    <section className='module module--video-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {video && youtubeUrlToYoutubeNoCookies && (
            <div style={{ aspectRatio: "16 / 9" }} className='player-container'>
              <ReactPlayer
                src={youtubeUrlToYoutubeNoCookies}
                light={video.placeholder?.asset?.url}
                // controls={false}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          )}
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
