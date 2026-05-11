# Luna Venture Assessment — Cloudflare Worker

Backend for the founder-facing chat at `unleash-ventures.com/members/venture-assessment/`.

## What this does
- Receives chat messages from the frontend (`/members/venture-assessment/index.html`)
- Calls Anthropic (Claude Sonnet 4.5) to run Luna's **11-section Venture Assessment** — Phil's diligence intake that replaces a pitch deck. Sections: Company Snapshot · Founders & Origin Story · Customer & Problem · Product & Value Prop · Market & Competition · Traction & PMF · Business Model & Economics · GTM Plan · Roadmap & Defensibility · Fundraising · Biggest Risks & How We Can Help.
- **4 forced follow-ups** baked into the prompt (research-informed against Calacanis / YC / Sequoia frameworks): why-now (§1), founder relationship (§2), last-5-customers-spoken-to (§3), founder-insight (§4).
- **Level 2 push-back:** max one clarifying ask per section when answers are vague or cut-corner. No coaching frames, no opinions — pure intake with quality control.
- On `/api/done`: emails the full structured Venture Assessment to the founder, with Phil and Nicolene on CC.
- Rate-limits per IP and locks CORS to the Unleash domains.

## Live URL
`https://luna-venture-assessment.pas-bf6.workers.dev`

## Architecture

```
Founder browser
  │
  │ password gate (SHA-256, /members/index.html)
  │
  ▼
unleash-ventures.com/members/venture-assessment/
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
| `worker.js` | All request handling, system prompt, email rendering |
| `wrangler.toml` | Worker config + rate limit binding |

## Secrets (set in Cloudflare, NOT in repo)
| Name | Source |
|------|--------|
| `ANTHROPIC_API_KEY` | console.anthropic.com → API keys |
| `RESEND_API_KEY` | resend.com → API keys |

Set with:
```
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put RESEND_API_KEY
```

## Deploy

**Automated (default):** push to `main` → GitHub Action at `.github/workflows/deploy-worker.yml` deploys this folder.

**Manual fallback:**
```
cd workers/venture-assessment
wrangler deploy
```

## Rate limits
- 20 chat requests / minute / IP (Cloudflare ratelimit binding)
- `MAX_MESSAGES = 80` per conversation
- `MAX_INPUT_CHARS = 200000` per request
- `max_tokens = 2048` per Anthropic response

## CORS allowlist
`unleash-ventures.com`, `www.unleash-ventures.com`, `localhost:8080`, `localhost:5500`.

## Version log
| Date | Change |
|------|--------|
| 2026-05-11 | V3 — repurposed from 8-section GTM intake to 11-section Venture Assessment (Phil's diligence framework). 4 research-driven forced follow-ups added (why-now, founder relationship, last-5-customers, founder-insight). Level 2 push-back logic baked into prompt. Progress bar regex updated for "Section X of 11". Old GTM content preserved at `/members/go-to-market-deep-dive/` |
| 2026-05-11 | V2: markdown→HTML email rendering, multi-recipient CC, confirmation modal frontend, progress overlay |
| 2026-05-11 | V1: launched. CORS lockdown, rate limiting, sessionStorage password gate, localStorage 14-day persistence |

## Troubleshooting
- **401 from Anthropic:** rotate key in Cloudflare secrets
- **429 from Anthropic:** retries needed (Phase 2 backlog)
- **403 from Worker:** CORS — request is not from an allowlisted origin
- **429 from Worker:** rate limit (20/min/IP)
- **413 from Worker:** input too long, founder hit `MAX_INPUT_CHARS`
- **Emails not arriving:** check Resend dashboard, verify `from: onboarding@resend.dev` (sandbox) is sending

## Phase 2 backlog
- Replace `onboarding@resend.dev` with verified `luna@mail.unleash-ventures.com`
- Streaming responses (3× faster perceived latency)
- Server-side founder-name extraction
- Cloudflare Turnstile (invisible CAPTCHA)
- Anthropic 429/529 retry with exponential backoff
- Zero Data Retention (ZDR) with Anthropic for GDPR posture
- Privacy policy + GDPR consent on welcome screen
