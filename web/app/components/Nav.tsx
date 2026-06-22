import React, { CSSProperties, useEffect } from "react";
import {
  LinkExternal,
  LinkInternal,
  Settings,
  SETTINGS_QUERY_RESULT,
} from "../sanity-api/types/sanity.types";
import clsx from "clsx";
import Link from "next/link";
import { _linkResolver, _localizeField } from "../sanity-api/utils";
import useHeader, { NavMenuItem } from "../context/HeaderContext";
import { usePathname } from "next/navigation";
import LogoFHCB from "./LogoFHCB";
import { _collectFirstImagesFromNavItem } from "../lib/utils";
import BtnCart from "./ui/btns/BtnCart";

type NavItemProps = {
  item: LinkInternal | LinkExternal;
  withSubMenu?: boolean;
};
const NavItem = ({ item, withSubMenu }: NavItemProps) => {
  // const { dispatchCurrentMenuItem } = useHeader();

  if (item._type === "linkInternal") {
    if (withSubMenu) {
      return <div className='menu-label'>{_localizeField(item.label)}</div>;
    } else {
      return (
        <Link href={_linkResolver(item.link)}>
          <div className='menu-label'>{_localizeField(item.label)}</div>
        </Link>
      );
    }
  }
  if (item._type === "linkExternal") {
    return (
      <a
        href={item.link}
        target='_blank'
        rel='noopener noreferrer'
        className=''>
        <div className='menu-label'>{_localizeField(item.label)}</div>
      </a>
    );
  }
};

type Props = {
  navPrimary?: Array<
    | ({
        _key: string;
      } & LinkInternal)
    | ({
        _key: string;
      } & LinkExternal)
  >;
  settings?: SETTINGS_QUERY_RESULT;
};

const Nav = ({ navPrimary, settings }: Props) => {
  const {
    dispatchCurrentMenuItem,

    dispatchCurrentMenuMessage,
    modalType,
    dispatchModalType,
  } = useHeader();
  const pathname = usePathname();
  useEffect(() => {
    dispatchCurrentMenuItem(null);
    dispatchModalType(null);
  }, [pathname]);

  const menuStyle: React.CSSProperties = {
    "--nav-len": navPrimary?.length,
  } as React.CSSProperties;
  // console.log(navPrimary);
  return (
    <nav
      className={clsx(modalType != null && "is-open")}
      onMouseLeave={() => {
        dispatchCurrentMenuItem(null);
        dispatchModalType(null);
      }}>
      <ul className='menu' style={menuStyle}>
        {navPrimary?.map((item, i) => (
          <li
            key={i}
            className={clsx(
              item._type === "linkInternal" && item.subMenu && "has-submenu",
            )}
            onMouseLeave={() => {
              // dispatchCurrentMenuItem(null);
            }}
            onMouseEnter={() => {
              dispatchCurrentMenuMessage(null);
              if (item._type === "linkInternal" && item.withMessage) {
                dispatchCurrentMenuMessage(item.navMessage || null);
              }

              if (item._type === "linkInternal" && item.link) {
                const link = item.link as any;
                const images = _collectFirstImagesFromNavItem(link);

                dispatchCurrentMenuItem({ ...link, images } as NavMenuItem);
              } else {
                dispatchModalType("menu");
              }
            }}>
            <NavItem
              item={item}
              withSubMenu={
                item._type === "linkInternal" &&
                item.subMenu &&
                item.subMenu?.length > 0
              }
            />

            {item._type === "linkInternal" && item.subMenu && (
              <ul
                className='sub-menu'
                onMouseLeave={() => {
                  // dispatchCurrentMenuItem(null);
                  // dispatchModalType(null);
                }}>
                {item.subMenu.map((subItem, i) => (
                  <li
                    key={i}
                    className=''
                    onMouseEnter={() => {
                      if (subItem._type === "linkInternal" && subItem.link) {
                        const link = subItem.link as any;
                        const images = _collectFirstImagesFromNavItem(link);

                        dispatchCurrentMenuItem({
                          ...link,
                          images,
                        } as NavMenuItem);
                      }
                    }}>
                    <NavItem item={subItem} />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}

        {settings?.btnLibrary && (
          <li className='flex sm-only'>
            <Link
              href={_linkResolver(settings.btnLibrary.link)}
              className='btn-library'>
              {_localizeField(settings.btnLibrary.label)}
            </Link>

            <BtnCart />
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
