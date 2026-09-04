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
import { useConsent } from "react-hook-consent";
import BtnCtaExternal from "./ui/btns/BtnCtaExternal";

type Props = {
  settings: SETTINGS_QUERY_RESULT;
};

const Footer = ({ settings }: Props) => {
  const [logoTypeWidth, setLogoTypeWidth] = React.useState(0);
  const { toggleDetails } = useConsent();
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
            <Link href='/' title={website.title}>
              <LogoFHCB type='long' />
            </Link>
          </div>
          <div className='navs'></div>
          <div className='flex flex-col md:flex-row gap-gutter'>
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
                <div className='grid md:grid-cols-3 gap-sm md:gap-gutter mb-md'>
                  <ul className='md:col-span-3 grid md:grid-cols-3 gap-gutter'>
                    {settings.navSecondary.map((item: any) => {
                      return (
                        <li key={item._key}>
                          <h4 className='title c-h2'>
                            {_localizeField(item.label)}
                          </h4>
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
                  </ul>
                </div>
                <div className='grid md:grid-cols-3 gap-sm md:gap-gutter items-baseline'>
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
                    // .slice(0, -1)
                    }
                    <button
                      type='button'
                      className='footer__cookie-settings'
                      onClick={toggleDetails}>
                      {_localizeText("manageCookies")}
                    </button>
                  </div>
                  <ul className='nav-actions flex gap-2xs items-center'>
                    {settings.urlSupport && (
                      <li>
                        <BtnCtaExternal
                          input={settings.urlSupport}
                          accent
                        />
                      </li>
                    )}
                    {settings.urlNewsletter && (
                      <li>
                        <BtnCtaExternal
                          input={settings.urlNewsletter}
                          accent
                        />
                      </li>
                    )}

                    {settings.navSocial?.map((item) => (
                      <li key={item.label}>
                        {/* <pre>{JSON.stringify(item, null, 2)}</pre> */}
                        <a
                          target='_blank'
                          rel='noopener noreferrer'
                          href={item.link}>
                          {item.icon?.asset?.url && (
                            <Image
                              src={item.icon.asset.url}
                              width={28}
                              height={28}
                              alt={item.label || ""}
                            />
                          )}
                        </a>
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
