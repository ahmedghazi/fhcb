"use client";
import i18n from "@/app/config/i18n";
import useLocale from "@/app/context/LocaleContext";
import clsx from "clsx";
import React from "react";
// import useLocale from '../../contexts/LocaleWrapper'
// import { _localizeText } from '../../core/utils'
// const locales = require('../../../config/i18n')
import styles from "./LocaleSwitcher.module.css";
const LocalesSwitcher = ({ buttonSize = "regular" }) => {
  const { locale, dispatch } = useLocale();

  return (
    <div className='locale-switcher '>
      <ul className={styles.ul}>
        {Object.values(i18n).map((item, i) => (
          <li
            key={`locale-${i.toString()}`}
            className={clsx(locale === item.locale ? "is-current" : "")}>
            <button
              onClick={() => dispatch(item.locale)}
              className={clsx(
                styles.button,
                locale === item.locale ? "is-active" : "",
                `btn- btn--${buttonSize}-`,
              )}>
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LocalesSwitcher;
