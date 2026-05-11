# Unleash tools — backend workers

Cloudflare Workers powering the tools on `unleash-ventures.com`.

| Subfolder | Purpose | Live URL |
|-----------|---------|----------|
| `venture-assessment/` | Luna chatbot that runs the 8-section venture intake | `unleash-ventures.com/members/venture-assessment/` |

## Pattern
- Each tool = one subfolder = one Cloudflare Worker.
- Frontend lives in `/members/<tool>/index.html` (served by GitHub Pages).
- Backend Worker code + `wrangler.toml` + `README.md` lives here.
- Secrets in Cloudflare (never in repo).
- Deploy: push to `main` → `.github/workflows/deploy-worker.yml` auto-deploys changed subfolder.

## Adding a new tool
1. `mkdir workers/<tool-name>/`
2. Drop `worker.js`, `wrangler.toml`, `README.md` in there
3. Add a deploy job to `.github/workflows/deploy-worker.yml` (or copy the existing one)
4. Set secrets via `wrangler secret put` from the subfolder
5. Push — Cloudflare Worker appears

## Security baseline (apply to every tool)
- CORS allowlist (no `*`)
- Rate limit per IP via `[[unsafe.bindings]]` ratelimit
- Token / message caps in code
- All secrets via `wrangler secret put`, never in `wrangler.toml`
- No data at rest in Worker — stateless only
- If a tool needs to store data, use Cloudflare KV / D1 with TTLs
