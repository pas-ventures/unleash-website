# Luna Go-to-Market Deep Dive — Cloudflare Worker

Backend for the founder-facing chat at `unleash-ventures.com/members/go-to-market-deep-dive/`.

This is the **original 8-section GTM intake** (formerly the content at `/members/venture-assessment/`). The venture-assessment URL now hosts the new 11-section Venture Assessment instead. This GTM Deep Dive is a more specialized follow-up tool, intended for founders who've already completed the Venture Assessment and want to go deeper on go-to-market mechanics. Phil plans to redesign this prompt in a future iteration to drop early-stage questions and go harder on GTM specifics.

## Live URL
`https://luna-go-to-market-deep-dive.pas-bf6.workers.dev`

## Architecture

```
unleash-ventures.com/members/go-to-market-deep-dive/
  │
  │ POST /api/chat          → Anthropic Claude Sonnet 4.5
  │ POST /api/done          → Anthropic (final summary) + Resend (email)
  │
  ▼
Cloudflare Worker (this folder)
  │
  ├─ Anthropic API   (ANTHROPIC_API_KEY env)
  └─ Resend API      (RESEND_API_KEY env)
       │
       ├─ TO:  founder
       ├─ CC:  pas@pas-ventures.com
       └─ CC:  nicolene@pas-ventures.com
```

## Files
| File | Purpose |
|------|---------|
| `worker.js` | All request handling, system prompt (8-section GTM flow), email rendering |
| `wrangler.toml` | Worker config + rate limit binding |

## Secrets (managed via GitHub Secrets → propagated by deploy workflow)
| Name | Source |
|------|--------|
| `ANTHROPIC_API_KEY` | console.anthropic.com → API keys |
| `RESEND_API_KEY` | resend.com → API keys |

These live as GitHub repository secrets and are propagated to the Worker on every deploy via `.github/workflows/deploy-worker.yml`. No manual `wrangler secret put` step required.

## Deploy

Push to `main` → GitHub Action auto-deploys this folder.

## Rate limits
- 20 chat requests / minute / IP
- `MAX_MESSAGES = 80` per conversation
- `MAX_INPUT_CHARS = 200000` per request

## Future redesign
Phil flagged this tool for redesign post-launch — once the Venture Assessment is the primary intake, the GTM Deep Dive should skip "who are you / what stage" questions (covered upstream) and go deep on GTM specifics: channels, conversion math, ICP refinement, sales process design.
