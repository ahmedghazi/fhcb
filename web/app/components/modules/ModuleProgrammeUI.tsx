"use client";
import React from "react";
import Link from "next/link";
import { _linkResolver } from "@/app/sanity-api/utils";
import Figure from "@/app/components/ui/Figure";
import useLocale from "@/app/context/LocaleContext";
import { ProgrammeUI } from "@/app/sanity-api/types/sanity.types";

type Props = {
  input: ProgrammeUI;
};

const ModuleProgrammeUI = ({ input }: Props) => {
  const { locale } = useLocale();
  const title = input.title?.[locale as "fr" | "en"] || input.title?.fr;

  return (
    <section className='module module--programme-ui'>
      <div className='module__inner'>
        {title && <h2 className='module__title'>{title}</h2>}
        {input.items && (
          <div className='module__programme-list'>
            {input.items.map((item: any) => (
              <div key={item._id} className='module__programme-item'>
                <Link href={_linkResolver(item)}>
                  {item.image?.asset && <Figure asset={item.image.asset} />}
                  <div className='module__programme-body'>
                    <p>
                      {item.title?.[locale as "fr" | "en"] ||
                        item.title?.fr ||
                        item.title}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ModuleProgrammeUI;
