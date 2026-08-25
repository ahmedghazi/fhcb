import React, { CSSProperties, useEffect, useState } from "react";
import {
  LinkExternal,
  LinkInternal,
  SETTINGS_QUERY_RESULT,
} from "../sanity-api/types/sanity.types";
import clsx from "clsx";
// import Link from "next/link";
import { _linkResolver, _localizeField } from "../sanity-api/utils";
import useHeader, { NavMenuItem } from "../context/HeaderContext";
import { usePathname } from "next/navigation";
import { _collectFirstImagesFromNavItem } from "../lib/utils";
import useDeviceDetect from "../hooks/useDeviceDetect";
import { Link } from "next-view-transitions";

type NavGroupProps = {
  input: LinkInternal | LinkExternal;
};
const NavGroup = ({ input }: NavGroupProps) => {
  const {
    dispatchCurrentMenuMessage,
    dispatchCurrentMenuItem,
    dispatchModalType,
    currentMenuItem,
  } = useHeader();
  const { isMobile } = useDeviceDetect();
  const hasSubmenu = input._type === "linkInternal" && input.subMenu;
  const displaySubMenuImages =
    input._type === "linkInternal" && input.withSubmenuImages;

  const _onMouseEnter = () => {
    if (isMobile) return;
    dispatchCurrentMenuMessage(null);

    if (input._type !== "linkInternal") {
      dispatchModalType("menu");
      return;
    }

    if (input.withMessage) {
      dispatchCurrentMenuMessage(input.navMessage || null);
    }

    if (input.imageCover) {
      dispatchCurrentMenuItem({
        ...input,
        images: [input.imageCover],
      } as NavMenuItem);
    } else {
      dispatchModalType("menu");
    }
  };

  return (
    <li
      className={clsx(hasSubmenu && "has-submenu")}
      onMouseLeave={() => {
        // if (currentMenuItem) return;
        // dispatchCurrentMenuItem(null);
        // dispatchCurrentMenuMessage(null);
        // dispatchModalType("menu");
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
            <li
              key={i}
              className=''
              onMouseEnter={() => {
                if (isMobile) return;
                if (displaySubMenuImages && subItem._type === "linkInternal") {
                  const images = subItem.imageCover
                    ? [subItem.imageCover]
                    : _collectFirstImagesFromNavItem(subItem.link as any);
                  if (images.length > 0) {
                    dispatchCurrentMenuItem({
                      ...subItem,
                      images,
                    } as NavMenuItem);
                  }
                }
              }}>
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
        // return;

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
