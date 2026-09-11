"use client";
import { Fragment, useEffect } from "react";
import dynamic from "next/dynamic";
import useLocale from "@/app/context/LocaleContext";
import { ProductExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { ListProductUI } from "@/app/sanity-api/types/sanity.types";
import FilterBar from "../ui/filters/FilterBar";
import { SanityFilterDef } from "../ui/filters/filters.types";
import { applyFilters } from "../ui/filters/applyFilters";
import { withResolvedOptions } from "../ui/filters/collectFilterOptions";
import { usePaginatedFilters } from "../ui/filters/usePaginatedFilters";
import LoadMoreButton from "../ui/LoadMoreButton";
import { publish } from "pubsub-js";
import {
  _linkResolver,
  _localizeField,
  _localizeText,
  _parseJsonStringArray,
} from "../../sanity-api/utils";
import { urlFor } from "../../sanity-api/sanity-utils";
import { artistsToString } from "@/app/lib/utils";
import { registerWebMCPTool, jsonResult } from "@/app/lib/webmcp";
import website from "@/app/config/website";

type ProductCatalogEntry = {
  id: string;
  title: string;
  subTitle: string;
  artists: string;
  price: number | null;
  priceFormatted: string;
  inStock: boolean;
  totalInventory: number;
  tags: string[];
  categories: string[];
  url: string;
  image: string;
  editeur?: string;
  isbn?: string;
};

const localizeField = (field: any, locale: string): string => {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[locale] ?? field["fr"] ?? "";
};

const toCatalogEntry = (
  product: ProductExpanded,
  locale: string,
): ProductCatalogEntry => {
  const artists =
    artistsToString(product.artists) || _parseJsonStringArray(product.artistName);

  return {
    id: product._id,
    title: localizeField(product.title, locale),
    subTitle: product.subTitle ?? "",
    artists,
    price: product.price ?? null,
    priceFormatted: product.price != null ? `${product.price} €` : "",
    inStock: (product.totalInventory ?? 0) > 0,
    totalInventory: product.totalInventory ?? 0,
    tags: (product.tags ?? [])
      .map((tag) => localizeField(tag.title, locale))
      .filter(Boolean),
    categories: (product.tagsProduct ?? [])
      .map((tag) => localizeField(tag.title, locale))
      .filter(Boolean),
    url: `${website.url}${_linkResolver(product)}`,
    image: product.imageCover?.asset ? urlFor(product.imageCover.asset, 800) : "",
    editeur: product.editeur,
    isbn: product.isbn,
  };
};

const GridMasonryColumns = dynamic(() =>
  import("../ui/GridMasonryColumns").then((mod) => mod.GridMasonryColumns),
);

type Props = {
  input: ListProductUI & {
    resolvedItems?: ProductExpanded[];
    filters?: SanityFilterDef[];
  };
};

const ModuleListProductUI = ({ input }: Props) => {
  const { locale } = useLocale();
  const { activeFilters, visibleCount, handleFilterChange, loadMore } =
    usePaginatedFilters();
  const rawFilterDefs: SanityFilterDef[] = input.filters ?? [];
  const filterDefs = withResolvedOptions(
    rawFilterDefs,
    input.resolvedItems ?? [],
  );

  const filteredItems = applyFilters(
    input.resolvedItems ?? [],
    filterDefs,
    activeFilters,
    locale,
  );
  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  useEffect(() => {
    const hasFilters = Object.keys(activeFilters).length > 0;
    publish("IS_FILTERING", hasFilters);
  }, [activeFilters]);

  const resolvedItems = input.resolvedItems;
  useEffect(() => {
    const items = resolvedItems ?? [];

    const unregister = registerWebMCPTool({
      name: "search_products",
      description:
        "Search and list the Fondation Henri Cartier-Bresson shop catalog shown on this page (books, publications, prints). Returns matching products with title, artist(s), price, stock status and a link to the product page.",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "Free-text search across title, subtitle, artist name, tags and categories.",
          },
          inStockOnly: {
            type: "boolean",
            description: "Only return products currently in stock.",
          },
          sort: {
            type: "string",
            enum: ["title_asc", "title_desc", "price_asc", "price_desc"],
            description: "How to sort results. Defaults to the page's order.",
          },
          limit: {
            type: "number",
            description: "Maximum number of products to return.",
            default: 20,
          },
        },
      },
      execute: (rawInput: {
        query?: string;
        inStockOnly?: boolean;
        sort?: "title_asc" | "title_desc" | "price_asc" | "price_desc";
        limit?: number;
      }) => {
        const { query, inStockOnly, sort, limit } = rawInput ?? {};
        let entries = items.map((item) => toCatalogEntry(item, locale));

        if (query) {
          const term = query.toLowerCase();
          entries = entries.filter((entry) =>
            [entry.title, entry.subTitle, entry.artists, ...entry.tags, ...entry.categories]
              .join(" ")
              .toLowerCase()
              .includes(term),
          );
        }

        if (inStockOnly) {
          entries = entries.filter((entry) => entry.inStock);
        }

        if (sort === "title_asc") entries.sort((a, b) => a.title.localeCompare(b.title));
        if (sort === "title_desc") entries.sort((a, b) => b.title.localeCompare(a.title));
        if (sort === "price_asc")
          entries.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        if (sort === "price_desc")
          entries.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));

        return jsonResult({
          total: entries.length,
          products: entries.slice(0, Math.max(1, Number(limit) || 20)),
        });
      },
    });

    return unregister;
  }, [resolvedItems, locale]);

  return (
    <section className='module module--list-product-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {input.title && (
            <h2 className='module__title c-h1_5'>
              {_localizeField(input.title)}
            </h2>
          )}
          {filterDefs.length > 0 && (
            <FilterBar filterDefs={filterDefs} onChange={handleFilterChange} />
          )}

          {visibleItems.length > 0 && (
            <GridMasonryColumns items={visibleItems} />
          )}

          {filteredItems.length === 0 &&
            Object.keys(activeFilters).length > 0 && (
              <p className='text-center'>{_localizeText("noResultShop")}</p>
            )}

          {hasMore && <LoadMoreButton onClick={loadMore} />}
        </div>
      </div>
    </section>
  );
};

export default ModuleListProductUI;
