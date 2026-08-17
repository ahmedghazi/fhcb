"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Image, { type ImageProps } from "next/image";

type Stain = {
  /** Centre horizontal de la tache, en % du cadre. */
  x: number;
  /** Centre vertical de la tache, en % du cadre. */
  y: number;
  /** Rayon horizontal de l'ellipse, en % de la largeur du cadre. */
  rx: number;
  /** Rayon vertical de l'ellipse, en % de la hauteur du cadre. */
  ry: number;
  /** Rotation de l'ellipse, en degrés. */
  rotate?: number;
  /** % du temps total (0-100) avant que cette tache commence à s'effacer. */
  delay?: number;
};

type ImageDarkroomProps = Omit<ImageProps, "placeholder"> & {
  /**
   * LQIP brut en base64 (pas le `placeholder="blur"` de Next : celui-ci
   * embarque son propre flou SVG qu'on ne peut pas défaire en CSS).
   */
  blurDataURL: string;
  wrapperClassName?: string;
  wrapperStyle?: CSSProperties;
  /** Durée totale du développement, en ms (à vitesse = 1). */
  developDuration?: number;
  /**
   * Multiplicateur de vitesse : 1 = normal, 2 = deux fois plus rapide,
   * 0.5 = deux fois plus lent.
   */
  speed?: number;
  /**
   * Taches personnalisées. Si omis, un jeu de taches est généré
   * aléatoirement (voir `randomize`) en tuilant le cadre par grille pour
   * garantir une couverture complète au départ.
   */
  stains?: Stain[];
  /**
   * Génère un pattern de taches différent à chaque image plutôt que de
   * réutiliser toujours le même. Déterministe (basé sur `seed` ou, à
   * défaut, sur `src`) : une même image produit toujours le même pattern
   * (rendu SSR stable), deux images différentes ont des patterns
   * différents. Ignoré si `stains` est fourni. Défaut : true.
   */
  randomize?: boolean;
  /**
   * Graine explicite pour le tirage aléatoire (string ou nombre). Par
   * défaut, dérivée de `src`.
   */
  seed?: string | number;
  grain?: boolean;
  /**
   * Couleur "papier photo" des taches avant qu'elles ne s'effacent. Un ton
   * neutre/crème marche sur toutes les photos (contrairement à réutiliser
   * le LQIP flouté, qui vire au noir sur une photo sombre). Défaut :
   * "#efe9df".
   */
  paperColor?: string;
};

// positions de secours si aspect ratio inconnu
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

/**
 * Choisit une grille (cols x rows) approximativement carrée en pixels selon
 * l'aspect ratio de l'image, pour que les cellules — et donc les taches —
 * n'aient pas l'air étirées sur un format très large ou très haut.
 */
function pickGrid(aspect: number) {
  if (!Number.isFinite(aspect) || aspect <= 0) return FALLBACK_GRID;
  if (aspect >= 1.3) return { cols: 3, rows: 2 };
  if (aspect <= 1 / 1.3) return { cols: 2, rows: 3 };
  return { cols: 3, rows: 3 };
}

/**
 * Génère des taches qui tuilent tout le cadre : une grille (légèrement
 * gigotée) de cellules, chacune couverte par une ellipse volontairement
 * surdimensionnée par rapport à sa cellule (~75-88% de la cellule en rayon)
 * pour garantir un recouvrement complet même avec le jitter — donc pas de
 * zone qui resterait "sharp" dès le départ. Chaque tache a son propre délai
 * (mélangé, pas dans l'ordre de la grille) pour un effet vraiment "tache
 * par tache" plutôt qu'un balayage prévisible.
 */
function generateStains(rand: () => number, aspect: number): Stain[] {
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
    Array.from({ length: count }, (_, i) => Math.round((i / count) * 68)),
    rand,
  );

  return cells.map((cell, i) => {
    const jitterX = (rand() - 0.5) * cellW * 0.3;
    const jitterY = (rand() - 0.5) * cellH * 0.3;
    return {
      x: clamp(cell.x + jitterX, 0, 100),
      y: clamp(cell.y + jitterY, 0, 100),
      rx: cellW * (0.72 + rand() * 0.16),
      ry: cellH * (0.72 + rand() * 0.16),
      rotate: Math.round(rand() * 360),
      delay: delays[i],
    };
  });
}

export default function ImageDarkroom({
  blurDataURL,
  wrapperClassName,
  wrapperStyle,
  className,
  style,
  onLoad,
  alt,
  developDuration = 2200,
  speed = 1,
  stains: stainsProp,
  randomize = true,
  seed: seedProp,
  grain = true,
  paperColor = "#efe9df",
  ...imageProps
}: ImageDarkroomProps) {
  const [loaded, setLoaded] = useState(false);
  const duration = Math.max(1, Math.round(developDuration / (speed || 1)));
  const fadeDuration = Math.max(400, Math.round(duration * 0.4));

  const srcKey =
    typeof imageProps.src === "string"
      ? imageProps.src
      : (imageProps.src as { src?: string })?.src;
  const randomSeed = hashString(String(seedProp ?? srcKey ?? "darkroom"));
  const aspect =
    typeof imageProps.width === "number" &&
    typeof imageProps.height === "number"
      ? imageProps.width / imageProps.height
      : 1;

  const stains = useMemo(() => {
    if (stainsProp?.length) return stainsProp;
    if (!randomize)
      return generateStains(mulberry32(hashString("darkroom-static")), aspect);
    return generateStains(mulberry32(randomSeed), aspect);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stainsProp, randomize, randomSeed, aspect]);

  return (
    <div
      className={`darkroom-wrapper${loaded ? " is-developed" : ""}${
        wrapperClassName ? ` ${wrapperClassName}` : ""
      }`}
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        // le LQIP fait office de papier photo à peine exposé sous le tirage
        backgroundImage: `url(${blurDataURL})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        imageRendering: "pixelated",
        height: "auto",
        aspectRatio: `${imageProps.width} / ${imageProps.height}`,
        ...wrapperStyle,
      }}>
      <Image
        {...imageProps}
        alt={alt}
        className={`darkroom-image${className ? ` ${className}` : ""}`}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        style={{
          width: "100%",
          height: "auto",
          aspectRatio: `${imageProps.width} / ${imageProps.height}`,
          display: "block",
          ...style,
        }}
      />

      {stains.map((s, i) => {
        // Le fondu est intégré au dégradé du masque (pas de filter: blur()
        // séparé) : ça évite le double-flou et les liserés visibles là où
        // deux taches indépendamment floutées se chevauchent.
        const maskImage = `radial-gradient(ellipse ${s.rx}% ${s.ry}% at ${s.x}% ${s.y}%, black 42%, transparent 100%)`;
        return (
          <span
            key={i}
            className='darkroom-stain'
            aria-hidden
            style={{
              backgroundColor: paperColor,
              WebkitMaskImage: maskImage,
              maskImage,
              transform: s.rotate ? `rotate(${s.rotate}deg)` : undefined,
              transitionDuration: `${fadeDuration}ms`,
              transitionDelay: `${Math.round(((s.delay ?? 0) / 100) * duration)}ms`,
            }}
          />
        );
      })}

      {grain && <span className='darkroom-grain' aria-hidden />}

      <style jsx>{`
        :global(.darkroom-image) {
          opacity: 0;
          filter: brightness(1.8) contrast(0.65) sepia(0.45) saturate(0.55);
          transition:
            opacity 250ms ease-out,
            filter ${duration}ms ease-out;
        }

        .darkroom-wrapper.is-developed :global(.darkroom-image) {
          opacity: 1;
          filter: none;
        }

        .darkroom-stain {
          position: absolute;
          inset: 0;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          opacity: 1;
          pointer-events: none;
          transition-property: opacity;
          transition-timing-function: ease-out;
        }

        .darkroom-wrapper.is-developed .darkroom-stain {
          opacity: 0;
        }

        /* --- grain de pellicule --- */
        .darkroom-grain {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          mix-blend-mode: overlay;
          opacity: 0.55;
          transition: opacity ${duration}ms ease-out;
        }

        .darkroom-wrapper.is-developed .darkroom-grain {
          opacity: 0.12;
        }

        @media (prefers-reduced-motion: reduce) {
          :global(.darkroom-image),
          .darkroom-stain,
          .darkroom-grain {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
