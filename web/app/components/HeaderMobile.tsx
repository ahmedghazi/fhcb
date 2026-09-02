"use client";
import React, { useEffect, useState } from "react";
import { SETTINGS_QUERY_RESULT } from "../sanity-api/types/sanity.types";
import { _localizeField, _localizeText } from "../sanity-api/utils";
import LocalesSwitcher from "./ui/LocaleSwitcher";
import SearchToggle from "./ui/SearchToggle";
import NavMobile from "./NavMobile";
import Link from "next/link";
import LogoFHCB from "./LogoFHCB";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import Icon from "./ui/Icon";
import website from "../config/website";

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

  const closeLabel = _localizeText("close");
  const ticketsLabel = _localizeField(settings?.btnTickets?.label);

  return (
    <div className='header--mobile'>
      <div className='header__inner'>
        <div className='header__logo'>
          <Link href='/' title={website.title}>
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
                {ticketsLabel}
              </a>
            </li>
          )}
          <li className='flex '>
            <button
              className='btn btn--menu-toggle'
              onClick={() => setOpen(!open)}>
              {open ? closeLabel : "MENU"}
            </button>
          </li>
        </ul>
      </div>
      <div className={clsx("header__modal", open && "header__modal--open")}>
        <div className='scroll-y'>
          <div className='header__modal-content'>
            <div className='header__group'>
              {settings?.navPrimary && (
                <NavMobile
                  navPrimary={(settings.navPrimary ?? undefined) as any}
                  settings={settings}
                />
              )}
            </div>
            <div className='header__group text-xl'>
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
