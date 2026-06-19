"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  _linkResolver,
  _localizeField,
  _localizeText,
} from "../sanity-api/utils";
import useLocale from "../context/LocaleContext";
import LogoFHCB from "./LogoFHCB";
import { SETTINGS_QUERY_RESULT } from "../sanity-api/types/sanity.types";
import Nav from "./Nav";
import LocalesSwitcher from "./ui/LocaleSwitcher";
import SearchToggle from "./ui/SearchToggle";
import NavModal from "./NavModal";
import useHeader from "../context/HeaderContext";
import useCart from "../context/CartContext";
import clsx from "clsx";
import BtnCart from "./ui/btns/BtnCart";

type Props = {
  settings: SETTINGS_QUERY_RESULT;
};

const Header = ({ settings }: Props) => {
  const { modalType, dispatchModalType } = useHeader();
  // const { cartCount, toggleCart } = useCart();

  if (!settings) return null;

  return (
    <header
      className={clsx("header", modalType && "is-modal-open")}
      // onMouseEnter={() => dispatchModalType("base")}
      // onMouseLeave={() => dispatchModalType(null)}
    >
      <NavModal settings={settings} />
      <div className='container-fluid'>
        <div className='header__inner'>
          <div className='header__logo'>
            <Link href='/'>
              <LogoFHCB type='default' />
            </Link>
          </div>

          <Nav navPrimary={(settings.navPrimary ?? undefined) as any} />
          <div className='header__meta-nav'>
            <LocalesSwitcher />
            <SearchToggle />

            <ul className='meta-nav'>
              {settings.btnLibrary && (
                <li className='flex'>
                  <Link
                    href={_linkResolver(settings.btnLibrary.link)}
                    className='btn-library'>
                    {_localizeField(settings.btnLibrary.label)}
                  </Link>

                  <BtnCart />
                </li>
              )}
              {settings.btnTickets && (
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
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
