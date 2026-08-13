"use client";
import React from "react";
import { ModulesList } from "@/app/sanity-api/types/extra-types";
import ModuleTextUI from "./ModuleTextUI";
import ModuleImagesUI from "./ModuleImagesUI";
import ModuleVideoUI from "./ModuleVideoUI";
import ModuleTextImageUI from "./ModuleTextImageUI";
import ModuleTextSidebarUI from "./ModuleTextSidebarUI";
import ModuleListUI from "./ModuleListUI";
import ModuleListsUI from "./ModuleListsUI";
import ModuleSliderCardUI from "./ModuleSliderCardUI";
import ModuleGridCardUI from "./ModuleGridCardUI";
import ModuleProgrammeUI from "./ModuleProgrammeUI";
import ModuleFeaturedCardsUI from "./ModuleFeaturedCardsUI";
import ModuleNewsCardUI from "./ModuleNewsCardUI";
import ModuleListFeuilletageUI from "./ModuleListFeuilletageUI";
import ModuleListImageImages from "./ModuleListImageImages";
import ModuleListSerieThematiqueUI from "./ModuleListSerieThematiqueUI";
import ModuleListConversationUI from "./ModuleListConversationUI";
import ModuleListExhibitionsUI from "./ModuleListExhibitionsUI";
import ModuleListEventsUI from "./ModuleListEventsUI";
import ModuleListExhibitionsPastUI from "./ModuleListExhibitionsPastUI";
import ModuleSupportUI from "./ModuleSupportUI";
import ModuleNewsletterUI from "./ModuleNewsletterUI";
import ModuleRessourcesUI from "./ModuleRessourcesUI";
import ModuleFormUI from "./ModuleFormUI";
import ModuleBlockquoteUI from "./ModuleBlockquoteUI";
import "./index.scss";
import ModuleSliderArtistUI from "./ModuleSliderArtistUI";

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
        default:
          return null;
      }
    });
  };

  return <div className='modules'>{_renderModules()}</div>;
};

export default Modules;
