"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { _linkResolver, _localizeField } from "../sanity-api/utils";
import useLocale from "../context/LocaleContext";
import LogoFHCB from "./LogoFHCB";
import { SETTINGS_QUERY_RESULT } from "../sanity-api/types/sanity.types";
import Nav from "./Nav";
import LocalesSwitcher from "./ui/LocaleSwitcher";
import SearchToggle from "./ui/SearchToggle";
import NavModal from "./NavModal";
import useHeader from "../context/HeaderContext";
import clsx from "clsx";

type Props = {
  settings: SETTINGS_QUERY_RESULT;
};

const Header = ({ settings }: Props) => {
  const { modalType } = useHeader();

  if (!settings) return null;

  return (
    <header className={clsx("header", modalType && "is-modal-open")}>
      <NavModal settings={settings} />
      <div className='header__inner'>
        <div className='header__logo'>
          <Link href='/'>
            <LogoFHCB type='default' />
          </Link>
        </div>

        <Nav navPrimary={(settings.navPrimary ?? undefined) as any} />
        <div className='header__meta-nav'>
          <SearchToggle />
          <LocalesSwitcher />
          <ul className='meta-nav'>
            {settings.btnLibrary && (
              <li>
                <Link
                  href={_linkResolver(settings.btnLibrary.link)}
                  className='btn-library'>
                  {_localizeField(settings.btnLibrary.label)}
                </Link>
              </li>
            )}
            {settings.btnTickets && (
              <li>
                <a
                  target='_blank'
                  rel='noopener noreferrer'
                  href={settings.btnTickets.link}
                  className='btn-tickets'>
                  {settings.btnTickets.label}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
