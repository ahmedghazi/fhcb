"use client";
import React, { ReactNode } from "react";
import {
  ConsentBanner,
  ConsentOptions,
  ConsentProvider,
} from "react-hook-consent";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import website from "@/app/config/website";
import { _linkResolver, _localizeText } from "@/app/sanity-api/utils";
import portableTextComponents from "@/app/sanity-api/portableTextComponents";
import { SETTINGS_QUERY_RESULT } from "@/app/sanity-api/types/sanity.types";
import { LOCALE_COOKIE_NAME } from "@/app/config/cookies";

type Props = {
  children: ReactNode;
  settings?: SETTINGS_QUERY_RESULT | null;
};

const CookieWrapper = ({ children, settings }: Props) => {
  const gaId = website.googleAnalyticsID;
  const privacyHref = settings?.urlPrivacy?.link
    ? _linkResolver(settings.urlPrivacy.link)
    : null;
  const tNecessaryName = _localizeText("cookieServiceNecessaryName");
  const tNecessaryDescription = _localizeText(
    "cookieServiceNecessaryDescription",
  );
  const tAnalyticsName = _localizeText("cookieServiceAnalyticsName");
  const tAnalyticsDescription = _localizeText(
    "cookieServiceAnalyticsDescription",
  );
  const tMuxName = _localizeText("cookieServiceMuxName");
  const tMuxDescription = _localizeText("cookieServiceMuxDescription");
  const tBannerMessage = _localizeText("cookieBannerMessage");
  const tPersonalize = _localizeText("cookiePersonalize");
  const tDeclineShort = _localizeText("cookieDeclineShort");
  const tApproveAll = _localizeText("cookieApproveAll");
  const tDecline = _localizeText("cookieDecline");
  const tApprove = _localizeText("cookieApprove");
  const tApproveAllModal = _localizeText("cookieApproveAllModal");
  const tPrivacyLink = _localizeText("politiqueConfidentialite");

  const consentOptions: ConsentOptions = {
    services: [
      {
        id: "necessary",
        name: tNecessaryName,
        description: tNecessaryDescription,
        mandatory: true,
        cookies: [{ pattern: new RegExp(`^${LOCALE_COOKIE_NAME}$`) }],
      },
      {
        id: "analytics",
        name: tAnalyticsName,
        description: tAnalyticsDescription,
        ...(gaId
          ? {
              scripts: [
                {
                  id: "google-analytics-src",
                  src: `https://www.googletagmanager.com/gtag/js?id=${gaId}`,
                },
                {
                  id: "google-analytics-init",
                  code: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`,
                },
              ],
            }
          : {}),
        cookies: [
          { pattern: /^_ga/ },
          { pattern: /^_gid/ },
          { pattern: /^_gat/ },
        ],
      },
      {
        id: "mux-data",
        name: tMuxName,
        description: tMuxDescription,
      },
    ],
    theme: "light",
  };

  return (
    <ConsentProvider options={consentOptions}>
      {children}
      <ConsentBanner
        settings={{
          label: tPersonalize,
          modal: {
            title: tPersonalize,
            description: tBannerMessage,
            decline: { label: tDecline },
            approve: { label: tApprove },
            approveAll: { label: tApproveAllModal },
          },
        }}
        decline={{ label: tDeclineShort }}
        approve={{ label: tApproveAll }}>
        {settings?.messageCookies?.length ? (
          <PortableText
            value={settings.messageCookies}
            components={portableTextComponents}
          />
        ) : (
          tBannerMessage
        )}
        {privacyHref && (
          <>
            {" "}
            <Link href={privacyHref}>{tPrivacyLink}</Link>
          </>
        )}
      </ConsentBanner>
    </ConsentProvider>
  );
};

export default CookieWrapper;
