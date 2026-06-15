import React, { useEffect } from "react";
import {
  LinkExternal,
  LinkInternal,
  Settings,
} from "../sanity-api/types/sanity.types";
import clsx from "clsx";
import Link from "next/link";
import { _linkResolver, _localizeField } from "../sanity-api/utils";
import useHeader, { NavMenuItem } from "../context/HeaderContext";
import { usePathname } from "next/navigation";

const NavItem = ({ item }: { item: LinkInternal | LinkExternal }) => {
  const { dispatchCurrentMenuItem } = useHeader();

  if (item._type === "linkInternal") {
    return (
      <Link href={_linkResolver(item.link)}>
        <div className=''>{_localizeField(item.label)}</div>
      </Link>
    );
  }
  if (item._type === "linkExternal") {
    return (
      <a
        href={item.link}
        target='_blank'
        rel='noopener noreferrer'
        className=''>
        <div className=''>{_localizeField(item.label)}</div>
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
};

const Nav = ({ navPrimary }: Props) => {
  const { dispatchCurrentMenuItem, modalType, dispatchModalType } = useHeader();
  const pathname = usePathname();
  useEffect(() => {
    dispatchCurrentMenuItem(null);
    dispatchModalType(null);
  }, [pathname]);

  return (
    <nav className={clsx(modalType != null && "is-open")}>
      <ul className='menu'>
        {navPrimary?.map((item, i) => (
          <li
            key={i}
            className={clsx(
              item._type === "linkInternal" && item.subMenu && "has-submenu",
            )}
            onMouseLeave={() => dispatchCurrentMenuItem(null)}
            onMouseEnter={() => {
              if (item._type === "linkInternal" && item.link) {
                dispatchCurrentMenuItem(item.link as unknown as NavMenuItem);
              } else {
                dispatchModalType("menu");
              }
            }}>
            <NavItem item={item} />

            {item._type === "linkInternal" && item.subMenu && (
              <ul
                className='sub-menu'
                onMouseLeave={() => {
                  dispatchCurrentMenuItem(null);
                  dispatchModalType(null);
                }}>
                {item.subMenu.map((subItem, i) => (
                  <li
                    key={i}
                    className=''
                    onMouseEnter={() => {
                      if (subItem._type === "linkInternal" && subItem.link) {
                        dispatchCurrentMenuItem(
                          subItem.link as unknown as NavMenuItem,
                        );
                      }
                    }}>
                    <NavItem item={subItem} />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
