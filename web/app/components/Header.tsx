"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { _linkResolver, _localizeField } from "../sanity-api/utils";
import useLocale from "../context/LocaleContext";
import LogoFHCB from "./LogoFHCB";
import { Settings } from "../sanity-api/types/sanity.types";
import Nav from "./Nav";
import LocalesSwitcher from "./ui/LocaleSwitcher";
import Search from "./ui/Search";
import NavModal from "./NavModal";
import useHeader from "../context/HeaderContext";

type Props = {
  settings: Settings;
};

const Header = ({ settings }: Props) => {
  const pathname = usePathname();
  const { modalType } = useHeader();

  return (
    <header className='header'>
      {modalType && <NavModal settings={settings} />}
      <div className='header__inner'>
        <div className='header__logo'>
          <Link href='/'>
            <LogoFHCB type='default' />
          </Link>
        </div>

        <Nav navPrimary={settings.navPrimary} />
        <div className='header__meta-nav'>
          <Search settings={settings} />
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
