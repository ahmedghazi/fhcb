"use client";
import React, { ReactNode } from "react";
import {
  ConsentBanner,
  ConsentOptions,
  ConsentProvider,
} from "react-hook-consent";
// import "react-hook-consent/dist/styles/style.css";

type Props = {
  children: ReactNode;
};

const CookieWrapper = ({ children }: Props) => {
  const consentOptions: ConsentOptions = {
    services: [
      // {
      //   id: "myid",
      //   name: "My Service 1",
      //   description:
      //     "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam.",
      //   scripts: [
      //     { id: "external-script", src: "https://myscript.com/script.js" },
      //     { id: "inline-code", code: `alert("I am a JavaScript code");` },
      //   ],
      // },
      {
        id: "analytics",
        name: "Analytics",
        description:
          "Les cookies statistiques aident les propriétaires du site web, par la collecte et la communication d’informations de manière anonyme",
        scripts: [
          { id: "external-script", src: "https://myscript.com/script2.js" },
        ],
        // mandatory: true,
      },
    ],
    theme: "light",
  };

  return (
    <ConsentProvider options={consentOptions}>
      {children}
      <ConsentBanner
        settings={{
          label: "Personnaliser",
          modal: {
            title: "Personnaliser",
            description:
              "Nous utilisons des cookies pour analyser et améliorer ce site pour vous. Vous avez le contrôle sur ce que vous souhaitez activer.",
            decline: { label: "Refuser" },
            approve: { label: "OK" },
            approveAll: { label: "Tout accepter" },
          },
        }}
        decline={{ label: "Non" }}
        approve={{ label: "OK, tout accepter" }}>
        Nous utilisons des cookies pour analyser et améliorer ce site pour vous.
        Vous avez le contrôle sur ce que vous souhaitez activer.
      </ConsentBanner>
    </ConsentProvider>
  );
};

export default CookieWrapper;
