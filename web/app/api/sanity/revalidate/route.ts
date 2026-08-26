import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type WebhookPayload = {
  _type: string;
};

// Some pages aggregate other document types (eg. the home page pulls in
// exhibitions/events, the library lists products) — revalidate those too
// when the source document changes.
const FANOUT_TAGS: Record<string, string[]> = {
  product: ["library"],
  tagProduct: ["product", "library"],
  pageModulaire: ["home"],
  // pageModulaire/programme: several of each embed an exhibition-derived rebond block (e.g. the
  // "current exhibitions, else upcoming" block on missions/equipe/histoire/... and on the
  // "expositions-en-cours" programme page) — an exhibition/event flipping current<->past/upcoming
  // needs those revalidated too, not just its own page and the home page.
  exhibition: ["home", "pageModulaire", "programme"],
  event: ["home", "pageModulaire", "programme"],
};

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 },
      );
    }

    if (!body?._type) {
      return NextResponse.json({ message: "Bad Request" }, { status: 400 });
    }

    const tags = [body._type, ...(FANOUT_TAGS[body._type] ?? [])];
    tags.forEach((tag) => revalidateTag(tag));

    return NextResponse.json({ revalidated: true, tags, now: Date.now() });
  } catch (err) {
    console.error("[sanity-revalidate] failed:", err);
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 },
    );
  }
}
