"use client";
import React from "react";
import dynamic from "next/dynamic";
import { VideoUIExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import LogoFHCB from "../LogoFHCB";
import {
  getYouTubeNoCookieUrl,
  getYouTubeThumbnailUrl,
} from "@/app/lib/utils";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

type Props = {
  input: VideoUIExpanded;
};

const ModuleVideoUI = ({ input }: Props) => {
  const video = input.video;
  const youtubeUrlToYoutubeNoCookies = video?.embedUrl
    ? getYouTubeNoCookieUrl(video.embedUrl)
    : video?.embedUrl;
  const lightThumbnail =
    video?.placeholder?.asset?.url ||
    (video?.embedUrl ? getYouTubeThumbnailUrl(video.embedUrl) : null) ||
    true;
  return (
    <section className='module module--video-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {video && youtubeUrlToYoutubeNoCookies && (
            <div style={{ aspectRatio: "16 / 9" }} className='player-container'>
              <ReactPlayer
                src={youtubeUrlToYoutubeNoCookies}
                light={lightThumbnail}
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
