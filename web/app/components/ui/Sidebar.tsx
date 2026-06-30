import { SidebarGeneriqueExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import {
  _linkResolver,
  _localizeField,
  _localizeText,
} from "@/app/sanity-api/utils";
import React from "react";
import Figure from "./Figure";
import Link from "next/link";

type Props = {
  input: SidebarGeneriqueExpanded;
};

const Sidebar = ({ input }: Props) => {
  const { commissariat, coProduction, partenaires, products, keyVal } = input;
  return (
    <aside className='sidebar'>
      {commissariat && (
        <div className='sidebar__item sidebar__commissariat'>
          <h3 className='c-tag underline'>{_localizeText("commissariat")}</h3>
          <ul>
            {commissariat.map((item, i) => (
              <li key={i}>
                {item.title && <div>{_localizeField(item.title) || ""}</div>}
                {item.text && (
                  <div className='c-body--tight'>
                    {_localizeField(item.text) || ""}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {coProduction && (
        <div className='sidebar__item sidebar__coproduction'>
          <h3 className='c-tag underline'>Co-production</h3>
          <ul>
            {coProduction.map((item, i) => (
              <li key={i}>
                <div className='c-body--tight'>{_localizeField(item.text)}</div>
                {item._type === "partenaire" &&
                  item.imageCover &&
                  item.imageCover.asset && (
                    <Figure asset={item.imageCover.asset} />
                  )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {partenaires && (
        <div className='sidebar__item sidebar__partenaires'>
          <h3 className='c-tag underline'>Partenaires</h3>
          <ul>
            {partenaires.map((item, i) => (
              <li key={i}>
                <div className='c-body--tight'>{_localizeField(item.text)}</div>
                {item._type === "partenaire" &&
                  item.imageCover &&
                  item.imageCover.asset && (
                    <Figure asset={item.imageCover.asset} />
                  )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {products && (
        <div className='sidebar__item sidebar__products'>
          <ul>
            {products.map((item, i) => (
              <li key={i} title={_localizeField(item.title)}>
                {item && (
                  <div className='flex flex-col gap-xs'>
                    <Figure asset={item?.imageCover?.asset} />
                    <Link className='btn' href={_linkResolver(item)}>
                      {_localizeText("buy")}
                    </Link>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {keyVal && (
        <div className='sidebar__item sidebar__keyVal'>
          {/* <h3 className='c-tag underline'>{_localizeText("keyVal")}</h3> */}
          <ul>
            {keyVal.map((item, i) => (
              <li key={i}>
                {item.title && <div>{_localizeField(item.title) || ""}</div>}
                {item.text && (
                  <div className='c-body--tight'>
                    {_localizeField(item.text) || ""}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* <pre>{JSON.stringify(products, null, 2)}</pre> */}
    </aside>
  );
};

export default Sidebar;
