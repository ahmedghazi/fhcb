"use client";
import { ConversationExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import clsx from "clsx";
import { conversationToCard } from "./adapters";
import CardBase from "./CardBase";
import { useFooterMaxHeight } from "@/app/hooks/useFooterMaxHeight";

type Props = {
  input: ConversationExpanded;
  size?: "md";
};

const CardConversation = ({ input, size = "md" }: Props) => {
  const props = conversationToCard(input);
  const { ref, style } = useFooterMaxHeight<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={clsx(
        "card card--conversation",
        `card--${size}`,
        "card--footer-hover",
      )}>
      <CardBase {...props} style={style ?? undefined} />
    </div>
  );
};

export default CardConversation;
