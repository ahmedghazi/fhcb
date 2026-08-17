"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Image, { type ImageProps } from "next/image";

type DarkroomBlob = {
  /** Centre horizontal du cercle, en % du cadre. */
  cx: number;
  /** Centre vertical du cercle, en % du cadre. */
  cy: number;
  /** Rayon cible une fois "développé", en % (cf. formule SVG pour les rayons en %). */
  r: number;
  /** % du temps total (0-100) avant que ce cercle commence à grandir. */
  delay?: number;
  /** Multiplicateur sur `duration` pour la durée de croissance propre à ce cercle. */
  durationFactor?: number;
};

type DarkroomRevealProps = Omit<ImageProps, "placeholder"> & {
  blurDataURL?: string;
  duration?: number;
  wrapperClassName?: string;
  wrapperStyle?: CSSProperties;
  idSeed?: string;
  /**
   * Cercles personnalisés. Si omis, un jeu est généré aléatoirement (voir
   * `randomize`) en tuilant le cadre par grille pour garantir une
   * couverture complète au départ.
   */
  blobs?: DarkroomBlob[];
  /**
   * Génère un pattern différent par image (déterministe, basé sur `idSeed`
   * ou `src`). Ignoré si `blobs` est fourni. Défaut : true.
   */
  randomize?: boolean;
  grain?: boolean;
  /** stdDeviation du flou du filtre "gooey", en px. Défaut : 12. */
  blurAmount?: number;
};

const FALLBACK_GRID = { cols: 3, rows: 3 };

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Hash déterministe (FNV-1a) d'une chaîne vers un entier 32 bits non signé. */
function hashString(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** PRNG seedé (mulberry32) — même seed = même suite de nombres, à chaque rendu (SSR compris). */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function rand() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], rand: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickGrid(aspect: number) {
  if (!Number.isFinite(aspect) || aspect <= 0) return FALLBACK_GRID;
  if (aspect >= 1.3) return { cols: 3, rows: 2 };
  if (aspect <= 1 / 1.3) return { cols: 2, rows: 3 };
  return { cols: 3, rows: 3 };
}

/**
 * Génère des cercles qui tuilent tout le cadre (grille légèrement gigotée),
 * chacun avec un rayon cible volontairement généreux par rapport à sa
 * cellule. Avec le filtre gooey, ce chevauchement n'est pas un problème —
 * c'est justement ce qui les fait fusionner en formes fluides — donc pas
 * besoin d'être aussi prudent que pour un simple mask sans filtre.
 */
function generateBlobs(rand: () => number, aspect: number): DarkroomBlob[] {
  const { cols, rows } = pickGrid(aspect);
  const cellW = 100 / cols;
  const cellH = 100 / rows;

  const cells: { x: number; y: number }[] = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      cells.push({ x: (i + 0.5) * cellW, y: (j + 0.5) * cellH });
    }
  }

  const count = cells.length;
  const delays = seededShuffle(
    Array.from({ length: count }, (_, i) => Math.round((i / count) * 55)),
    rand,
  );

  return cells.map((cell, i) => {
    const jitterX = (rand() - 0.5) * cellW * 0.3;
    const jitterY = (rand() - 0.5) * cellH * 0.3;
    return {
      cx: clamp(cell.x + jitterX, 0, 100),
      cy: clamp(cell.y + jitterY, 0, 100),
      r: Math.max(cellW, cellH) * (1.05 + rand() * 0.25),
      delay: delays[i],
      durationFactor: 0.75 + rand() * 0.25,
    };
  });
}

export default function DarkroomReveal({
  src,
  alt,
  width,
  height,
  blurDataURL,
  duration = 2800,
  wrapperClassName = "",
  wrapperStyle,
  className = "",
  style,
  onLoad,
  idSeed,
  blobs: blobsProp,
  randomize = true,
  grain = true,
  blurAmount = 12,
  ...rest
}: DarkroomRevealProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Seed déterministe (SSR === CSR) : `idSeed` si fourni, sinon `src`. Sert
  // à la fois pour l'id du filtre/mask (évite les collisions entre
  // instances) et pour le tirage aléatoire des cercles.
  const rawSrc =
    typeof src === "string"
      ? src
      : (src as { src?: string })?.src || "darkroom";
  const seed = hashString(String(idSeed || rawSrc));
  const uid = seed.toString(36);
  const filterId = `goo-filter-${uid}`;
  const maskId = `darkroom-mask-${uid}`;

  const aspect =
    typeof width === "number" && typeof height === "number"
      ? width / height
      : 1;

  const blobs = useMemo(() => {
    if (blobsProp?.length) return blobsProp;
    const rand = mulberry32(randomize ? seed : hashString("darkroom-static"));
    return generateBlobs(rand, aspect);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blobsProp, randomize, seed, aspect]);

  return (
    <div
      className={`relative overflow-hidden w-full h-auto ${wrapperClassName}`}
      style={{
        aspectRatio: width && height ? `${width} / ${height}` : "auto",
        backgroundImage: blurDataURL ? `url(${blurDataURL})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        ...wrapperStyle,
      }}>
      {/*
        SVG invisible portant juste les defs (filtre gooey + masque). Le
        masque est référencé directement sur l'<Image> plus bas via
        mask-image: url(#maskId).
      */}
      <svg
        className='absolute inset-0 w-full h-full pointer-events-none opacity-0'
        aria-hidden='true'>
        <defs>
          {/* Filtre "gooey" : flou puis seuil raide sur l'alpha -> les
              cercles qui se chevauchent fusionnent en formes fluides au
              lieu de montrer un bord double-flouté (l'effet "métaballes"
              classique). */}
          <filter id={filterId} colorInterpolationFilters='sRGB'>
            <feGaussianBlur
              in='SourceGraphic'
              stdDeviation={blurAmount}
              result='blur'
            />
            <feColorMatrix
              in='blur'
              type='matrix'
              values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -10'
            />
          </filter>

          {/*
            maskUnits="objectBoundingBox" + x/y/w/h à 0,0,1,1 : la région du
            masque colle exactement à la boîte de l'image (pas de marge),
            ce qui est voulu puisque les cercles sont dimensionnés pour
            déborder du cadre une fois développés.

            En revanche, on NE met PAS maskContentUnits="objectBoundingBox"
            pour les enfants : ça casserait le filtre (feGaussianBlur y
            interprète stdDeviation dans un espace 0-1, ce qui le rend soit
            invisible soit s'il est assez précis complètement disproportionné,
            et le comportement diffère fortement d'un navigateur à l'autre).
            À la place, les cercles utilisent des coordonnées en % directement
            sur cx/cy/r — en SVG, les pourcentages sur ces attributs se
            résolvent nativement contre la taille réelle affichée de l'image
            masquée, donc c'est déjà responsive sans passer par
            objectBoundingBox, et le filtre reste dans un espace en pixels
            réels (stdDeviation="12" veut vraiment dire ~12px).
          */}
          <mask
            id={maskId}
            maskUnits='objectBoundingBox'
            x='0'
            y='0'
            width='1'
            height='1'>
            <g filter={`url(#${filterId})`}>
              {blobs.map((b, i) => (
                <circle
                  key={i}
                  cx={`${b.cx}%`}
                  cy={`${b.cy}%`}
                  fill='white'
                  style={{
                    // On anime la propriété CSS `r` directement plutôt que
                    // `transform: scale()` : ça grandit nativement depuis
                    // le centre du cercle (cx, cy) sans dépendre de
                    // transform-origin, dont la résolution en % sur un
                    // élément SVG (bounding box propre vs. transform-box)
                    // est encore incohérente selon les navigateurs.
                    r: isLoaded ? `${b.r}%` : "0%",
                    transition: `r ${Math.round(duration * (b.durationFactor ?? 1))}ms cubic-bezier(0.16, 1, 0.3, 1) ${Math.round(
                      ((b.delay ?? 0) / 100) * duration,
                    )}ms`,
                  }}
                />
              ))}
            </g>
          </mask>
        </defs>
      </svg>

      {/* L'image reste nette : le filtre gooey n'est appliqué qu'au
          contenu du masque, jamais à l'image elle-même. */}
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
        className={`w-full h-auto block ${className}`}
        style={{
          ...style,
          opacity: isLoaded ? 1 : 0,
          filter: isLoaded
            ? "brightness(1) contrast(1) sepia(0)"
            : "brightness(2) contrast(0.5) sepia(0.8)",
          transition: `filter ${duration}ms ease-out, opacity 300ms ease-out`,
          WebkitMaskImage: `url(#${maskId})`,
          maskImage: `url(#${maskId})`,
        }}
      />

      {grain && (
        <span
          aria-hidden
          className='absolute inset-0 pointer-events-none'
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            mixBlendMode: "overlay",
            opacity: isLoaded ? 0.12 : 0.55,
            transition: `opacity ${duration}ms ease-out`,
          }}
        />
      )}
    </div>
  );
}
