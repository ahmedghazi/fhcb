# Cards — documentation

_Dernière mise à jour : juin 2026 — structure DOM v2_

---

## Architecture

```
app/components/ui/cards/
  CardBase.tsx              ← composant unique, agnostique du contenu
  CardTags.tsx              ← tags non cliquables
  adapters/
    index.ts                ← un adaptateur par type Sanity → CardBaseProps
app/styles/design-system/
  _cards.scss               ← styles (base + CardBase en append)
```

Le principe : **CardBase ne sait pas ce qu'il affiche**. Il reçoit des props génériques. La logique métier (quel layout pour une expo cube vs tube, quel badge pour un événement en cours…) vit dans les adaptateurs.

Quand un nouveau type de contenu arrive dans Sanity → on crée une fonction dans `adapters/index.ts`. CardBase n'est pas touché.

---

## CardBase — props

| Prop | Type | Défaut | Description |
|---|---|---|---|
| `layout` | `"col" \| "row"` | `"col"` | Col = image au-dessus du texte. Row = 2 colonnes, image toujours à droite. |
| `colorVar` | `string` | — | Variable CSS de couleur catégorie, ex. `"var(--color-exhibition)"` |
| `badge` | `CardBadgeProps` | — | Pastille en haut à droite. Sur layout row : dans le media. Sur layout col : dans le content. |
| `images` | `SanityImageAssetFull[]` | `[]` | 1 ou 2 images. Sans recadrage (`object-fit: contain`). 2 images = côte à côte via `:has(figure + figure)`. |
| `videoUrl` | `string` | — | URL de la vidéo (inline ou hover selon `videoBehavior`). |
| `videoBehavior` | `"inline" \| "hover"` | `"inline"` | Inline = lecteur avec contrôles. Hover = autoplay muet en boucle au survol (Branch). |
| `tags` | `ReactNode` | — | Composant `<CardTags>` pré-construit dans l'adaptateur. Non cliquables. |
| `supTitle` | `string` | — | Texte au-dessus du titre. |
| `title` | `string` | requis | Titre principal (`c-h2`). |
| `subTitle` | `string` | — | Sous-titre (`c-h3`). |
| `description` | `ReactNode` | — | PortableText ou string. |
| `infoNode` | `ReactNode` | — | Dates, lieu, etc. Composant `<FHCBDates>` pré-construit dans l'adaptateur. |
| `actions` | `CardAction[]` | `[]` | Boutons. Max 2. Le second en `variant: "secondary"` → opacité 50%. |
| `contentCount` | `number` | — | Pour les Branches : affiché `[42]` dans le supTitle. |
| `footerPlacement` | `"auto" \| "inline" \| "detached"` | `"auto"` | Voir section dédiée. |
| `imagePlacement` | `"auto" \| "top"` | `"auto"` | `"top"` : media avant le header (layout `col` uniquement). Ex : expo à la une, image plein cadre en tête de card. |

## BEM — référence des classes

```
Bloc    : card
Éléments (card__)
  card__inner         wrapper principal
  card__media         image(s) ou vidéo
  card__badge         pastille
  card__header        zone titre + meta
  card__tags          liste de tags
  card__suptitle      texte au-dessus du titre
  card__title         titre principal (h3)
  card__subtitle      sous-titre
  card__body          zone description + info (dans header)
  card__description   texte long / PortableText
  card__info          dates, lieu
  card__footer        zone boutons
  card__btns          groupe de boutons
  card__body-header   sous-zone header (layout row + detached)
  card__body-footer   sous-zone footer placeholder (layout row + detached)
  card__video         élément <video>
  card__video-wrap    wrapper vidéo inline (avec contrôles)

Modifiers (card__inner--)
  card__inner--col            layout colonne
  card__inner--row            layout ligne (image à droite)
  card__inner--image-top      image avant le header (col uniquement)
  card__inner--footer-auto    footer géré par container queries
  card__video--hover          vidéo autoplay au survol (Branch)
```

> **Règle** : un élément BEM n'a qu'un seul `__`, toujours rattaché au bloc racine `card`.
> Les sous-éléments sémantiques utilisent un tiret simple : `card__body-header`, pas `card__body__header`.

---



### Layout `col`

```html
<!-- imagePlacement="auto" (défaut) -->
div.card__inner.card__inner--col
  div.card__header        ← card__tags, card__suptitle, card__title, card__subtitle
                            card__body > card__description + card__info
  div.card__media         ← Figure(s) ou card__video-wrap + badge
  div.card__footer        ← card__btns (absent si footerPlacement="detached")

<!-- imagePlacement="top" → .card__inner--image-top -->
div.card__inner.card__inner--col.card__inner--image-top
  div.card__media
  div.card__header
  div.card__footer
```

### Layout `row`

```html
div.card__inner.card__inner--row
  div.grid
    div.card__body
      div.card__header
      div.card__footer    ← card__btns
    div.card__media       ← badge positionné en absolu dans le media
```

### Layout `row` + `footerPlacement="detached"`

```html
div.card__inner.card__inner--row
  div.grid
    div.card__body
      div.card__body-header   ← card__header
      div.card__body-footer   ← placeholder visuel
    div.card__media
                          ↑ fin du card__inner
div.card__footer          ← hors du inner, rendu par le parent via <CardFooter>
  div.card__btns
```

---

## Footer placement

| Mode | Comportement | Cas d'usage |
|---|---|---|
| `"inline"` | Footer dans le flux (`col` : sous le media / `row` : dans `.card__body`) | Cards larges ≥ 4 cols |
| `"detached"` | Footer hors du `.card__inner`, collé au bas de `.card` via `flex-column` | Cards md (6 cols) où le bouton doit s'aligner entre cards |
| `"auto"` | Container queries décident selon la largeur réelle | Card déployée dans des contextes de grille variables |

En mode `"detached"`, il faut instancier `<CardFooter>` manuellement dans le parent :

```tsx
import CardBase, { CardFooter } from "./CardBase";

<div className="card card--exhibition card--md">
  <CardBase {...props} footerPlacement="detached" />
  <CardFooter actions={props.actions} />
</div>
```

---

## Adaptateurs Sanity

Chaque fonction prend un document Sanity expandé et retourne `CardBaseProps`.

```ts
import { exhibitionToCard, eventToCard, artistToCard, articleToCard, brancheToCard } from "./adapters";
```

### `exhibitionToCard(input: ExhibitionExpanded)`
- Layout déterminé par le ratio de l'image (`isLandscape`) et le statut (`isCurrent`, `isHorsLesMurs`)
- Expo à la une : `space === "cube"` → `"col"` / `space === "tube"` → `"row"`
- Couleur : `var(--color-exhibition)` (bleu)

### `eventToCard(input: EventExpanded)`
- Layout : `"col"` fixe
- Couleur : `var(--color-event)` (vert)

### `artistToCard(input: ArtistExpanded)`
- Layout : `"col"` fixe
- Couleur : `var(--color-artist)` (rose-50)

### `articleToCard(input: ArticleExpanded)`
- Layout : `"row"` si image paysage, `"col"` sinon
- Couleur : `var(--color-article)` (gris-100)

### `brancheToCard(input: PageModulaireExpanded, contentCount?: number)`
- Layout : `"col"` fixe
- `contentCount` affiché entre crochets `[42]`
- `videoUrl` et `videoBehavior: "hover"` commentés — à activer quand le champ `previewVideo` sera dans le schéma Sanity

---

## Couleurs par catégorie

Définies dans `_variables.scss` (à compléter) :

```scss
--color-exhibition : var(--color-bleu);
--color-event      : var(--color-vert);
--color-artist     : var(--color-rose-50);
--color-article    : var(--color-gris-100);
--color-branche    : var(--color-beige);   // à confirmer
```

---

## Tailles de grille

| Classe | Cols | Comportement footer recommandé |
|---|---|---|
| `card--sm` | 3 cols | `"inline"` |
| `card--sm-alt` | 5 cols | `"inline"` |
| `card--md` | 6 cols | `"detached"` |
| `card--md-alt` | 7 cols | `"detached"` |
| `card--lg` | 12 cols | `"inline"` |

---

## Badges (pastilles)

Positionnés en haut à droite de la card. Sur layout `"row"` : dans le media (absolu). Sur layout `"col"` : dans le content.

```ts
badge: { label: "En cours", colorVar: "var(--color-bleu)" }
```

Liste à définir avec le studio (ex : À la une, En cours, Passé, Hors les murs…). Les valeurs sont passées depuis l'adaptateur — un éditeur ne peut pas les modifier depuis le back-office sans évolution de l'adaptateur.

---

## Tags

Non cliquables. Composant `<CardTags input={tags} />` pré-construit dans les adaptateurs. Nouveaux tags ajoutables depuis Sanity Studio sans toucher au code (type `array` de `reference` vers document `tag`).

---

## Ajouter un nouveau type de contenu

1. Créer le type expandé dans `sanity-expanded.types.ts`
2. Ajouter une fonction dans `adapters/index.ts`
3. Ajouter le case dans `Rebonds.tsx`
4. Ajouter la couleur dans `_variables.scss`

Aucun fichier de composant à créer.

---

## Ajouter une nouvelle Branche

1. Créer le document `pageModulaire` dans Sanity Studio
2. Le `contentCount` est passé depuis le contexte `settings` (voir `CardBranche.tsx` existant)
3. Si vidéo hover : ajouter le champ `previewVideo` dans le schéma `pageModulaire`, puis décommenter les deux lignes dans `brancheToCard`
