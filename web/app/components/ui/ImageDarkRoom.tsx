"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Image, { type ImageProps } from "next/image";

type Blotch = {
  /** Position horizontale du centre de la tache, en % de la largeur du cadre. */
  x: number;
  /** Position verticale du centre de la tache, en % de la hauteur du cadre. */
  y: number;
  /** Taille finale de la tache (mask-size en %) une fois pleinement développée. */
  size?: number;
  /** Douceur du bord de la tache (0-90 -> flou gaussien du filtre SVG). */
  feather?: number;
  /** Intensité de la distorsion organique du bord (0-100, feDisplacementMap). */
  wobble?: number;
  /** Graine du bruit SVG (feTurbulence) : change la forme de la tache. */
  seed?: number;
  /** % du temps total où la tache commence à apparaître (0-100). */
  start?: number;
  /** % du temps total où la tache est pleinement développée (0-100). */
  end?: number;
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
   * Multiplicateur de vitesse de l'animation : 1 = normal, 2 = deux fois
   * plus rapide, 0.5 = deux fois plus lent. Pratique pour régler le rythme
   * sans avoir à recalculer developDuration.
   */
  speed?: number;
  /**
   * Taches personnalisées. Si omis, un jeu de taches est généré
   * aléatoirement (voir `randomize`) — passer ce prop désactive la
   * génération aléatoire et fige le pattern exactement tel que fourni.
   */
  blotches?: Blotch[];
  /**
   * Génère un pattern de taches différent à chaque image plutôt que de
   * réutiliser toujours le même. Le tirage est déterministe (basé sur
   * `seed` ou, à défaut, sur `src`) : une même image produit toujours le
   * même pattern (rendu SSR stable), mais deux images différentes ont des
   * patterns différents. Ignoré si `blotches` est fourni. Défaut : true.
   */
  randomize?: boolean;
  /**
   * Graine explicite pour le tirage aléatoire (string ou nombre). Par
   * défaut, dérivée de `src`. Utile pour figer/rejouer un pattern précis.
   */
  seed?: string | number;
  /**
   * Ajoute automatiquement une dernière "vague" centrale qui garantit que
   * l'image entière est révélée à 100%, même si tes taches ne couvrent pas
   * tous les recoins.
   */
  finalWash?: boolean;
  grain?: boolean;
  /**
   * Couleur de remplissage des taches du masque SVG (n'affecte pas le
   * rendu tant que le mode de masquage est alpha, le défaut du navigateur
   * pour une image — exposé pour rester configurable, ex. si tu passes
   * à un masque en luminance ailleurs). Défaut : "white".
   */
  maskColor?: string;
};

type NormalizedBlotch = Required<
  Pick<
    Blotch,
    "x" | "y" | "size" | "feather" | "wobble" | "seed" | "start" | "end"
  >
>;

const DEFAULT_BLOTCHES: Blotch[] = [
  // tache haut-droit, démarre tout de suite
  {
    x: 84,
    y: 14,
    start: 0,
    end: 50,
    size: 220,
    feather: 40,
    wobble: 60,
    seed: 4,
  },
  // random au centre
  {
    x: 42,
    y: 55,
    start: 12,
    end: 65,
    size: 260,
    feather: 48,
    wobble: 55,
    seed: 11,
  },
  // random bas-gauche
  {
    x: 14,
    y: 80,
    start: 22,
    end: 78,
    size: 240,
    feather: 38,
    wobble: 65,
    seed: 19,
  },
  // random haut-gauche
  {
    x: 18,
    y: 18,
    start: 35,
    end: 88,
    size: 210,
    feather: 42,
    wobble: 50,
    seed: 27,
  },
  // random bas-droit
  {
    x: 80,
    y: 84,
    start: 45,
    end: 92,
    size: 230,
    feather: 36,
    wobble: 58,
    seed: 33,
  },
];

const FINAL_WASH: NormalizedBlotch = {
  x: 50,
  y: 50,
  start: 72,
  end: 100,
  size: 380,
  feather: 35,
  wobble: 20,
  seed: 77,
};

// positions candidates bien réparties dans le cadre ; le tirage aléatoire en
// choisit un sous-ensemble (mélangé + légèrement décalé) pour chaque image.
const SLOT_POOL: Array<{ x: number; y: number }> = [
  { x: 84, y: 14 }, // haut-droit
  { x: 16, y: 16 }, // haut-gauche
  { x: 50, y: 50 }, // centre
  { x: 14, y: 82 }, // bas-gauche
  { x: 84, y: 84 }, // bas-droit
  { x: 50, y: 10 }, // haut-centre
  { x: 10, y: 50 }, // milieu-gauche
  { x: 90, y: 50 }, // milieu-droit
  { x: 50, y: 90 }, // bas-centre
];

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

/** Génère un jeu de taches aléatoire (mais déterministe pour une seed donnée). */
function generateRandomBlotches(rand: () => number): Blotch[] {
  const count = 4 + Math.floor(rand() * 3); // 4 à 6 taches
  const slots = seededShuffle(SLOT_POOL, rand).slice(0, count);
  const starts = seededShuffle(
    Array.from({ length: count }, (_, i) => Math.round((i / count) * 55)),
    rand,
  );

  return slots.map((slot, i) => {
    const start = starts[i];
    const span = 35 + rand() * 45; // 35 à 80
    return {
      x: clamp(slot.x + (rand() - 0.5) * 16, 6, 94),
      y: clamp(slot.y + (rand() - 0.5) * 16, 6, 94),
      start,
      end: Math.min(96, start + span),
      size: 200 + rand() * 90, // 200 à 290
      feather: 32 + rand() * 22, // 32 à 54
      wobble: 38 + rand() * 40, // 38 à 78
      seed: Math.floor(rand() * 1000),
    };
  });
}

function randomizedFinalWash(rand: () => number): NormalizedBlotch {
  return {
    ...FINAL_WASH,
    size: 360 + rand() * 60, // 360 à 420
    feather: 28 + rand() * 16, // 28 à 44
    seed: Math.floor(rand() * 1000),
  };
}

// table "lissée" utilisée en fin de résolution tonale : ~continue, proche de la photo réelle
const TONAL_SMOOTH_STEPS = 17;
const TONAL_SMOOTH_TABLE = Array.from({ length: TONAL_SMOOTH_STEPS }, (_, i) =>
  (i / (TONAL_SMOOTH_STEPS - 1)).toFixed(3),
).join(" ");

// progression façon feComponentTransfer "poster effect" : papier blanc -> silhouette
// (ombres) -> tons moyens -> quasi pleine gamme tonale, un peu comme un tirage
// qui sort du bac de révélateur.
const TONAL_TABLE_VALUES = [
  "1",
  "0.08 1",
  "0.03 0.28 0.62 1",
  "0.02 0.14 0.28 0.42 0.56 0.7 0.85 1",
  TONAL_SMOOTH_TABLE,
].join(";");
const TONAL_KEY_TIMES = "0;0.22;0.45;0.68;1";

function sanitizeId(id: string) {
  return id.replace(/[^a-zA-Z0-9_-]/g, "");
}

/** Interpole linéairement la taille (mask-size) d'une tache à un instant t (0-100). */
function sizeAt(
  blotch: Pick<NormalizedBlotch, "start" | "end" | "size">,
  t: number,
) {
  const { start, end, size } = blotch;
  if (t <= start) return 0;
  if (t >= end) return size;
  const progress = (t - start) / (end - start || 1);
  return size * progress;
}

/**
 * Génère une petite tache organique en data-URI SVG : un cercle passé dans
 * feTurbulence + feDisplacementMap (bord irrégulier, façon éclaboussure de
 * révélateur) puis feGaussianBlur (fondu vers le papier). Utilisée comme
 * calque de `mask-image` — le canevas SVG est ensuite mis à l'échelle par
 * `mask-size` pour l'animation de croissance.
 */
function organicBlobSVG({
  seed,
  wobble,
  feather,
  color = "white",
  canvas = 240,
}: {
  seed: number;
  wobble: number;
  feather: number;
  color?: string;
  canvas?: number;
}) {
  const baseFrequency = (0.006 + (seed % 7) * 0.0015).toFixed(4);
  const displaceScale = Math.round(8 + (wobble / 100) * 70);
  const blurStdDev = (2 + (feather / 100) * 20).toFixed(1);
  const radius = Math.round(canvas * 0.24);
  const c = canvas / 2;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${canvas}' height='${canvas}'><filter id='f' x='-60%' y='-60%' width='220%' height='220%' color-interpolation-filters='sRGB'><feTurbulence type='fractalNoise' baseFrequency='${baseFrequency}' numOctaves='3' seed='${seed}' result='noise'/><feDisplacementMap in='SourceGraphic' in2='noise' scale='${displaceScale}' xChannelSelector='R' yChannelSelector='G' result='displaced'/><feGaussianBlur in='displaced' stdDeviation='${blurStdDev}'/></filter><circle cx='${c}' cy='${c}' r='${radius}' fill='${color}' filter='url(#f)'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function buildDarkroomCSS({
  animationName,
  blotches,
  maskColor,
}: {
  animationName: string;
  blotches: NormalizedBlotch[];
  maskColor: string;
}) {
  const maskImage = blotches
    .map((b) =>
      organicBlobSVG({
        seed: b.seed,
        wobble: b.wobble,
        feather: b.feather,
        color: maskColor,
      }),
    )
    .join(", ");
  const maskPosition = blotches.map((b) => `${b.x}% ${b.y}%`).join(", ");
  const baseMaskSize = blotches.map(() => "0% 0%").join(", ");

  const breakpoints = Array.from(
    new Set([0, 100, ...blotches.flatMap((b) => [b.start, b.end])]),
  ).sort((a, b) => a - b);

  const frames = breakpoints
    .map((t) => {
      // Pas de plafond à 100% ici : chaque tache doit pouvoir dépasser large-
      // ment 100% de mask-size pour couvrir tout le cadre (le canevas SVG de
      // la tache ne remplit qu'une fraction de sa propre boîte, cf. organicBlobSVG).
      const sizes = blotches
        .map((b) => {
          const s = sizeAt(b, t);
          return `${s}% ${s}%`;
        })
        .join(", ");
      return `  ${t}% { -webkit-mask-size: ${sizes}; mask-size: ${sizes}; }`;
    })
    .join("\n");

  const keyframes = `@keyframes ${animationName} {\n${frames}\n}`;

  return { maskImage, maskPosition, baseMaskSize, keyframes };
}

export default function ImageDarkroom({
  blurDataURL,
  wrapperClassName,
  wrapperStyle,
  className,
  style,
  onLoad,
  alt,
  developDuration = 2800,
  speed = 1,
  blotches: blotchesProp,
  randomize = true,
  seed: seedProp,
  finalWash = true,
  grain = true,
  maskColor = "white",
  ...imageProps
}: ImageDarkroomProps) {
  const [loaded, setLoaded] = useState(false);
  const duration = Math.max(1, Math.round(developDuration / (speed || 1)));

  // Seed déterministe : explicite (`seed`) si fourni, sinon dérivée de `src`
  // (string ou StaticImageData) — même image = même pattern, deux images
  // différentes = deux patterns différents. Stable entre le rendu serveur
  // et le premier rendu client (pas de Math.random ici).
  const srcKey =
    typeof imageProps.src === "string"
      ? imageProps.src
      : (imageProps.src as { src?: string })?.src;
  const randomSeed = hashString(String(seedProp ?? srcKey ?? "darkroom"));

  // Identifiant unique du nom de @keyframes / de l'id du filtre SVG, dérivé
  // de randomSeed plutôt que de useId(). useId() dépend de l'ordre/du nombre
  // d'appels de hooks dans TOUT l'arbre React ; s'il y a un import dynamique
  // (next/dynamic, Suspense...) en amont qui rend différemment côté serveur
  // et côté client, useId() peut renvoyer une valeur différente au premier
  // rendu client -> mismatch d'hydratation sur le nom de classe styled-jsx.
  // randomSeed ne dépend que des props (src/seed), donc il est strictement
  // identique en SSR et en CSR quoi qu'il se passe ailleurs dans l'arbre.
  const uid = sanitizeId(Math.abs(randomSeed).toString(36));
  const animationName = `darkroomReveal-${uid}`;
  const tonalFilterId = `darkroom-tonal-${uid}`;

  const { maskImage, maskPosition, baseMaskSize, keyframes } = useMemo(() => {
    let source: Blotch[];
    let wash: NormalizedBlotch = FINAL_WASH;

    if (blotchesProp?.length) {
      source = blotchesProp;
    } else if (randomize) {
      const rand = mulberry32(randomSeed);
      source = generateRandomBlotches(rand);
      wash = randomizedFinalWash(rand);
    } else {
      source = DEFAULT_BLOTCHES;
    }

    const normalized: NormalizedBlotch[] = [
      ...source.map((b) => ({
        x: b.x,
        y: b.y,
        size: b.size ?? 250,
        feather: b.feather ?? 42,
        wobble: b.wobble ?? 55,
        seed: b.seed ?? 5,
        start: b.start ?? 0,
        end: b.end ?? 90,
      })),
      ...(finalWash ? [wash] : []),
    ];
    return buildDarkroomCSS({ animationName, blotches: normalized, maskColor });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    blotchesProp,
    randomize,
    randomSeed,
    finalWash,
    animationName,
    maskColor,
  ]);

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
          WebkitMaskImage: maskImage,
          maskImage,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: maskPosition,
          maskPosition,
          WebkitMaskSize: baseMaskSize,
          maskSize: baseMaskSize,
          ...style,
        }}
      />

      {/*
        Filtre SVG de résolution tonale : feComponentTransfer (type="discrete")
        posterise l'image, et une <animate> SMIL fait grandir la table de 1
        valeur (blanc uni) à ~17 valeurs (quasi continu), façon tirage qui
        révèle d'abord les ombres puis les tons moyens puis les hautes
        lumières. Monté seulement une fois l'image chargée pour que
        l'animation SMIL (begin="0s") démarre au bon moment.
      */}
      {loaded && (
        <svg
          width='0'
          height='0'
          style={{ position: "absolute" }}
          aria-hidden
          focusable='false'>
          <defs>
            <filter id={tonalFilterId} colorInterpolationFilters='sRGB'>
              <feComponentTransfer>
                <feFuncR type='discrete' tableValues='1'>
                  <animate
                    attributeName='tableValues'
                    values={TONAL_TABLE_VALUES}
                    keyTimes={TONAL_KEY_TIMES}
                    dur={`${duration}ms`}
                    begin='0s'
                    fill='freeze'
                    calcMode='discrete'
                  />
                </feFuncR>
                <feFuncG type='discrete' tableValues='1'>
                  <animate
                    attributeName='tableValues'
                    values={TONAL_TABLE_VALUES}
                    keyTimes={TONAL_KEY_TIMES}
                    dur={`${duration}ms`}
                    begin='0s'
                    fill='freeze'
                    calcMode='discrete'
                  />
                </feFuncG>
                <feFuncB type='discrete' tableValues='1'>
                  <animate
                    attributeName='tableValues'
                    values={TONAL_TABLE_VALUES}
                    keyTimes={TONAL_KEY_TIMES}
                    dur={`${duration}ms`}
                    begin='0s'
                    fill='freeze'
                    calcMode='discrete'
                  />
                </feFuncB>
              </feComponentTransfer>
            </filter>
          </defs>
        </svg>
      )}

      {grain && <span className='darkroom-grain' aria-hidden />}

      <style jsx>{`
        ${keyframes}

        :global(.darkroom-image) {
          opacity: 0;
          filter: brightness(2.4) contrast(0.35) sepia(0.85) saturate(0.35)
            blur(1.5px);
        }

        .darkroom-wrapper.is-developed :global(.darkroom-image) {
          animation:
            ${animationName} ${duration}ms cubic-bezier(0.22, 0.61, 0.36, 1)
              forwards,
            darkroomOpacity ${Math.round(duration * 0.12)}ms ease-out forwards,
            darkroomChemistry ${duration}ms ease-out forwards;
        }

        @keyframes darkroomOpacity {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes darkroomChemistry {
          0% {
            filter: url(#${tonalFilterId}) brightness(2.4) contrast(0.35)
              sepia(0.85) saturate(0.35) blur(1.5px);
          }
          35% {
            filter: url(#${tonalFilterId}) brightness(1.5) contrast(0.6)
              sepia(0.55) saturate(0.6) blur(0.6px);
          }
          70% {
            filter: url(#${tonalFilterId}) brightness(1.08) contrast(1.05)
              sepia(0.15) saturate(0.9) blur(0px);
          }
          100% {
            filter: url(#${tonalFilterId}) brightness(1) contrast(1) sepia(0)
              saturate(1) blur(0px);
          }
        }

        /* --- grain de pellicule --- */
        .darkroom-grain {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          mix-blend-mode: overlay;
          opacity: 0.55;
        }

        .darkroom-wrapper.is-developed .darkroom-grain {
          animation: darkroomGrainFade ${duration}ms ease-out forwards;
        }

        @keyframes darkroomGrainFade {
          0% {
            opacity: 0.55;
          }
          60% {
            opacity: 0.32;
          }
          100% {
            opacity: 0.12;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(.darkroom-image),
          .darkroom-grain {
            animation: none !important;
          }
          .darkroom-wrapper.is-developed :global(.darkroom-image) {
            opacity: 1;
            filter: none;
            -webkit-mask-image: none;
            mask-image: none;
          }
          .darkroom-wrapper.is-developed .darkroom-grain {
            opacity: 0.12;
          }
        }
      `}</style>
    </div>
  );
}
