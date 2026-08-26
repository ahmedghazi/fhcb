"use client";
import MuxPlayer from "@mux/mux-player-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useConsent } from "react-hook-consent";
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
  /**
   * Controlled hover state. Pass this when the player is nested under an
   * element that covers it (e.g. a card's full-card link overlay) — such an
   * overlay wins hit-testing, so this component's own mouseenter/mouseleave
   * never fire and hoverPlay silently does nothing. The parent should track
   * hover on its own outermost element instead (which still receives the
   * events, since it's an ancestor of the overlay) and pass it down here.
   */
  hovered?: boolean;
};

const MuxVideoPlayer = ({
  playbackId,
  title,
  controls = false,
  paused = true,
  loop = false,
  hoverPlay = false,
  hovered: hoveredProp,
}: Props) => {
  const [ready, setReady] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [muted, setMuted] = useState<boolean>(true);
  const [internalHovered, setInternalHovered] = useState<boolean>(false);
  const isControlled = hoveredProp !== undefined;
  const hovered = isControlled ? hoveredProp : internalHovered;
  const playerRef = useRef<React.ComponentRef<typeof MuxPlayer>>(null);
  const { hasConsent } = useConsent();

  // Stable identity so the mux-player custom element doesn't see a "changed"
  // prop (and re-diff/re-init) on every unrelated parent re-render.
  const metadata = useMemo(
    () => (title ? { video_title: title } : undefined),
    [title],
  );

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    // console.log("progress", progress);
  }, [progress]);

  // Reset playback once hover ends, regardless of whether `hovered` came
  // from our own listeners below or from the controlled prop.
  useEffect(() => {
    if (!hoverPlay || hovered) return;
    const player = playerRef.current;
    if (player) player.currentTime = 0;
  }, [hoverPlay, hovered]);

  const handleMouseEnter = useCallback(() => {
    if (!hoverPlay || isControlled) return;
    setInternalHovered(true);
  }, [hoverPlay, isControlled]);
  const handleMouseLeave = useCallback(() => {
    if (!hoverPlay || isControlled) return;
    setInternalHovered(false);
  }, [hoverPlay, isControlled]);
  const handleClick = useCallback(() => {
    if (hoverPlay) return;
    setMuted((m) => !m);
  }, [hoverPlay]);

  return (
    <div
      className='mux-player-container'
      onClick={hoverPlay ? undefined : handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      {ready && (
        <>
          <MuxPlayer
            ref={playerRef}
            playbackId={playbackId}
            metadata={metadata}
            disableTracking={!hasConsent("mux-data")}
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

export default React.memo(MuxVideoPlayer);
