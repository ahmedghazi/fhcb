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

// ISR: cached for `revalidate` seconds as a safety net, refreshed instantly
// on publish via the /api/revalidate webhook calling revalidateTag(tag).
export async function sanityFetch<QueryResponse>({
  query,
  qParams = {},
  tags,
  revalidate = 3600,
}: {
  query: string;
  qParams?: QueryParams;
  tags: string[];
  revalidate?: number | false;
}): Promise<QueryResponse> {
  return client.fetch<QueryResponse>(query, qParams, {
    next: { revalidate, tags },
  });
}
