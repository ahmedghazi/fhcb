import React, { CSSProperties, useEffect, useState } from "react";
import {
  LinkExternal,
  LinkInternal,
  SETTINGS_QUERY_RESULT,
} from "../sanity-api/types/sanity.types";
import clsx from "clsx";
import Link from "next/link";
import { _linkResolver, _localizeField } from "../sanity-api/utils";
import useHeader, { NavMenuItem } from "../context/HeaderContext";
import { usePathname } from "next/navigation";
import { _collectFirstImagesFromNavItem } from "../lib/utils";
import useDeviceDetect from "../hooks/useDeviceDetect";

type NavGroupProps = {
  input: LinkInternal | LinkExternal;
};
const NavGroup = ({ input }: NavGroupProps) => {
  console.log(input);
  const {
    dispatchCurrentMenuMessage,
    dispatchCurrentMenuItem,
    dispatchModalType,
    currentMenuItem,
  } = useHeader();
  const { isMobile } = useDeviceDetect();
  const hasSubmenu = input._type === "linkInternal" && input.subMenu;

  const _onMouseEnter = () => {
    if (isMobile) return;
    dispatchCurrentMenuMessage(null);
    if (input._type === "linkInternal" && input.withMessage) {
      dispatchCurrentMenuMessage(input.navMessage || null);
    }

    if (input._type === "linkInternal" && input.imageCover) {
      dispatchCurrentMenuItem({
        ...input,
        images: [input.imageCover],
      } as NavMenuItem);
    }
    // if (input._type === "linkInternal" && input.link) {
    //   const link = input.link as any;
    //   const images = _collectFirstImagesFromNavItem(link);

    //   dispatchCurrentMenuItem({ ...link, images } as NavMenuItem);
    // }
    else {
      dispatchModalType("menu");
    }
  };

  return (
    <li
      className={clsx(hasSubmenu && "has-submenu")}
      onMouseLeave={() => {
        if (currentMenuItem) return;
        dispatchCurrentMenuItem(null);
      }}
      onMouseEnter={() => {
        _onMouseEnter();
      }}>
      <NavItem
        item={input}
        withSubMenu={
          input._type === "linkInternal" &&
          input.subMenu &&
          input.subMenu?.length > 0
        }
      />

      {hasSubmenu && (
        <ul
          className='sub-menu'
          onMouseLeave={() => {
            // dispatchCurrentMenuItem(null);
            // dispatchModalType(null);
          }}>
          {input.subMenu?.map((subItem, i) => (
            <li key={i} className=''>
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
};
const NavItem = ({ item, withSubMenu }: NavItemProps) => {
  // const { dispatchCurrentMenuItem } = useHeader();
  const { isMobile } = useDeviceDetect();
  const pathname = usePathname();
  const [active, setActive] = useState<boolean>(false);

  useEffect(() => {
    setActive(false);
  }, [pathname]);

  const _onTouchStart = () => {
    if (!isMobile) return;
    setActive(!active);
  };
  if (item._type === "linkInternal") {
    if (withSubMenu) {
      return (
        <div
          onTouchStart={_onTouchStart}
          className={clsx("menu-label", active && "is-active")}>
          {_localizeField(item.label)}
        </div>
      );
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

  return (
    <nav
      className={clsx(modalType != null && "is-open")}
      onMouseLeave={() => {
        dispatchCurrentMenuItem(null);
        dispatchModalType(null);
      }}>
      <ul className='menu' style={menuStyle}>
        {navPrimary?.map((item, i) => (
          <NavGroup key={i} input={item} />
        ))}

        {settings?.btnLibrary && (
          <li className='flex sm-only'>
            <Link href={_linkResolver(settings.btnLibrary.link)}>
              <div className='menu-label'>
                {_localizeField(settings.btnLibrary.label)}
              </div>
            </Link>

            {/* <BtnCart /> */}
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
