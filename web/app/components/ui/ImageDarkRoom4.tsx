"use client";

import { useState, type CSSProperties } from "react";
import Image, { type ImageProps } from "next/image";
import clsx from "clsx";

type ImageDarkroomProps = Omit<ImageProps, "placeholder"> & {
  /** LQIP brut en base64, optionnel — juste pour combler le tout petit
   * instant avant que l'<Image> elle-même ait quoi que ce soit à peindre.
   * Le fond par défaut ("blackroom") est noir, pas flouté. */
  blurDataURL?: string;
  wrapperClassName?: string;
  wrapperStyle?: CSSProperties;
  /** Durée de la révélation, en ms. */
  duration?: number;
  /**
   * Multiplicateur de vitesse : 1 = normal, 2 = deux fois plus rapide,
   * 0.5 = deux fois plus lent.
   */
  speed?: number;
};

export default function ImageDarkroom({
  src,
  alt,
  width,
  height,
  blurDataURL,
  wrapperClassName,
  wrapperStyle,
  duration = 2600,
  speed = 1,
  className,
  style,
  onLoad,
  ...rest
}: ImageDarkroomProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const effectiveDuration = Math.max(1, Math.round(duration / (speed || 1)));

  return (
    <div
      className={clsx(
        `darkroom-wrapper`,
        wrapperClassName ? wrapperClassName : "",
        isLoaded && "is-developed",
      )}
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        aspectRatio: width && height ? `${width} / ${height}` : undefined,
        backgroundColor: isLoaded ? "transparent" : "rgba(245, 245, 245, 1)",
        // backgroundImage: blurDataURL ? `url(${blurDataURL})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        ...wrapperStyle,
      }}>
      <Image
        {...rest}
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoad={(e) => {
          setIsLoaded(true);
          onLoad?.(e);
        }}
        className={`darkroom-image${isLoaded ? " is-developed" : ""}${
          className ? ` ${className}` : ""
        }`}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          ...style,
        }}
      />

      <style jsx>{`
        :global(.darkroom-image) {
          /*
            Même principe qu'avant (contraste extrême = seuil d'écrasement
            qui glisse le long de la gamme tonale au fil de l'anim), mais
            inversé : au lieu d'une brightness basse qui écrase les ombres
            à NOIR, on part d'une brightness très HAUTE qui écrase les
            hautes lumières et les tons moyens à BLANC — seuls les pixels
            déjà très sombres du départ commencent à transparaître. En
            animant brightness -> 1 (au lieu de rester basse), ce seuil de
            blanc redescend progressivement dans la gamme tonale : les
            ombres apparaissent en premier, les tons clairs/couleurs en
            dernier — comme un papier blanc qui laisse une image émerger,
            plutôt qu'une image qui sort du noir.
          */
          filter: brightness(12) contrast(13) grayscale(1) saturate(0.5);
          /* opacity : fondu rapide et séparé, juste pour éviter que l'image
             (déjà dans son état écrasé du filtre) ne s'affiche d'un coup en
             pleine opacité -> ce cut brutal est le "flash". filter : le
             sweep long qui fait le reveal. */
          opacity: 0;
          transition:
            opacity 220ms ease-out,
            filter ${effectiveDuration}ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        :global(.darkroom-image.is-developed) {
          opacity: 1;
          filter: brightness(1) contrast(1) grayscale(0) saturate(1);
        }

        @media (prefers-reduced-motion: reduce) {
          :global(.darkroom-image) {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
