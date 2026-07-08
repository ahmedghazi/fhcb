import {
  LinkExternal,
  LinkInternal,
} from "@/app/sanity-api/types/sanity.types";
import { _linkResolver, _localizeField } from "@/app/sanity-api/utils";
import Link from "next/link";
import React from "react";

type Props = {
  input: LinkExternal;
};

const BtnCtaExternal = ({ input }: Props) => {
  return (
    <a className='btn' target='_blank' rel='' href={input.link}>
      {_localizeField(input.label)}
    </a>
  );
};

export default BtnCtaExternal;
