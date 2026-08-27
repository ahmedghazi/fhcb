import { ReactNode } from "react";
import clsx from "clsx";
import { Link } from "next-view-transitions";
import { CardAction } from "./types";

// The primary action's href already covers the whole card via
// `CardLinkOverlay` (see `primaryAction` in index.tsx, always `actions[0]`),
// so it's redundant with the overlay and never gets a visible button —
// only `linkExternal` actions do.
const withoutRedundantPrimary = (actions: CardAction[]) =>
  actions.filter((action) => action.type === "linkExternal");

type ActionButtonsProps = {
  actions: CardAction[];
  actionsNode?: ReactNode;
};

export const ActionButtons = ({ actions, actionsNode }: ActionButtonsProps) => {
  const visibleActions = withoutRedundantPrimary(actions);
  if (visibleActions.length === 0 && actionsNode === undefined) return null;

  return (
    <div className='card__btns'>
      <div className='card__btns-conntent'>
        {visibleActions.map((action, i) => (
          <Link
            key={i}
            href={action.href}
            className={clsx(
              "btn",
              action.variant === "secondary" && "btn--secondary",
            )}>
            {action.label}
          </Link>
        ))}
        {actionsNode}
      </div>
    </div>
  );
};

// Rendu par le parent lorsque `footerPlacement="detached"` — voir les usages
// de <CardFooter> dans CardExhibition, CardProduct, CardFeuilletage, etc.
export const CardFooter = ({ actions, actionsNode }: ActionButtonsProps) => (
  <div className='card__footer'>
    <div className='card_footer-content'>
      <ActionButtons actions={actions} actionsNode={actionsNode} />
    </div>
  </div>
);
