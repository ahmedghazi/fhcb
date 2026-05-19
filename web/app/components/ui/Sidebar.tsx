import { SidebarGeneriqueExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { _localizeField, _localizeText } from "@/app/sanity-api/utils";
import React from "react";
import Figure from "./Figure";

type Props = {
  input: SidebarGeneriqueExpanded;
};

const Sidebar = ({ input }: Props) => {
  return (
    <aside className='sidebar'>
      {input.commissariat && (
        <div className='sidebar__item sidebar__commissariat'>
          <h3 className='c-tag underline'>{_localizeText("commissariat")}</h3>
          <ul>
            {input.commissariat.map((item, i) => (
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
      {input.coProduction && (
        <div className='sidebar__item sidebar__coproduction'>
          <h3 className='c-tag underline'>Co-production</h3>
          <ul>
            {input.coProduction.map((item, i) => (
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
      {input.partenaires && (
        <div className='sidebar__item sidebar__partenaires'>
          <h3 className='c-tag underline'>Partenaires</h3>
          <ul>
            {input.partenaires.map((item, i) => (
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
    </aside>
  );
};

export default Sidebar;
