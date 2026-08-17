"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ModulesList } from "@/app/sanity-api/types/extra-types";

const ModuleTextUI = dynamic(() => import("./ModuleTextUI"));
const ModuleImagesUI = dynamic(() => import("./ModuleImagesUI"));
const ModuleVideoUI = dynamic(() => import("./ModuleVideoUI"));
const ModuleTextImageUI = dynamic(() => import("./ModuleTextImageUI"));
const ModuleTextSidebarUI = dynamic(() => import("./ModuleTextSidebarUI"));
const ModuleListUI = dynamic(() => import("./ModuleListUI"));
const ModuleListsUI = dynamic(() => import("./ModuleListsUI"));
const ModuleSliderCardUI = dynamic(() => import("./ModuleSliderCardUI"));
const ModuleGridCardUI = dynamic(() => import("./ModuleGridCardUI"));
const ModuleProgrammeUI = dynamic(() => import("./ModuleProgrammeUI"));
const ModuleFeaturedCardsUI = dynamic(() => import("./ModuleFeaturedCardsUI"));
const ModuleNewsCardUI = dynamic(() => import("./ModuleNewsCardUI"));
const ModuleListFeuilletageUI = dynamic(
  () => import("./ModuleListFeuilletageUI"),
);
const ModuleListImageImages = dynamic(() => import("./ModuleListImageImages"));
const ModuleListSerieThematiqueUI = dynamic(
  () => import("./ModuleListSerieThematiqueUI"),
);
const ModuleListConversationUI = dynamic(
  () => import("./ModuleListConversationUI"),
);
const ModuleListExhibitionsUI = dynamic(
  () => import("./ModuleListExhibitionsUI"),
);
const ModuleListEventsUI = dynamic(() => import("./ModuleListEventsUI"));
const ModuleListExhibitionsPastUI = dynamic(
  () => import("./ModuleListExhibitionsPastUI"),
);
const ModuleSupportUI = dynamic(() => import("./ModuleSupportUI"));
const ModuleNewsletterUI = dynamic(() => import("./ModuleNewsletterUI"));
const ModuleRessourcesUI = dynamic(() => import("./ModuleRessourcesUI"));
const ModuleFormUI = dynamic(() => import("./ModuleFormUI"));
const ModuleBlockquoteUI = dynamic(() => import("./ModuleBlockquoteUI"));
const ModuleSliderArtistUI = dynamic(() => import("./ModuleSliderArtistUI"));
const ModuleHrUI = dynamic(() => import("./ModuleHrUI"));

import "./index.scss";

const Modules = ({ modules }: ModulesList) => {
  const _renderModules = () => {
    return modules?.map((module) => {
      // console.log(module._type);
      switch (module._type) {
        case "textUI":
          return <ModuleTextUI key={module._key} input={module} />;
        case "blockquoteUI":
          return <ModuleBlockquoteUI key={module._key} input={module} />;
        case "imagesUI":
          return <ModuleImagesUI key={module._key} input={module} />;
        case "videoUI":
          return <ModuleVideoUI key={module._key} input={module} />;
        case "textImageUI":
          return <ModuleTextImageUI key={module._key} input={module} />;
        case "textSidebarUI":
          return <ModuleTextSidebarUI key={module._key} input={module} />;
        case "listUI":
          return <ModuleListUI key={module._key} input={module} />;
        case "listsUI":
          return <ModuleListsUI key={module._key} input={module} />;
        case "sliderCardUI":
          return <ModuleSliderCardUI key={module._key} input={module} />;
        case "gridCardUI":
          return <ModuleGridCardUI key={module._key} input={module} />;
        case "programmeUI":
          return <ModuleProgrammeUI key={module._key} input={module} />;
        case "featuredCardsUI":
          return (
            <ModuleFeaturedCardsUI key={module._key} input={module as any} />
          );
        case "newsCardUI":
          return <ModuleNewsCardUI key={module._key} input={module as any} />;
        case "listFeuilletageUI":
          return (
            <ModuleListFeuilletageUI key={module._key} input={module as any} />
          );
        case "listImageImages":
          return (
            <ModuleListImageImages key={module._key} input={module as any} />
          );
        case "listSerieThematiqueUI":
          return (
            <ModuleListSerieThematiqueUI
              key={module._key}
              input={module as any}
            />
          );
        case "listConversationUI":
          return (
            <ModuleListConversationUI key={module._key} input={module as any} />
          );
        case "listExhibitionsUI":
          return (
            <ModuleListExhibitionsUI key={module._key} input={module as any} />
          );
        case "listExhibitionsPastUI":
          return (
            <ModuleListExhibitionsPastUI
              key={module._key}
              input={module as any}
            />
          );
        case "listEventsUI":
          return <ModuleListEventsUI key={module._key} input={module as any} />;
        case "supportUI":
          return <ModuleSupportUI key={module._key} input={module as any} />;
        case "newsletterUI":
          return <ModuleNewsletterUI key={module._key} input={module as any} />;
        case "ressourcesUI":
          return <ModuleRessourcesUI key={module._key} input={module as any} />;
        case "formUI":
          return <ModuleFormUI key={module._key} input={module as any} />;
        case "sliderArtistUI":
          return (
            <ModuleSliderArtistUI key={module._key} input={module as any} />
          );
        case "hrUI":
          return <ModuleHrUI key={module._key} />;
        default:
          return null;
      }
    });
  };

  return <div className='modules'>{_renderModules()}</div>;
};

export default Modules;
