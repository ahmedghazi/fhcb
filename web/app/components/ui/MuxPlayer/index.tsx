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
  /** Play (and loop) only while hovered, paused and reset otherwise. */
  hoverPlay?: boolean;
};

const MuxVideoPlayer = ({
  playbackId,
  title,
  controls = false,
  paused = true,
  loop = false,
  hoverPlay = false,
}: Props) => {
  const [ready, setReady] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [muted, setMuted] = useState<boolean>(true);
  const [hovered, setHovered] = useState<boolean>(false);
  const playerRef = useRef<React.ComponentRef<typeof MuxPlayer>>(null);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    // console.log("progress", progress);
  }, [progress]);

  const handleMouseEnter = () => {
    if (!hoverPlay) return;
    setHovered(true);
  };
  const handleMouseLeave = () => {
    if (!hoverPlay) return;
    setHovered(false);
    const player = playerRef.current;
    if (player) player.currentTime = 0;
  };

  return (
    <div
      className='mux-player-container'
      onClick={hoverPlay ? undefined : () => setMuted(!muted)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      {ready && (
        <>
          <MuxPlayer
            ref={playerRef}
            playbackId={playbackId}
            metadata={title ? { video_title: title } : undefined}
            autoPlay={hoverPlay ? false : "muted"}
            muted={muted}
            paused={hoverPlay ? !hovered : paused}
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
