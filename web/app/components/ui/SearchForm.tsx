import { SETTINGS_QUERY_RESULT } from "@/app/sanity-api/types/sanity.types";
import {
  _linkResolver,
  _localizeField,
  _localizeText,
} from "@/app/sanity-api/utils";
import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  MostSearchedItem,
  PostTypes,
} from "@/app/sanity-api/types/extra-types";
import CardArtist from "./cards/CardArtist";
import CardExhibition from "./cards/CardExhibition";
import CardProduct from "./cards/CardProduct";
import styles from "./Search.module.css";
import Link from "next/link";
import CardImageImages from "./cards/CardImageImages";
import CardFeuilletage from "./cards/CardFeuilletage";
import CardPageModulaire from "./cards/CardPageModulaire";
import CardEvent from "./cards/CardEvent";
import CardType from "./cards/CardType";

/*
  | PageModulaire
  | Exhibition
  | Event
  | Artist
  | Library
  | Product
  | Programme
  | Feuilletage
  | ImageImages
  | any;
*/
type SearchResultItemProps = {
  input: PostTypes;
};

const SearchResultItem = ({ input }: SearchResultItemProps) => {
  // console.log(input._type);
  if (input._type === "pageModulaire") {
    return <CardPageModulaire input={input} size='md' />;
  }
  if (input._type === "artist") {
    return <CardArtist input={input} size='sm' />;
  }
  if (input._type === "exhibition") {
    return <CardExhibition input={input} size='md' />;
  }
  if (input._type === "event") {
    return <CardEvent input={input} size='sm' />;
  }
  if (input._type === "product") {
    return <CardProduct input={input} size='sm' />;
  }
  if (input._type === "imageImages") {
    return <CardImageImages input={input} size='md' />;
  }
  if (input._type === "feuilletage") {
    return <CardFeuilletage input={input} size='md' />;
  }
  return "";
};

type Props = {
  settings: NonNullable<SETTINGS_QUERY_RESULT>;
};

const SearchForm = ({ settings }: Props) => {
  const [status, setStatus] = useState<string>("");
  const [term, setTerm] = useState<string>("");
  const [searchResult, setSearchResult] = useState<Array<any>>([]);
  const initialPlaceholder = "Exposition, artiste, événement...";
  const [placeholder, setPlaceholder] = useState<string>(initialPlaceholder);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mostSearched } = settings;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const getButtonMsg = () => {
    switch (status) {
      case "searching":
        return "...";

      case "error":
        return _localizeText("error");
      default:
        return _localizeText("search");
    }
  };

  const _handleSearch = async () => {
    const body = { s: term };
    // return;
    setStatus("searching");
    document.body.classList.add("is-fetching");
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        body: JSON.stringify(body),
      });
      const data = await res.json();
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
    <div className={""}>
      <form className={styles.searchForm} onSubmit={_handleSubmit}>
        <div className='inner '>
          <div className='flex-2'>
            <input
              type='search'
              size={10}
              placeholder={placeholder}
              name='term'
              onChange={changeHandler}
              value={term}
              id='s'
              className='flex-2'
              ref={inputRef}
              onFocus={() => setPlaceholder("")}
              onBlur={() => setPlaceholder(initialPlaceholder)}
            />
          </div>
          <div>
            <button
              className='btn'
              disabled={
                status === "searching" || status === "success" || term === ""
              }
              type='submit'
              aria-label='submit'>
              <span>{getButtonMsg()}</span>
            </button>
          </div>
        </div>
      </form>
      {mostSearched && searchResult.length === 0 && (
        <div className={styles.mostSearched}>
          <h2 className='c-h2'>{_localizeText("mostSearched")}</h2>
          <ul className=''>
            {(mostSearched as unknown as MostSearchedItem[]).map((item, i) => (
              <li key={i} className='ellipsis'>
                <Link href={_linkResolver(item)}>
                  {_localizeField(item.title)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {searchResult && (
        <div className={styles.searchResults}>
          <div className='inner'>
            <div className='body'>
              <div className='grid--centered'>
                {searchResult?.map((item: PostTypes, index: number) => (
                  <Fragment key={`${item && item._id}-${index}`}>
                    <CardType input={item} context='search' />
                  </Fragment>
                ))}
                {searchResult.length === 0 && term !== "" && (
                  <div className='col-span-full'>
                    <p>{_localizeText("noResults")}</p>
                  </div>
                )}
              </div>
              {/* <div className='grid grid-cols-1 md:grid-cols-12 gap-gutter grid--centered'>
                {searchResult?.map((item, i) => (
                  <SearchResultItem input={item} key={i} />
                ))}

              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchForm;
