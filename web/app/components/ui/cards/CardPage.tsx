import { PageModulaire } from "@/app/sanity-api/types/sanity.types";
import clsx from "clsx";
import React from "react";
import Figure from "../Figure";
import {
  _linkResolver,
  _localizeField,
  _localizeText,
} from "@/app/sanity-api/utils";
import Link from "next/link";

type Props = {
  input: PageModulaire;
};

const CardPage = ({ input }: Props) => {
  return (
    <div
      className={clsx("card card--l1a", input._type && `card--${input._type}`)}>
      <div className='card__header'>
        <div className='card__tag c-tag'>{"input.tag"}</div>
        <h2 className='card__title c-h2'>{_localizeField(input.title)}</h2>

        <div className='card__subtitle c-h3'>{"input.subtitle"}</div>
      </div>
      <div className='card__figure'>
        <Figure asset={input.imageCover?.asset} />
      </div>
      <div className='card__footer'>
        <div className='card__info c-body-xs'>{"input.infos"}</div>
        <div className='btns'>
          <Link href={_linkResolver(input)} className='btn btn--primary'>
            {_localizeText("discover")}
          </Link>
          {/* <button className='btn btn--primary'>Bouton primary</button>
          <button className='btn btn--secondary'>Bouton secondary</button> */}
        </div>
      </div>
    </div>
  );
};

export default CardPage;
