import { Link } from "next-view-transitions";

// Rend toute la carte cliquable vers l'action primaire (premier lien de `actions`).
// Les boutons visibles (dont un éventuel bouton secondaire) restent cliquables
// individuellement grâce au z-index appliqué sur `.card__btns` en CSS.
export const CardLinkOverlay = ({ href }: { href: string }) => (
  <Link
    href={href}
    className='card__link-overlay'
    aria-hidden
    tabIndex={-1}
    draggable={false}
  />
);
