import { CSSProperties, forwardRef } from "react";
import { MuxVideo } from "@/app/sanity-api/types/sanity.types";
import MuxVideoPlayer from "../MuxPlayer";
import BtnCta from "../btns/BtnCta";

type Props = {
  input: MuxVideo | any;
  style?: CSSProperties;
};

const CardVideoMux = forwardRef<HTMLDivElement, Props>(
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
);

CardVideoMux.displayName = "CardVideoMux";

export default CardVideoMux;
