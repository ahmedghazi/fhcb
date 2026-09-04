import {
  LinkExternal,
  LinkInternal,
} from "@/app/sanity-api/types/sanity.types";
import { _linkResolver, _localizeField } from "@/app/sanity-api/utils";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

type Props = {
  input: LinkExternal;
  accent?: boolean;
  className?: string;
};

const BtnCtaExternal = ({ input, accent = false, className = "" }: Props) => {
  return (
    <a
      className={clsx(`btn`, accent ? " btn--accent" : "", className)}
      target='_blank'
      rel='noopener noreferrer'
      href={input.link}>
      {_localizeField(input.label)}
    </a>
  );
};

export default BtnCtaExternal;
