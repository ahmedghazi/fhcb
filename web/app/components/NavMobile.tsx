import React, { useEffect, useState } from "react";
import {
  LinkExternal,
  LinkInternal,
  SETTINGS_QUERY_RESULT,
} from "../sanity-api/types/sanity.types";
import clsx from "clsx";
import { _linkResolver, _localizeField } from "../sanity-api/utils";
import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";

type NavGroupProps = {
  input: LinkInternal | LinkExternal;
  isOpen: boolean;
  onToggle: () => void;
};
const NavGroup = ({ input, isOpen, onToggle }: NavGroupProps) => {
  const hasSubmenu = input._type === "linkInternal" && input.subMenu;

  return (
    <li className={clsx(hasSubmenu && "has-submenu")}>
      <NavItem
        item={input}
        withSubMenu={
          input._type === "linkInternal" &&
          input.subMenu &&
          input.subMenu?.length > 0
        }
        active={isOpen}
        onToggle={onToggle}
      />

      {hasSubmenu && (
        <ul className='sub-menu'>
          {input.subMenu?.map((subItem, i) => (
            <li key={i}>
              <NavItem item={subItem} />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

type NavItemProps = {
  item: LinkInternal | LinkExternal;
  withSubMenu?: boolean;
  active?: boolean;
  onToggle?: () => void;
};
const NavItem = ({ item, withSubMenu, active, onToggle }: NavItemProps) => {
  if (item._type === "linkInternal") {
    if (withSubMenu) {
      return (
        <div
          onTouchStart={onToggle}
          className={clsx("menu-label", active && "is-active")}>
          {_localizeField(item.label)}
        </div>
      );
    }
    return (
      <Link href={_linkResolver(item.link)}>
        <div className='menu-label'>{_localizeField(item.label)}</div>
      </Link>
    );
  }
  if (item._type === "linkExternal") {
    return (
      <a href={item.link} target='_blank' rel='noopener noreferrer'>
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

const NavMobile = ({ navPrimary, settings }: Props) => {
  const pathname = usePathname();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    setOpenIndex(null);
  }, [pathname]);

  const menuStyle: React.CSSProperties = {
    "--nav-len": navPrimary?.length,
  } as React.CSSProperties;

  return (
    <nav>
      <ul className='menu' style={menuStyle}>
        {navPrimary?.map((item, i) => (
          <NavGroup
            key={i}
            input={item}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}

        {settings?.btnLibrary && (
          <li className='flex sm-only'>
            <Link href={_linkResolver(settings.btnLibrary.link)}>
              <div className='menu-label'>
                {_localizeField(settings.btnLibrary.label)}
              </div>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavMobile;
