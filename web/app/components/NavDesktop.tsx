import React from "react";
import { LinkExternal, LinkInternal } from "../sanity-api/types/sanity.types";
import clsx from "clsx";
import { _linkResolver, _localizeField } from "../sanity-api/utils";
import useHeader, { NavMenuItem } from "../context/HeaderContext";
import { _collectFirstImagesFromNavItem } from "../lib/utils";
import { Link } from "next-view-transitions";

type NavGroupProps = {
  input: LinkInternal | LinkExternal;
  depth?: number;
};
const NavGroup = ({ input, depth = 1 }: NavGroupProps) => {
  const {
    dispatchCurrentMenuMessage,
    dispatchCurrentMenuItem,
    dispatchModalType,
  } = useHeader();
  const hasSubmenu =
    input._type === "linkInternal" && input.subMenu && input.subMenu.length > 0;
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
    <li
      className={clsx(hasSubmenu && "has-submenu")}
      onMouseEnter={_onMouseEnter}>
      <NavItem item={input} withSubMenu={hasSubmenu} depth={depth} />

      {hasSubmenu && input._type === "linkInternal" && input.subMenu && (
        <SubMenu
          items={input.subMenu}
          depth={depth + 1}
          withImages={displaySubMenuImages}
        />
      )}
    </li>
  );
};

type SubMenuProps = {
  items: NonNullable<LinkInternal["subMenu"]>;
  depth: number;
  withImages?: boolean;
};
const SubMenu = ({ items, depth, withImages }: SubMenuProps) => {
  const { dispatchCurrentMenuItem } = useHeader();

  return (
    <ul className={clsx("sub-menu", `sub-menu--depth-${depth}`)}>
      {items.map((item, i) => {
        const hasSubmenu =
          item._type === "linkInternal" &&
          item.subMenu &&
          item.subMenu.length > 0;

        return (
          <li
            key={i}
            className={clsx(hasSubmenu && "has-submenu")}
            onMouseEnter={() => {
              if (withImages && item._type === "linkInternal") {
                const images = item.imageCover
                  ? [item.imageCover]
                  : _collectFirstImagesFromNavItem(item.link as any);
                if (images.length > 0) {
                  dispatchCurrentMenuItem({
                    ...item,
                    images,
                  } as NavMenuItem);
                }
              }
            }}>
            <NavItem item={item} withSubMenu={hasSubmenu} depth={depth} />

            {hasSubmenu && item._type === "linkInternal" && item.subMenu && (
              <SubMenu items={item.subMenu} depth={depth + 1} />
            )}
          </li>
        );
      })}
    </ul>
  );
};

type NavItemProps = {
  item: LinkInternal | LinkExternal;
  withSubMenu?: boolean;
  depth: number;
};
const NavItem = ({ item, withSubMenu, depth }: NavItemProps) => {
  const labelClassName = clsx("menu-label", `menu-label--depth-${depth}`);

  if (item._type === "linkInternal") {
    if (withSubMenu && depth === 1) {
      return <div className={labelClassName}>{_localizeField(item.label)}</div>;
    }
    return (
      <Link href={_linkResolver(item.link)}>
        <div className={labelClassName}>{_localizeField(item.label)}</div>
      </Link>
    );
  }
  if (item._type === "linkExternal") {
    return (
      <a href={item.link} target='_blank' rel='noopener noreferrer'>
        <div className={labelClassName}>{_localizeField(item.label)}</div>
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
  // console.log(navPrimary);
  const menuStyle: React.CSSProperties = {
    "--nav-len": navPrimary?.length,
  } as React.CSSProperties;

  return (
    <nav
      className={clsx(modalType != null && "is-open")}
      onMouseLeave={() => dispatchModalType(null)}>
      <ul className='menu' style={menuStyle}>
        {navPrimary?.map((item, i) => (
          <NavGroup key={i} input={item} depth={1} />
        ))}
      </ul>
    </nav>
  );
};

export default NavDesktop;
