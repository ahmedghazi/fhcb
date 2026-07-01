import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  token: process.env.SANITY_API_WRITE_TOKEN!,
  apiVersion: "2024-01-01",
  useCdn: false,
  // projectId: "YOUR_PROJECT_ID",
  // dataset: "production",
  // apiVersion: "2024-01-01",
  // token: process.env.SANITY_TOKEN,
  // useCdn: false,
});

async function run() {
  const ids = await client.fetch(`*[_type == "product"]._id`);

  while (ids.length) {
    const batch = ids.splice(0, 100);

    const tx = client.transaction();
    batch.forEach((id: string) => tx.delete(id));

    await tx.commit();
    console.log(`Deleted ${batch.length}`);
  }
}

export async function POST(req: Request) {
  try {
    await run();
  } catch (err) {
    console.error("[shopify-del] del failed:", err);
    return new Response("Del failed", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
