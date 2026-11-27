import { defineLive } from "next-sanity/live";
import { getClient } from "./sanity.client";

// Live preview for editors only: <SanityLive /> is rendered in draft mode
// alone (see layout.tsx), the public site keeps webhook revalidation.
// Only SanityLive is used — pages keep their own fetches, so with
// includeDrafts each live event triggers a router.refresh().
// browserToken is sent to the editor's browser: it must be Viewer-only.
export const { SanityLive } = defineLive({
  client: getClient(),
  serverToken: false,
  browserToken:
    process.env.SANITY_API_BROWSER_TOKEN || process.env.SANITY_API_READ_TOKEN,
});
