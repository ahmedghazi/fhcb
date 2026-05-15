import React from "react";
import {
  LinkExternal,
  LinkInternal,
  Settings,
} from "../sanity-api/types/sanity.types";
import clsx from "clsx";
import Link from "next/link";
import { _linkResolver, _localizeField } from "../sanity-api/utils";
import useHeader from "../context/HeaderContext";

const NavItem = ({ item }: { item: LinkInternal | LinkExternal }) => {
  const { dispatchCurrentMenuItem } = useHeader();

  if (item._type === "linkInternal") {
    return (
      <Link
        href={_linkResolver(item.link)}
        className=''
        onMouseLeave={() => dispatchCurrentMenuItem(null)}
        onMouseEnter={() => dispatchCurrentMenuItem(item.link)}>
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
        <div className=''>{item.label}</div>
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
  return (
    <nav>
      <ul className='menu'>
        {navPrimary?.map((item, i) => (
          <li
            key={i}
            className={clsx(
              item._type === "linkInternal" && item.subMenu && "has-submenu",
            )}>
            <NavItem item={item} />

            {item._type === "linkInternal" && item.subMenu && (
              <ul className='sub-menu'>
                {item.subMenu.map((subItem, i) => (
                  <li key={i} className=''>
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
