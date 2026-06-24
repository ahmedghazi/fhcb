import MuxPlayer from "@mux/mux-player-react";
import React, { useEffect, useRef, useState } from "react";
import Controls from "./controls";
import "./_index.scss";
type Props = {
  playbackId: string;
  title?: string;
  controls?: boolean;
  paused?: boolean;
  loop?: boolean;
};

const MuxVideoPlayer = ({
  playbackId,
  title,
  controls = false,
  paused = true,
  loop = false,
}: Props) => {
  const [ready, setReady] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [muted, setMuted] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(true);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    // console.log("progress", progress);
    // setRefresh(!refresh);
  }, [progress]);

  return (
    <div className='mux-player-container' onClick={() => setMuted(!muted)}>
      {ready && (
        <>
          <MuxPlayer
            playbackId={playbackId}
            metadata={title ? { video_title: title } : undefined}
            autoPlay='muted'
            muted={muted}
            paused={paused}
            loop={loop}
            // onTimeUpdate={(event: CustomEvent) => {
            //   const target = event.target as HTMLMediaElement;
            //   const currentTime = target?.currentTime;
            //   const duration = target?.duration;
            //   // console.log("currentTime", currentTime, "duration", duration);
            //   if (currentTime > 0) setProgress(currentTime / duration);
            // }}
          />
          {/* {controls && <Controls progress={progress} muted={muted} />} */}
        </>
      )}
    </div>
  );
};

export default MuxVideoPlayer;
