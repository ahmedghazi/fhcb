import React from "react";
import { LinkExternal, LinkInternal } from "../sanity-api/types/sanity.types";
import clsx from "clsx";
import { _linkResolver, _localizeField } from "../sanity-api/utils";
import useHeader, { NavMenuItem } from "../context/HeaderContext";
import { _collectFirstImagesFromNavItem } from "../lib/utils";
import { Link } from "next-view-transitions";

type NavGroupProps = {
  input: LinkInternal | LinkExternal;
};
const NavGroup = ({ input }: NavGroupProps) => {
  const { dispatchCurrentMenuMessage, dispatchCurrentMenuItem, dispatchModalType } =
    useHeader();
  const hasSubmenu = input._type === "linkInternal" && input.subMenu;
  const displaySubMenuImages =
    input._type === "linkInternal" && input.withSubmenuImages;

  const _onMouseEnter = () => {
    dispatchCurrentMenuMessage(null);
    dispatchCurrentMenuItem(null);

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
    }
    if (!input.withMessage && !input.imageCover) {
      dispatchCurrentMenuItem(input as NavMenuItem);
      dispatchModalType("menu");
    }
  };

  return (
    <li className={clsx(hasSubmenu && "has-submenu")} onMouseEnter={_onMouseEnter}>
      <NavItem
        item={input}
        withSubMenu={
          input._type === "linkInternal" &&
          input.subMenu &&
          input.subMenu?.length > 0
        }
      />

      {hasSubmenu && (
        <ul className='sub-menu'>
          {input.subMenu?.map((subItem, i) => (
            <li
              key={i}
              onMouseEnter={() => {
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
  if (item._type === "linkInternal") {
    if (withSubMenu) {
      return <div className='menu-label'>{_localizeField(item.label)}</div>;
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
};

const NavDesktop = ({ navPrimary }: Props) => {
  const { modalType, dispatchModalType } = useHeader();

  const menuStyle: React.CSSProperties = {
    "--nav-len": navPrimary?.length,
  } as React.CSSProperties;

  return (
    <nav
      className={clsx(modalType != null && "is-open")}
      onMouseLeave={() => dispatchModalType(null)}>
      <ul className='menu' style={menuStyle}>
        {navPrimary?.map((item, i) => (
          <NavGroup key={i} input={item} />
        ))}
      </ul>
    </nav>
  );
};

export default NavDesktop;
