import { _localizeText } from "@/app/sanity-api/utils";
import React, { useEffect, useState } from "react";

type Props = {};

const FiltersFeuilletage = (props: Props) => {
  const [sort, setSort] = useState<"desc" | "asc">("desc");
  const _resetFilters = () => {
    setSort("desc");
  };
  const _updateSort = () => {
    setSort(sort === "desc" ? "asc" : "desc");
  };

  useEffect(() => {
    // TODO: Apply filters
  }, [sort]);
  return (
    <div className='filters filters--feuilletage'>
      <div className='filters__inner'>
        <div className='flex gap-gutter'>
          <button onClick={_updateSort}>
            <span>{_localizeText("sort")}</span>
            <span>{sort === "asc" && "↑"}</span>
            <span>{sort === "desc" && "↓"}</span>
          </button>
          <input
            type='search'
            name='search'
            id='search'
            placeholder={_localizeText("search")}
          />
        </div>
        <button onClick={_resetFilters} className='reset'>
          {_localizeText("resetFilters")}
        </button>
      </div>
    </div>
  );
};

export default FiltersFeuilletage;
