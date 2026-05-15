import {
  Artist,
  Exhibition,
  PageModulaire,
  Product,
  Settings,
} from "@/app/sanity-api/types/sanity.types";
import { _linkResolver } from "@/app/sanity-api/utils";
import React, { useRef, useState } from "react";
import { PostTypes } from "@/app/sanity-api/types/extra-types";
import CardArtist from "./cards/CardArtist";
import CardExhibition from "./cards/CardExhibition";
import CardProduct from "./cards/CardProduct";

type SearchResultItemProps = {
  input: PostTypes;
};

const SearchResultItem = ({ input }: SearchResultItemProps) => {
  if (input._type === "artist") {
    return <CardArtist input={input} />;
  }
  if (input._type === "exhibition") {
    return <CardExhibition input={input} />;
  }
  if (input._type === "product") {
    return <CardProduct input={input} />;
  }
  return <div>Other</div>;
};

type Props = {
  settings: Settings;
};

const SearchForm = ({ settings }: Props) => {
  const [status, setStatus] = useState<string>("");
  const [term, setTerm] = useState<string>("");
  const [searchResult, setSearchResult] = useState<Array<any>>([]);
  const initialPlaceholder = "RECHERCHER";
  const [placeholder, setPlaceholder] = useState<string>(initialPlaceholder);
  const inputRef = useRef<HTMLInputElement>(null);

  const getButtonMsg = () => {
    switch (status) {
      case "searching":
        return "...";

      case "error":
        return "ERROR";
      default:
        return "OK";
    }
  };

  const _handleSearch = async () => {
    const body = { s: term };
    // console.log(body);
    // return;
    setStatus("searching");
    document.body.classList.add("is-fetching");
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        body: JSON.stringify(body),
      });
      const data = await res.json();
      console.log(data);
      // if (setSearchResult)
      setSearchResult(data);
      document.body.classList.remove("is-fetching");
      setStatus("");
      // setOpen(true);
    } catch (error: any) {
      console.log(error);
      setStatus("error");
    }
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      setTerm(event.target?.value);
    } else {
      setTerm("");
      // if (setSearchResult)
      setSearchResult([]);
    }
  };

  const _handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.length > 0) {
      _handleSearch();
    }
  };

  return (
    <div className='search-form'>
      <form className='search' onSubmit={_handleSubmit}>
        <div className='form '>
          <input
            type='search'
            size={10}
            placeholder={placeholder}
            name='term'
            // onChange={changeHandler}
            onInput={changeHandler}
            value={term}
            id='s'
            className='flex-2'
            ref={inputRef}
            onFocus={() => setPlaceholder("")}
            onBlur={() => setPlaceholder(initialPlaceholder)}
          />
          {term !== "" && (
            <button
              disabled={status === "searching" || status === "success"}
              type='submit'
              aria-label='submit'
              className={""}>
              <span>{getButtonMsg()}</span>
            </button>
          )}
        </div>
      </form>
      <div className='mostsSearched'>mostsSearched here</div>
      {searchResult && searchResult.length > 0 && (
        <div className='search--modal'>
          {/* <button
                className='btn-close text-lg'
                onClick={() => setOpen(false)}>
                ×
              </button> */}
          <div className='inner'>
            <div className='body'>
              <div className='featured'>featured search results</div>
              <div className='grid md:grid-cols-4 gap-gutter'>
                {searchResult.map((item, i) => (
                  <SearchResultItem input={item} key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchForm;
