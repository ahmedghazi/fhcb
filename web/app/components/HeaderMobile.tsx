"use client";
import React, { useState } from "react";
import { SETTINGS_QUERY_RESULT } from "../sanity-api/types/sanity.types";
import { _localizeField } from "../sanity-api/utils";
import LocalesSwitcher from "./ui/LocaleSwitcher";
import SearchToggle from "./ui/SearchToggle";
import Nav from "./Nav";
import Link from "next/link";
import LogoFHCB from "./LogoFHCB";
import clsx from "clsx";

type Props = {
  settings: SETTINGS_QUERY_RESULT;
};

const HeaderMobile = ({ settings }: Props) => {
  const [open, setOpen] = useState<boolean>(true);
  return (
    <div className='header--mobile'>
      <div className='header__inner'>
        <div className='header__logo'>
          <Link href='/'>
            <LogoFHCB type='default' />
          </Link>
        </div>
        <ul className='flex'>
          {settings?.btnTickets && (
            <li>
              <a
                target='_blank'
                rel='noopener noreferrer'
                href={settings.btnTickets.link}
                className='btn-tickets'>
                {_localizeField(settings.btnTickets.label)}
              </a>
            </li>
          )}
          <li className='flex '>
            <button
              className='btn btn--menu-toggle'
              onClick={() => setOpen(!open)}>
              {open ? "CLOSE" : "MENU"}
            </button>
          </li>
        </ul>
      </div>
      <div className={clsx("header__modal", open && "header__modal--open")}>
        <div className='header__modal__content'>
          <div className='header__group'>
            {settings?.btnTickets && (
              <a
                target='_blank'
                rel='noopener noreferrer'
                href={settings.btnTickets.link}
                className='btn-tickets'>
                {_localizeField(settings.btnTickets.label)}
              </a>
            )}
          </div>
          <div className='header__group'>
            {settings?.navPrimary && (
              <Nav navPrimary={(settings.navPrimary ?? undefined) as any} />
            )}
          </div>
          <div className='header__group'>
            <LocalesSwitcher />
            <SearchToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderMobile;
