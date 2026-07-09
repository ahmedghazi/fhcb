"use client";
import { SETTINGS_QUERY_RESULT } from "@/app/sanity-api/types/sanity.types";
import {
  _linkResolver,
  _localizeField,
  _localizeText,
} from "@/app/sanity-api/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import BtnCta from "./btns/BtnCta";
import BtnCtaExternal from "./btns/BtnCtaExternal";

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

  useEffect(() => {
    document.body.classList.toggle("has-bandeau", open);
  }, [open]);

  const localizedText = _localizeField(text);
  const localizedClose = _localizeText("closeBanner");

  return !open ? null : (
    <div className='bandeau-contextuel'>
      <div className='container-fluid'>
        <p className='c-body-sm'>{localizedText}</p>

        <div className='footer'>
          {cta?.internal && <BtnCta input={cta.internal as unknown as any} />}

          {cta?.external && (
            <BtnCtaExternal input={cta.external as unknown as any} />
          )}
          <button className='underline' onClick={() => setOpen(false)}>
            {localizedClose}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BandeauContextuel;
