import React from "react";
import { SETTINGS_QUERY_RESULT } from "../sanity-api/types/sanity.types";
import Link from "next/link";
import LogoFHCB from "./LogoFHCB";
import Nav from "./Nav";
import LocalesSwitcher from "./ui/LocaleSwitcher";
import SearchToggle from "./ui/SearchToggle";
import { _linkResolver, _localizeField } from "../sanity-api/utils";
import BtnCart from "./shop/BtnCart";
import website from "../config/website";

type Props = {
  settings: SETTINGS_QUERY_RESULT;
};

const HeaderDesktop = ({ settings }: Props) => {
  return (
    <div className='header--desktop'>
      {settings && (
        <div className='header__inner'>
          <div className='header__logo'>
            <Link href='/' title={website.title}>
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
      )}
    </div>
  );
};

export default HeaderDesktop;
