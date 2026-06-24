import { CSSProperties, forwardRef } from "react";
import { MuxVideo } from "@/app/sanity-api/types/sanity.types";
import MuxVideoPlayer from "../MuxPlayer";

type Props = {
  input: MuxVideo | any;
  style?: CSSProperties;
};

const CardVideo = forwardRef<HTMLDivElement, Props>(({ input, style }, ref) => {
  return (
    <div ref={ref} style={style} className='card card--video card--md-alt'>
      <MuxVideoPlayer playbackId={input?.asset?.playbackId} />
      <div className='card__footer'>
        <button className='btn'>
          La collection Henri Cartier-Bresson & Martine Franck
        </button>
      </div>
    </div>
  );
});

CardVideo.displayName = "CardVideo";

export default CardVideo;
