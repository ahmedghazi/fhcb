"use client";
import React from "react";
import Link from "next/link";
import { Settings } from "../types/extra-types";
import { _linkResolver } from "../sanity-api/utils";

type Props = {
  settings: Settings;
};

const Footer = ({ settings }: Props) => {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <Link href="/">Fondation Henri Cartier-Bresson</Link>
        </div>

        {settings?.navSecondary && (
          <nav className="footer__nav">
            {settings.navSecondary.map((item: any) => {
              const href =
                item._type === "linkInternal"
                  ? _linkResolver(item.link)
                  : item.href || "#";
              return (
                <Link key={item._key} href={href}>
                  {item.title?.fr || item.title || item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </footer>
  );
};

export default Footer;
