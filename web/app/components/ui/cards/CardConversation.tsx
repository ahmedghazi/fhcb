"use client";
import { ConversationExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import clsx from "clsx";
import { conversationToCard } from "./adapters";
import CardBase from "./CardBase";

type Props = {
  input: ConversationExpanded;
  size?: "md";
};

const CardConversation = ({ input, size = "md" }: Props) => {
  const props = conversationToCard(input);

  return (
    <div
      className={clsx(
        "card card--conversation",
        `card--${size}`,
        // "card--footer-hover",
      )}>
      <CardBase {...props} />
    </div>
  );
};

export default CardConversation;
