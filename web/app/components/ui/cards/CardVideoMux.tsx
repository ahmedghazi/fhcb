"use client";
import { CSSProperties, forwardRef, memo } from "react";
import dynamic from "next/dynamic";
import { MuxVideo } from "@/app/sanity-api/types/sanity.types";
import BtnCta from "../btns/BtnCta";

// Code-split the mux-player-react bundle (custom elements + Hls.js) out of
// the initial page chunk — this card isn't the LCP element, so there's no
// reason its player library needs to parse/execute during first hydration.
const MuxVideoPlayer = dynamic(() => import("../MuxPlayer"), { ssr: false });

type Props = {
  input: MuxVideo | any;
  style?: CSSProperties;
};

const CardVideoMux = memo(forwardRef<HTMLDivElement, Props>(
  ({ input, style }, ref) => {
    const { video, cta } = input;
    return (
      <div
        ref={ref}
        style={style}
        className='card card--video-mux card--md-alt aspect-video'>
        <MuxVideoPlayer playbackId={video?.asset?.playbackId} loop />
        {cta && (
          <div className='card__footer'>
            {cta.internal && <BtnCta input={cta.internal} />}
          </div>
        )}
        {/* <pre>{JSON.stringify(cta, null, 2)}</pre> */}
      </div>
    );
  },
));

CardVideoMux.displayName = "CardVideoMux";

export default CardVideoMux;
