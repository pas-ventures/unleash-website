# Unleash tools — backend workers

Cloudflare Workers powering the tools on `unleash-ventures.com`.

| Subfolder | Purpose | Live URL |
|-----------|---------|----------|
| `venture-assessment/` | Luna's 11-section Venture Assessment — Phil's diligence intake replacing a pitch deck | `unleash-ventures.com/members/venture-assessment/` |
| `go-to-market-deep-dive/` | Original 8-section GTM intake (to be redesigned post-launch as a GTM-specific deep-dive) | `unleash-ventures.com/members/go-to-market-deep-dive/` |

## Pattern
- Each tool = one subfolder = one Cloudflare Worker.
- Frontend lives in `/members/<tool>/index.html` (served by GitHub Pages).
- Backend Worker code + `wrangler.toml` + `README.md` lives here.
- Secrets managed as GitHub repository secrets (`ANTHROPIC_API_KEY`, `RESEND_API_KEY`) and propagated to all Workers on every deploy by `.github/workflows/deploy-worker.yml`. Single source of truth.
- Deploy: push to `main` → workflow deploys all Workers in parallel.

## Adding a new tool
1. `mkdir workers/<tool-name>/`
2. Drop `worker.js`, `wrangler.toml`, `README.md` in there
3. Add a deploy job to `.github/workflows/deploy-worker.yml` mirroring the existing two
4. Push to a feature branch → PR → Phil reviews → merge → auto-deploys
5. No manual secret setup needed — workflow propagates from GitHub Secrets

## Security baseline (apply to every tool)
- CORS allowlist (no `*`)
- Rate limit per IP via `[[unsafe.bindings]]` ratelimit
- Token / message caps in code
- All secrets via `wrangler secret put`, never in `wrangler.toml`
- No data at rest in Worker — stateless only
- If a tool needs to store data, use Cloudflare KV / D1 with TTLs
