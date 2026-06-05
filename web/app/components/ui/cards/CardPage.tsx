import clsx from "clsx";
import { PageModulaireExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { pageModulaireToCard } from "./adapters";
import CardBase from "./CardBase";

type Props = {
  input: PageModulaireExpanded;
  size?: "sm" | "md" | "lg";
};

const CardPage = ({ input, size = "md" }: Props) => {
  const props = pageModulaireToCard(input);
  return (
    <div className={clsx("card card--page", `card--${size}`)}>
      <CardBase {...props} />
    </div>
  );
};

export default CardPage;
