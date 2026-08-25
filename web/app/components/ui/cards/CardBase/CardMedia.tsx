import { ReactNode, RefObject } from "react";
import Figure from "../../Figure";
import { SanityImageAssetFull } from "@/app/sanity-api/types/sanity-expanded.types";

type CardMediaProps = {
  images: SanityImageAssetFull[];
  videoUrl?: string;
  videoBehavior: "inline" | "hover";
  videoRef: RefObject<HTMLVideoElement | null>;
  customMediaSlot?: ReactNode;
  imageSizes: string;
};

export const CardMedia = ({
  images,
  videoUrl,
  videoBehavior,
  videoRef,
  customMediaSlot,
  imageSizes,
}: CardMediaProps) => {
  const hasVideo = Boolean(videoUrl);

  return (
    <div className='card__media'>
      {customMediaSlot ??
        (hasVideo && videoBehavior === "inline" ? (
          <div className='card__video-wrap'>
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              playsInline
              preload='metadata'
              className='card__video'
            />
          </div>
        ) : hasVideo && videoBehavior === "hover" ? (
          <video
            ref={videoRef}
            src={videoUrl}
            loop
            muted
            playsInline
            preload='none'
            className='card__video card__video--hover'
          />
        ) : (
          images.map((asset, i) => (
            <Figure key={i} asset={asset} width={1000} sizes={imageSizes} />
          ))
        ))}
    </div>
  );
};
