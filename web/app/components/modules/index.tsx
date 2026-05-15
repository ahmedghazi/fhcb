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
import "./index.scss";

const Modules = ({ modules }: ModulesList) => {
  const _renderModules = () => {
    return modules?.map((module) => {
      switch (module._type) {
        case "textUI":
          return <ModuleTextUI key={module._key} input={module} />;
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
        default:
          return null;
      }
    });
  };

  return <div className='modules'>{_renderModules()}</div>;
};

export default Modules;
