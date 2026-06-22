"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import {
  _linkResolver,
  _localizeField,
  _localizeText,
} from "../sanity-api/utils";
import { SETTINGS_QUERY_RESULT } from "../sanity-api/types/sanity.types";
import LogoFHCB from "./LogoFHCB";
import { PortableText } from "@portabletext/react";
import website from "../config/website";
import Image from "next/image";

type Props = {
  settings: SETTINGS_QUERY_RESULT;
};

const Footer = ({ settings }: Props) => {
  const [logoTypeWidth, setLogoTypeWidth] = React.useState(0);
  const _onResize = () => {
    const logoType = document.querySelector(".logo-type");
    const logoTypeBounding = logoType?.getBoundingClientRect();
    const logoLetters = document.querySelector(".logo-letters");
    const logoLettersBounding = logoLetters?.getBoundingClientRect();
    if (logoLettersBounding && logoTypeBounding) {
      setLogoTypeWidth(logoLettersBounding.left - logoTypeBounding.left || 0);
    }
  };
  useEffect(() => {
    _onResize();
    window.addEventListener("resize", _onResize);
    return () => {
      window.removeEventListener("resize", _onResize);
    };
  }, []);

  if (!settings) return null;

  return (
    <footer className='footer'>
      <div className='container-fluid'>
        <div className='footer__inner'>
          <div className='footer__logo'>
            <Link href='/'>
              <LogoFHCB type='long' />
            </Link>
          </div>
          <div className='navs'></div>
          <div className='flex gap-gutter- items-baseline-'>
            <address
              className='c-h2-'
              style={{
                width: `${logoTypeWidth}px`,
              }}>
              <div className='text'>
                <PortableText
                  value={_localizeField(settings.adressAndOpeningHours)}
                />
              </div>
            </address>
            {settings?.navSecondary && (
              <nav className='footer__nav'>
                <div className='grid md:grid-cols-3 gap-gutter'>
                  <ul className='md:col-span-3 grid md:grid-cols-3 gap-gutter'>
                    {settings.navSecondary.map((item: any) => {
                      return (
                        <li key={item._key}>
                          <h5 className='title c-h2'>
                            {_localizeField(item.label)}
                          </h5>
                          <ul className='sub-menu'>
                            {item.subMenu?.map((subItem: any) => (
                              <li key={subItem._key}>
                                <Link href={_linkResolver(subItem.link)}>
                                  {_localizeField(subItem.label)}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      );
                    })}
                    <li>
                      <h5 className='c-h2'>{_localizeText("contactTeam")}</h5>
                      {settings.navTertiary && (
                        <ul>
                          {settings.navTertiary?.map((item: any) => (
                            <li key={item._key}>
                              <Link href={_linkResolver(item.link)}>
                                {_localizeField(item.label)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  </ul>
                  <div className='credits-n-legals md:col-span-2'>
                    © {new Date().getFullYear()} {website.title}{" "}
                    {_localizeText("allRightsReserved")}
                    {"  "}
                    {settings.navLegals
                      ?.map((item: any) => (
                        <Link key={item._key} href={_linkResolver(item.link)}>
                          {_localizeField(item.label)}
                        </Link>
                      ))
                      .reduce(
                        (acc: any, curr: any) => [...acc, curr, ",  "],
                        [],
                      )
                      .slice(0, -1)}
                  </div>
                  <ul className='nav-actions flex gap-2xs items-center'>
                    <li>
                      <button className='btn btn--accent'>Nous soutenir</button>
                    </li>
                    <li>
                      <button className='btn btn--accent'>Newsletter</button>
                    </li>
                    {settings.navSocial?.map((item) => (
                      <li key={item.label}>
                        <Link href={_linkResolver(item.link)}>
                          {item.icon?.asset?.url && (
                            <Image
                              src={item.icon.asset.url}
                              width={28}
                              height={28}
                              alt={item.label || ""}
                            />
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
