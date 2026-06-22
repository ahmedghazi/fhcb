"use client";
import { SETTINGS_QUERY_RESULT } from "@/app/sanity-api/types/sanity.types";
import {
  _linkResolver,
  _localizeField,
  _localizeText,
} from "@/app/sanity-api/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Props = NonNullable<
  NonNullable<SETTINGS_QUERY_RESULT>["bandeauContextuel"]
>;

const BandeauContextuel = ({ text, cta, dateExpiration }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    if (!dateExpiration) return;
    const endDate = new Date(dateExpiration);
    const now = new Date();
    setOpen(now < endDate);
  }, []);

  return !open ? null : (
    <div className='bandeau-contextuel'>
      <div className='container-fluid'>
        <p className='c-body-sm'>{_localizeField(text)}</p>

        <div className='footer'>
          {cta?.internal && (
            <Link href={_linkResolver(cta.internal.link)}>
              {_localizeField(cta.internal.label)}
            </Link>
          )}

          {cta?.external && (
            <a className='btn' target='_blank' rel='' href={cta.external.link}>
              {_localizeField(cta.external.label)}
            </a>
          )}
          <button className='underline' onClick={() => setOpen(false)}>
            {_localizeText("closeBanner")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BandeauContextuel;
