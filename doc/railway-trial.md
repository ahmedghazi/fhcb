# Railway hosting trial

## Why

Vercel Pro is ~$240+/year minimum (Hobby isn't usable — the site sells books/tickets, which is explicitly "commercial usage" under Vercel's fair-use terms). Comparing alternatives (Netlify, Render, Railway, Fly.io, OVH+GitHub Actions self-hosted) before committing to a paid plan. Railway was picked to actually pilot since it runs `next start` as a real persistent Node process (no adapter reinterpreting Next.js like Netlify/Cloudflare Pages do — same caching/`revalidateTag` behavior we already rely on, see `isr-caching.md`).

## Current live state

- **URL**: https://fhcb-production.up.railway.app
- **Workspace**: Ahmed's Projects → **Project**: `fhcb-web-trial` (`89d1f0ff-567d-494a-b62c-4e8051602e19`)
- **Service**: `fhcb` (`6595b0db-550c-40dc-aa30-df0da1aca5e6`), environment `production` (`b671cc09-c8e2-45e6-8031-0cfbb5481a06`)
- **Source**: GitHub repo `ahmedghazi/fhcb`, branch `main` — auto-deploys on push, same branch Vercel production also tracks. Not decoupled — a push to `main` triggers both.
- **Root Directory**: `web` (dashboard-only setting, Settings tab — no CLI flag exists for this in `@railway/cli` as of this trial)
- **Region**: `ams` (Amsterdam)
- Env vars: all 18 from `.env.local` added manually via the dashboard (Sanity tokens, Shopify tokens, SMTP creds, `CRON_SECRET`, `SANITY_REVALIDATE_SECRET`, `NEXT_PUBLIC_GA_ID`)

## Setup that made it work

1. `web/package.json` needs `"packageManager": "pnpm@10.33.2"` — Railway's build system (Railpack) uses this to provision pnpm via Corepack/mise. Without it, pnpm isn't installed and `pnpm build` fails with `sh: 1: pnpm: not found`.
2. Root Directory must be set to `web` in the service's Settings (this is a monorepo — `studio/` and `web/` both at repo root). Without it, Railpack scans the repo root, doesn't find `package.json`, and fails with "No start command detected."
3. Domain target port: Railway auto-assigns the container's actual port (check deploy logs for `next start`'s `- Local: http://localhost:XXXX`, was `8080` at trial time, not the Next.js default `3000`). `railway domain` / `railway domain update --port` must match this or you get a 502 even though the app is running fine.

## Dead ends (don't repeat these)

Spent a long debugging loop on a custom `web/railpack.json` overriding the `install` step (to force `corepack enable && pnpm install`) because pnpm still wasn't found even with the `packageManager` field set. In hindsight this **wasn't necessary** — the actual problem was that the original service (before it got deleted and recreated) had a corrupted build-cache lineage: every GitHub-triggered build kept silently reusing a stale `install` layer regardless of changes to `railpack.json`, `package.json`, or even adding a dedicated cache-busting file wired into the step's declared inputs. `NO_CACHE=1` (a commonly-suggested workaround) didn't help either. **Deleting and recreating the service** (`railway service delete` → `railway add --repo ... --branch main --service ...`) was what actually fixed it — a clean service with zero build history worked immediately with nothing but the plain `packageManager` field, no custom `railpack.json` needed.

Also hit a real Railpack schema quirk along the way if this ever needs revisiting: overriding the `install` step specifically (a reserved/special step name) rejects `{"local": true, ...}` inputs at runtime ("`install` inputs must be an image or step input") even though `https://schema.railpack.com` lists `local` as a generally valid input type for steps. Untested whether a differently-named custom step avoids this.

## Not yet done

- **Cron job**: `vercel.json`'s cron (`/api/cron/update-exhibition-tags`, nightly) has no Railway equivalent set up. Railway has its own Cron Jobs feature (separate from a web service) — needs configuring if this trial becomes the real deployment target.
- **Branch isolation**: currently deploys from `main`, same as production Vercel. Fine for a pricing/experience trial; would want a dedicated branch (or to just decommission one platform) before this is anything more than that.
- **Real usage numbers**: no real traffic yet — the whole point of this trial was to get actual cost data instead of estimates. Check Railway's usage dashboard after a few days of real traffic before deciding.

## Alternatives still to evaluate

- **Fly.io** — next one to pilot. Also runs `next start` as a real persistent process (no adapter risk), pay-as-you-go with no monthly minimum, can place the VM in a Paris region specifically (relevant for an EU/French audience). Realistic small prod setup estimated ~$10-20/month in the earlier cost comparison, untested in practice.
- Railway's own reliability track record is a real factor to weigh, not just cost: at least 5 major incidents since Nov 2025, including an 8-hour full-platform outage in May 2026 (GCP account suspension, control plane + DB + dashboard all down). Hobby/Pro tiers only get uptime *targets*, not contractual SLAs. Worth comparing Fly.io's incident history the same way before deciding between them.
