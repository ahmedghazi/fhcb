import {
  LinkExternal,
  LinkInternal,
} from "@/app/sanity-api/types/sanity.types";
import { _linkResolver, _localizeField } from "@/app/sanity-api/utils";
import clsx from "clsx";
import Link from "next/link";
import React from "react";
import Icon from "../Icon";

type Props = {
  input: LinkExternal;
  accent?: boolean;
  className?: string;
};

const BtnCtaExternal = ({ input, accent = false, className = "" }: Props) => {
  const localizedTitle = _localizeField(input.label);
  const isDl = /télécharger|download/i.test(localizedTitle);
  return (
    <a
      className={clsx(
        `btn`,
        accent && "btn--accent",
        isDl && "btn--with-icon",
        className,
      )}
      target='_blank'
      rel='noopener noreferrer'
      href={input.link}>
      <span>{localizedTitle}</span>
      {isDl && <Icon name='dl' />}
    </a>
  );
};

export default BtnCtaExternal;
