"use client";
import React, { useEffect, useState } from "react";
import { SETTINGS_QUERY_RESULT } from "../sanity-api/types/sanity.types";
import { _localizeField, _localizeText } from "../sanity-api/utils";
import LocalesSwitcher from "./ui/LocaleSwitcher";
import SearchToggle from "./ui/SearchToggle";
import Nav from "./Nav";
import Link from "next/link";
import LogoFHCB from "./LogoFHCB";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import Icon from "./ui/Icon";

type Props = {
  settings: SETTINGS_QUERY_RESULT;
};

const HeaderMobile = ({ settings }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
  }, [open]);

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
              {open ? _localizeText("close") : "MENU"}
            </button>
          </li>
        </ul>
      </div>
      <div className={clsx("header__modal", open && "header__modal--open")}>
        <div className='scroll-y'>
          <div className='header__modal-content'>
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
              <button onClick={() => setOpen(false)}>
                <Icon name='close' />
              </button>
            </div>
            <div className='header__group'>
              {settings?.navPrimary && (
                <Nav
                  navPrimary={(settings.navPrimary ?? undefined) as any}
                  settings={settings}
                />
              )}
            </div>
            <div className='header__group'>
              <div className='flex justify-between'>
                <SearchToggle />
                <LocalesSwitcher />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderMobile;
