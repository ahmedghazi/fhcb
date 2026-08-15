"use client";
import React from "react";
import clsx from "clsx";
import dynamic from "next/dynamic";
import {
  getYouTubeNoCookieUrl,
  getYouTubeThumbnailUrl,
} from "@/app/lib/utils";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

type Props = {
  embedUrl?: string | null;
  placeholderUrl?: string | null;
};

const EmbedVideo = ({ embedUrl, placeholderUrl }: Props) => {
  if (!embedUrl) return null;
  const src = getYouTubeNoCookieUrl(embedUrl) || embedUrl;
  const light = placeholderUrl || getYouTubeThumbnailUrl(embedUrl) || true;

  return (
    <div className='embed'>
      <div
        style={{ aspectRatio: "16 / 9" }}
        className={clsx("player-container")}>
        <ReactPlayer
          src={src}
          controls={true}
          light={light}
          style={{ width: "100%", height: "100%", aspectRatio: "16 / 9" }}
        />
      </div>
    </div>
  );
};

export default EmbedVideo;
