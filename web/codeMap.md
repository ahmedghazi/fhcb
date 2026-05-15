# codeMap — FHCB Web

Next.js 15 + Sanity CMS. App Router, TypeScript, Tailwind CSS 4, SCSS, Lenis.

## Config

| Fichier | Rôle |
|---|---|
| `next.config.ts` | Turbopack, domaines images (cdn.sanity.io) |
| `postcss.config.mjs` | Tailwind CSS 4 via `@tailwindcss/postcss` |
| `tsconfig.json` | Alias `@/*` → racine du projet |
| `.env.local` | `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN` |

---

## app/

### Pages & routes

| Fichier | Rôle |
|---|---|
| `layout.tsx` | Root layout — providers, Header, Footer, Cursor, Visual Editing |
| `page.tsx` | Page d'accueil (`pageModulaire` avec `homePage == true`) |
| `(pages)/[slug]/page.tsx` | Pages modulaires dynamiques par slug |
| `not-found.tsx` | Page 404 |
| `robots.ts` | Règles robots.txt |
| `sitemap.ts` | Génération du sitemap XML |
| `preview/enable/route.ts` | Active le draft mode Sanity |
| `preview/disable/route.ts` | Désactive le draft mode Sanity |
| `global.css` | Variables CSS du thème (`theme-fhcb`) + import Tailwind |
| `styles/index.scss` | Point d'entrée SCSS — importer les styles composants ici |

### components/

| Fichier | Rôle |
|---|---|
| `Header.tsx` | Navigation principale + switcher de langue |
| `Footer.tsx` | Navigation secondaire + infos footer |
| `LogoFHCB.tsx` | Logo SVG FHCB |
| `ContentModulaire.tsx` | Wrapper d'une page — applique la couleur, rend les modules |
| `BgGradient.tsx` | Dégradé de fond via CSS inline |

### components/modules/

Router central : `index.tsx` — reçoit le tableau `modules[]` de Sanity et dispatch vers le bon composant selon `_type`.

| Composant | Type Sanity | Description |
|---|---|---|
| `ModuleTextUI` | `textUI` | Bloc texte localisé avec titre optionnel |
| `ModuleImagesUI` | `imagesUI` | Grille d'images configurable (`gridSize`) |
| `ModuleVideoUI` | `videoUI` | Lecteur vidéo (URL ou Mux) |
| `ModuleTextImageUI` | `textImageUI` | Texte + image, direction gauche/droite |
| `ModuleTextSidebarUI` | `textSidebarUI` | Texte principal + colonne sidebar |
| `ModuleListUI` | `listUI` | Liste d'items avec CTA optionnel |
| `ModuleListsUI` | `listsUI` | Groupe de listes |
| `ModuleSliderCardUI` | `sliderCardUI` | Slider de cartes (références Sanity) |
| `ModuleGridCardUI` | `gridCardUI` | Grille de cartes (références Sanity) |
| `ModuleProgrammeUI` | `programmeUI` | Liste d'événements/expositions |

### components/ui/

| Fichier | Rôle |
|---|---|
| `LenisScrollProvider.tsx` | Smooth scroll (Lenis) + gestion `TOGGLE_SCROLL` via pubsub |
| `Cursor.tsx` | Curseur custom (mix-blend-mode difference) |
| `Figure.tsx` | Image Sanity optimisée via `next/image` + `urlFor` |
| `Embed.tsx` | Lecteur vidéo embed (ReactPlayer) ou iframe brut |

### context/

| Fichier | Rôle |
|---|---|
| `LocaleContext.tsx` | Langue active (`fr` par défaut) + `dispatch` pour changer |
| `PageContext.tsx` | CSS vars `--vh`, `--vw`, `--header-h`, `--footer-h`, `--doc-h` |

### sanity-api/

| Fichier | Rôle |
|---|---|
| `sanity.api.ts` | Constantes Sanity (projectId `e07ih8cz`, dataset, apiVersion) |
| `sanity.client.ts` | Client Sanity + `getClient(preview?)` + `sanityFetch()` |
| `sanity-queries.tsx` | Requêtes GROQ : `getSettings`, `getHome`, `getPageModulaire`, `getAllPagesModulaire` |
| `fragments.ts` | Fragments GROQ réutilisables (blockContent, modules, imageInGrid…) |
| `sanity-utils.ts` | `urlFor()` — génère les URLs d'images Sanity |
| `utils.ts` | `_linkResolver()`, `_localizeField()`, `_localizeText()` |
| `portableTextComponents.tsx` | Rendus PortableText (h2, h3, linkInternal, linkExternal, align) |

### config/

| Fichier | Rôle |
|---|---|
| `website.ts` | Métadonnées du site (titre, URL, favicon…) |
| `i18n.ts` | Labels traduits FR/EN pour les formulaires |

### types/

| Fichier | Rôle |
|---|---|
| `extra-types.ts` | Types TS manuels : `PageModulaire`, `Settings`, modules, `LocaleString`… |
| `utils/sanity-api/sanity.types.ts` | Types auto-générés par `typegen` (studio) |
| `utils/sanity-api/sanity-expanded.types.ts` | Types étendus avec références résolues (`ExhibitionExpanded`, etc.) |

---

## Ajout d'un nouveau module

1. Créer le schema dans `studio/schemaTypes/objects/modules/`
2. L'enregistrer dans `studio/schemaTypes/index.ts` et `modulesList.ts`
3. Ajouter le fragment GROQ dans `web/app/sanity-api/fragments.ts`
4. Créer le composant `Module[Nom].tsx` dans `web/app/components/modules/`
5. Ajouter le type dans `web/app/types/extra-types.ts`
6. Brancher le case dans `web/app/components/modules/index.tsx`

---

## Internationalisation

Les champs localisés Sanity (`localeString`, `localeBlockContent`) ont la structure `{ fr: "…", en: "…" }`.  
Lire via `_localizeField(field)` (côté client) ou directement `field?.[locale]` dans les composants.

## Preview Sanity

Le studio pointe vers `/preview/enable` et `/preview/disable`.  
En draft mode, `getClient({ token })` retourne les documents en `previewDrafts` avec Stega activé.
