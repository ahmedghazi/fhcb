import {
  createClient,
  SanityClient,
  type ClientConfig,
  type QueryParams,
} from "@sanity/client";
import { projectId, dataset, apiVersion, token, studioUrl } from "./sanity.api";

const config: ClientConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "development" ? true : false,
  token,
};

export const sanityConfig = {
  projectId: projectId,
  dataset: dataset,
};

const client = createClient(config);

export function getClient(preview?: { token?: string }): SanityClient {
  if (preview) {
    if (!preview.token) {
      throw new Error("You must provide a token to preview drafts");
    }
    return client.withConfig({
      token: preview.token,
      useCdn: false,
      ignoreBrowserTokenWarning: true,
      perspective: "previewDrafts",
      stega: {
        enabled: true,
        studioUrl: studioUrl,
      },
    });
  }
  return client;
}

export async function sanityFetch<QueryResponse>({
  query,
  qParams = {},
  tags,
}: {
  query: string;
  qParams?: QueryParams;
  tags: string[];
}): Promise<QueryResponse> {
  return client.fetch<QueryResponse>(query, qParams, {
    cache: "no-store",
    next: { tags },
  });
}
