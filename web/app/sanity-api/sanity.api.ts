export const projectId: string = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset: string = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2022-11-15";

export const useCdn = process.env.SANITY_REVALIDATE_SECRET
  ? false
  : process.env.NODE_ENV === "production";

export const previewSecretId: `${string}.${string}` = "preview.secret";

export const token = process.env.SANITY_API_READ_TOKEN!;

export const studioUrl: string =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL! ||
  "https://backoffice-fhcb.sanity.studio";
