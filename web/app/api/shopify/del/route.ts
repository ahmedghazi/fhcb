// Disabled: deletes every product document from the dataset. Kept for a
// possible future reset — to re-enable, uncomment the code below (it keeps the
// Bearer <SHOPIFY_WEBHOOK_SECRET> guard) and remove the blocking POST.

// import { createClient } from "@sanity/client";
//
// const client = createClient({
//   projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
//   dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
//   token: process.env.SANITY_API_WRITE_TOKEN!,
//   apiVersion: "2024-01-01",
//   useCdn: false,
// });
//
// async function run() {
//   const ids = await client.fetch(`*[_type == "product"]._id`);
//
//   while (ids.length) {
//     const batch = ids.splice(0, 100);
//
//     const tx = client.transaction();
//     batch.forEach((id: string) => tx.delete(id));
//
//     await tx.commit();
//     console.log(`Deleted ${batch.length}`);
//   }
// }
//
// export async function POST(req: Request) {
//   const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
//   const auth = req.headers.get("authorization");
//
//   if (!secret || auth !== `Bearer ${secret}`) {
//     return new Response("Unauthorized", { status: 401 });
//   }
//
//   try {
//     await run();
//   } catch (err) {
//     console.error("[shopify-del] del failed:", err);
//     return new Response("Del failed", { status: 500 });
//   }
//
//   return new Response("OK", { status: 200 });
// }

export async function POST() {
  return new Response("Gone", { status: 410 });
}
