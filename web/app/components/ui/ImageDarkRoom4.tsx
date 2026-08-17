"use client";

import { useState, type CSSProperties } from "react";
import Image, { type ImageProps } from "next/image";

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
      className={`darkroom-wrapper${wrapperClassName ? ` ${wrapperClassName}` : ""}`}
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        aspectRatio: width && height ? `${width} / ${height}` : undefined,
        // "blackroom" : fond noir par défaut. Le LQIP, si fourni, ne sert
        // que de texture de transition avant que l'image ait chargé — le
        // reveal lui-même vient uniquement du filter ci-dessous, pas d'un
        // masque ou d'un calque séparé.
        // backgroundColor: "#000",
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
            Seul un contraste + luminosité extrêmes suffisent à faire
            émerger l'image des ombres vers les hautes lumières : avec un
            contraste très élevé, tout pixel dont la luminance est sous un
            certain seuil est écrasé à noir ; ce seuil dépend à la fois de
            brightness() et contrast() (cf. les formules du spec Filter
            Effects). En animant contrast -> 1 et brightness -> 1, ce seuil
            descend progressivement dans la gamme tonale : les pixels les
            plus clairs de la photo deviennent visibles en premier, les plus
            sombres en dernier — sans masque, sans SVG, juste ces deux
            filtres CSS. grayscale() ajoute l'idée qu'un tirage n'a pas
            encore "pris" ses couleurs tant qu'il n'est pas développé.
          */
          filter: brightness(0.22) contrast(13) grayscale(1) saturate(0.5);
          /* opacity : fondu rapide et séparé, juste pour éviter que l'image
             (déjà dans son état sombre du filtre) ne s'affiche d'un coup en
             pleine opacité par-dessus le LQIP -> ce cut brutal est le
             "flash noir". filter : le sweep long qui fait le reveal. */
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
