import { ReactNode } from "react";
import clsx from "clsx";
import { Link } from "next-view-transitions";
import { CardAction } from "./types";

// The primary action's href already covers the whole card via
// `CardLinkOverlay` (see `primaryAction` in index.tsx, always `actions[0]`), so once
// there's more than one action, only `linkExternal` actions get a visible
// button — internal ones are redundant with the overlay. A lone action is
// always shown, since then it's the only affordance on the card.
const withoutRedundantPrimary = (
  actions: CardAction[],
  actionsNode?: ReactNode,
) =>
  actions.length > 1 || actionsNode !== undefined
    ? actions.filter((action) => action.type === "linkExternal")
    : actions;

type ActionButtonsProps = {
  actions: CardAction[];
  actionsNode?: ReactNode;
};

export const ActionButtons = ({ actions, actionsNode }: ActionButtonsProps) => (
  <div className='card__btns'>
    <div className='card__btns-conntent'>
      {withoutRedundantPrimary(actions, actionsNode).map((action, i) => (
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

// Rendu par le parent lorsque `footerPlacement="detached"` — voir les usages
// de <CardFooter> dans CardExhibition, CardProduct, CardFeuilletage, etc.
export const CardFooter = ({ actions, actionsNode }: ActionButtonsProps) => (
  <div className='card__footer'>
    <div className='card_footer-content'>
      <ActionButtons actions={actions} actionsNode={actionsNode} />
    </div>
  </div>
);
