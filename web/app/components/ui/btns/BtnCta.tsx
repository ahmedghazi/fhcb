import { LinkInternal } from "@/app/sanity-api/types/sanity.types";
import { _linkResolver, _localizeField } from "@/app/sanity-api/utils";
import Link from "next/link";
import React from "react";

type Props = {
  input: LinkInternal;
};

const BtnCta = ({ input }: Props) => {
  return (
    <Link className='btn' href={_linkResolver(input.link)}>
      {_localizeField(input.label)}
    </Link>
  );
};

export default BtnCta;
