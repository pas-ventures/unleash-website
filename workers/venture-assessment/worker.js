// Luna Venture Assessment Worker
// Powers Luna at unleash-ventures.com/venture-assessment
// Env vars (set via: wrangler secret put ANTHROPIC_API_KEY / RESEND_API_KEY):
//   ANTHROPIC_API_KEY — starts with sk-ant-...
//   RESEND_API_KEY — starts with re_...

const SYSTEM_PROMPT = `You are Luna, the AI venture intake for Unleash Ventures (a South Africa-based venture vehicle led by Phil and Nicolene, focused on early- and growth-stage founders). You guide founders through an 11-section intake that gives the Unleash team a clear picture of the venture — substantially lighter than a full due-diligence deck. Phil and Nicolene receive a structured Venture Assessment afterwards and respond within 48 hours.

Depth principle: this is **pitch-level**, not DD. Ask the things a founder would naturally cover in a pitch (rough numbers, customer industry sketch, business model, runway). Do NOT ask for cohort retention, customer-by-customer verbatim quotes, CAC/LTV ratios, funnel conversion rates by stage, or anything that belongs in a follow-up call. If a founder volunteers DD-level detail, accept it gratefully — but never demand it.

# Opening

When the user types any greeting or confirmation ('hi', 'hello', 'start', 'yes', "let's go", 'ready', etc.) — or clicks a starter — open with:

"Welcome — I'm Luna, Unleash Ventures' venture intake. The next 20–25 minutes is going to give Phil, Nicolene, and the team the read they need to be useful to you specifically. The depth of your answers determines the depth of the support you get back — there's no point cutting corners here, this is your shot at landing on the Unleash team's radar with real signal.

A few practical notes before we start:
- There's a **mic button** in the input bar — tap it and just talk. Many founders find it easier to think out loud.
- If you'd rather do this in **German**, just say so anytime — happy to switch.
- This window is private. When you click 'I'm done — send to Unleash team' at the end, we email a full copy of your Venture Assessment to **you, Phil, and Nicolene** — and that's it. We don't store your conversation on our servers.

To kick things off, three quick things:

- Your **first and last name**
- Your **best email**, so we can send you a copy of everything when we're done
- Your **company name**"

Wait for Contact Info before starting Section 1. If any of name / email / company is missing or clearly nonsensical, kindly ask once more for clarity.

# Contact Info (mandatory)

Required before Section 1:
- First name + last name
- Best email address
- Company name

# Formatting umbrella questions (CRITICAL — applies everywhere)

When an umbrella question has more than one sub-ask, ALWAYS present the sub-asks as a markdown bulleted list — one bullet per sub-ask. Never run multiple sub-asks together as comma-separated prose. The frontend renders \`- \` lines as proper bullets, so this is what the founder reads:

GOOD:
- Who is your customer?
- What problem are you solving?
- What stage are you at?

BAD (do NOT do this):
"Tell me who your customer is, what problem you're solving, and what stage you're at."

Same rule for forced follow-ups and push-back asks — if you're asking more than one thing, bullet them. A one-question ask stays as a single line.

# Message structure: TWO-BUBBLE PATTERN (CRITICAL)

When you reply to a founder's answer, structure your message in TWO PARTS, separated by a line containing only \`---\`. The frontend renders each part as a distinct chat bubble, so the founder sees confirmation and next-step as separate visual blocks.

PART 1 — Confirmation (ONE short sentence, max):
- A brief, specific acknowledgement that you heard them.
- Refer to ONE specific thing they said — don't restate everything.
- Examples:
  - "Got it — clarity tooling for early-stage SA founders."
  - "Clear — solo founder, Nicolene as Head of Research."
  - "Crisp."
  - "Got it, that's clear."
  - "Nice — concrete wedge."
- NEVER paraphrase or summarise their whole answer back to them. The founder knows what they said.

\`---\` (literal three dashes on their own line)

PART 2 — Next ask:
- The actual next move: push-back, forced follow-up, or section signpost + new umbrella.
- If it's a new section: include the "Okay — **Section X of 11: [name]**." line and the bulleted umbrella in this part.
- If it's a push-back or forced follow-up: just that question.

EXAMPLE:

  Got it — clarity tooling for early-stage SA founders.

  ---

  One light one to ground this — **can you point us to a couple of examples?** Even just a few customer or prospect websites, or a description of the kind of company (industry + size) you've been talking to.

EXCEPTIONS (do NOT use the \`---\` separator):
- The very first opening message (Welcome + contact info ask). Single bubble is fine.
- The final structured Venture Assessment (the full markdown). Single bubble.
- The one-line send prompt after the assessment.

If you ever produce a message that doesn't need a confirmation (e.g., the contact-info reply, or a clarification request), just emit the next ask without Part 1 and no \`---\` — single bubble.

# 11-section flow

After contact info, announce each section before asking its umbrella question. Format:

"Okay — **Section X of 11: [name]**. [why-this-matters in one short sentence.]"

Then leave a blank line and ask the umbrella question (bulleted per the rule above).

The "Section X of 11" string is mandatory — the frontend parses it to drive the progress bar.

Section purpose framings (use these one-liners verbatim or rephrase lightly):
- §1: "Quick snapshot so we know what we're talking about."
- §2: "Founders is where we read first — track record and chemistry matter more than people admit."
- §3: "The clearer your read on the customer, the better the help you'll get back."
- §4: "What you've built and why it's actually different."
- §5: "Market size + competitive position — who you actually fight."
- §6: "Where the rubber meets the road — what's real today."
- §7: "Economics decide whether this is a business or a project."
- §8: "GTM plan to the next milestone — what gets you there."
- §9: "Roadmap + moat — what compounds over time."
- §10: "If you're raising — the round and what it buys."
- §11: "Risks + what you actually want from us. The most useful section."

# The 11 sections — umbrella questions and forced follow-ups

## Section 1 of 11: Company Snapshot
Umbrella: "Give me the elevator basics:

- Who is your customer?
- What problem are you solving for them?
- What category / industry does it sit in? (B2B SaaS, fintech, marketplace, real estate, edtech, etc.)
- What stage are you at? (idea → design partners → paying pilots → paying customers → scaling)
- Current MRR or ARR, if any.
- Are you currently raising? If yes, how much are you looking to raise?

(Don't worry about instrument or timing — we'll get to that in §10.)"

**Forced follow-up — ALWAYS ask, even if briefly covered:** "One I always come back to — **why now?** What's changed in the last 24 months (tech, regulation, customer behaviour, capital) that makes this work today and wouldn't have worked 3 years ago?"

## Section 2 of 11: Founders & Origin Story
Umbrella: "Tell us about your team:

- Names, roles, and what each person owns (product / tech / sales-GTM / ops)
- The relevant track record each brings to this market (previous startups, exits, deep domain experience)
- Origin story in 2–4 sentences — how did you discover this problem, and why is your team the right one to solve it?

(Solo founder? Just tell us about you and we'll keep moving.)"

**Forced follow-up — ALWAYS ask:** "Quick one on chemistry — it matters more than people admit:

- How long have you known each other?
- How did you meet?
- Have you worked together in person before, or is this the first time?

(If you're a solo founder, just say so and we'll move on.)"

## Section 3 of 11: Customer & Problem
Umbrella: "Paint us a picture of your customer:

- Who are they? (industry, type of company, rough size — e.g. solo founders in SA, mid-market SaaS, family-run hotels in the Western Cape)
- What's the core problem you solve for them?
- Are they already paying for some workaround today (other tools, agencies, manual workarounds)?
- How urgent is this for them — nice-to-have, or top of their list?"

**Forced follow-up — ALWAYS ask:** "One light one to ground this — **can you point us to a couple of examples?** Even just a few customer or prospect websites, or a description of the kind of company (industry + size) you've been talking to. We just want to picture who's actually buying."

## Section 4 of 11: Product & Value Proposition
Umbrella: "Tell us about the product — in plain language, no marketing speak:

- What problem does it solve?
- How is it used? (the actual day-to-day — what does the user do with it)
- Who is the user? (not the buyer — the person actually opening the product)
- How is it different from existing alternatives out there?"

**Forced follow-up — ALWAYS ask:** "And one we love asking: **what do you understand about this market that incumbents and other startups in your space don't?** Doesn't have to be revolutionary — just genuinely yours."

## Section 5 of 11: Market & Competitive Landscape
Umbrella: "Sizing this in customers, not in TAM/SAM math:

- How many potential customers like the ones you serve are out there? (rough — country, region, or globally, your sense)
- How many of those are you actually planning to approach in the next 12 months?
- Who else is solving this (or adjacent problems), and how are you different from them?
- **Your first 10 customers** — who are they (names or types), and why those? (Got fewer than 10 in mind? Tell us who you'd start with.)"

(No forced follow-up. Light push-back only if 'first 10 customers' comes back hand-wavy.)

## Section 6 of 11: Traction & PMF Evidence
Umbrella: "What's real today — the snapshot:

- How many customers / pilots / active users (rough numbers are fine)?
- Revenue, if any — current MRR or ARR?
- One or two qualitative signals that things are working — a customer quote, a big win, repeat usage, inbound demand, anything that surprised you."

(No forced follow-up. Stage-aware: if pre-revenue, just say so.)

## Section 7 of 11: Business Model & Economics
Umbrella: "The economics — rough numbers are fine, we just want the shape:

- How do you make money? (subscription, per-seat, per-use, license, marketplace fee, services, etc.)
- Annual contract value (ACV) — what does a typical customer pay you over a year?
- Cost to acquire a customer (CAC) — what does it cost you, roughly, to land one?
- Customer lifetime — how long does a customer typically stay with you (or your best estimate at maturity)?
- What drives your cost the most? (infra, people, sales, support, data, something else)"

(Stage-aware: if pre-revenue, give us your best hypothesis and we'll note it as such. No forced follow-up.)

## Section 8 of 11: GTM Plan to Next Major Milestone
Umbrella: "The next leg of the journey:

- What's your target milestone for the next 12–18 months? (e.g. €1m ARR, 100 paying customers, regional launch — whatever's meaningful)
- Which channels are core or becoming core? (outbound, inbound, partnerships, community, events, PLG)
- Which ICP / geo / use case are you prioritising to get there?"

(No forced follow-up.)

## Section 9 of 11: Product Roadmap & Defensibility
Umbrella: "Where the product is going, and what makes it stick:

- 12–18 month roadmap at a high level — key themes or big releases (not a feature list)
- Your moat — what gets harder to copy as you scale? (data, workflows, ecosystem, brand, switching costs, community)
- Adjacent expansions after the beachhead — which markets / customer types could you logically grow into, and in what order?"

(No forced follow-up.)

## Section 10 of 11: Fundraising & Use of Funds
Umbrella: "If you're raising:

- Round details — how much, instrument if known (equity / SAFE / CLA), and how long it buys you in runway
- Existing investors and capital raised so far (funds, angels, strategic backers — names are fine if you're comfortable)
- The concrete milestones you'll hit with this round (ARR, product, team, market entry)
- Planned key hires for the next 12–18 months — roles, seniority, why they matter"

(If you're not raising right now, just say so and tell us when you expect to next.)

## Section 11 of 11: Biggest Risks & How We Can Help
Umbrella: "Home stretch — and the most useful section for both sides:

- Your top 2–3 risks as YOU see them (product, GTM, market timing, regulation, hiring, funding environment). Be honest, not pitchy.
- Where support would be most valuable from us — GTM design, sales process, pricing, fundraising strategy, hiring, intros, something else?
- Anything else we should know — context, constraints, or ambitions that didn't fit above (e.g. founder lifestyle vs. 'go for broke' path)."

(No forced follow-up.)

# Push-back rules (Level 2 — collaborative, not interrogative)

After each umbrella answer (and after each forced follow-up):
- **If the answer covers most of the umbrella with usable detail**: accept warmly and move on. Vary your acknowledgements — examples: "Got it, that's clear." / "Helpful — I've got what I need." / "Nice, clean answer." / "Crisp, thanks." Never robotic ("Section X done. Moving on."). The founder put effort in — meet them.
- **If the answer is genuinely vague, one-liner, or cut-corner on a critical point**: ask ONCE in a collaborative tone. Examples: "Worth nailing this one — could you give me a concrete example of X?" / "Help me get specific on Y — even a rough number works." / "One more pull on this thread — what does Z look like in practice?" Never frame it as failure ("you didn't answer X").
- **Never push back more than once per section.** If the founder dodges twice, accept and continue.
- **Never add opinions, coaching frames, or "most founders at your stage..." framing.** Pure intake — but warm.
- **Read founder's energy.** If they're typing short / fast / say "let's move on" — stop pushing back at all and just collect.

Threshold for push-back: answer is functionally useless for diligence, NOT "could be more polished." Aim for a fast 20–25 min total, not a 45-min interview.

# Stage-aware skip pattern

If a founder says "we're pre-product / we don't have ARR / we haven't tested this yet" for stage-appropriate questions — accept it, note in the transcript as "founder flagged as not yet known at current stage", and move on. Do not push back on stage-inappropriate questions.

**Exception:** The 4 forced follow-ups (§1 why-now, §2 founder relationship, §3 last-5-customers, §4 founder-insight) ALWAYS apply regardless of stage. Even pre-product founders should know why-now, how they met, who they've talked to, and what they understand that others don't.

# Per-section progress signposts (substance + energy, never just mechanical)

After every section is complete, close with a short signpost that does TWO things:
1. **Acknowledges what specifically landed** — one phrase about what was strong or memorable in the founder's answers (the wedge customer, the why-now, the founder-insight, the chemistry story, etc.). This is the difference between feeling heard and feeling graded.
2. **Marks energy on the journey** — especially at quarter / half / three-quarter / final-stretch milestones.

Always include the explicit "Section X of 11" string — the frontend parses this for the progress bar.

Examples (vary tone and substance — don't repeat the same phrasing):
- "✅ Section 1 of 11 done — clear category and stage, and a sharp why-now. Next: Founders & Origin Story."
- "✅ Section 3 of 11 done — your read on the customer is genuinely specific, that came through. Next: Product & Value Prop."
- "🎯 You're at Section 5 of 11 — halfway there. The wedge segment you just named is the kind of focus investors look for. Onward: Traction & PMF."
- "🙌 Section 9 of 11 done. Two sections to go — home stretch. Roadmap is sharper than most at your stage. Next: Fundraising."
- "🌟 Section 10 done — last one. Section 11 is the most useful section for both sides: risks and how we can actually help."

Tone rules:
- Real, specific acknowledgement — never generic ("great answer", "perfect"). Refer to something the founder actually said.
- Energy markers should land like a coach, not a referee.
- Vary phrasing — never repeat the same opener two sections in a row.

# Final wrap-up (preview is MANDATORY before send)

After Section 11 is complete, say:

"Thank you — that was real depth across 11 sections. Phil and Nicolene get a proper read on the venture from this.

🌟 All 11 done. Before you send anything, let me lay out the full Venture Assessment so you can see exactly what's about to go to Phil, Nicolene, and your own inbox. Give me one second."

Then, WITHOUT waiting for the founder to confirm, immediately produce the full structured Venture Assessment in markdown (using the format below). The founder MUST see the assessment in this chat before they click 'I'm done — send to Unleash team'. This is not optional — it's a trust step.

Output the full structured Venture Assessment in markdown:

## [Company Name] — Venture Assessment

### Contact
- Founder: [Name]
- Email: [Email]
- Company: [Name]
- Submitted: [today's date]

### Section 1 — Company Snapshot
[Founder's verbatim answers from §1 + the why-now answer, lightly polished for grammar and organisation only]

### Section 2 — Founders & Origin Story
[Verbatim, including the founder-relationship answer]

### Section 3 — Customer & Problem
[Verbatim, including the last-5-customers answer]

### Section 4 — Product & Value Proposition
[Verbatim, including the founder-insight answer]

### Section 5 — Market & Competitive Landscape

### Section 6 — Traction & PMF Evidence

### Section 7 — Business Model & Economics

### Section 8 — GTM Plan to Next Major Milestone

### Section 9 — Product Roadmap & Defensibility

### Section 10 — Fundraising & Use of Funds

### Section 11 — Biggest Risks & How We Can Help

Maintain the founder's voice. Do NOT summarise, merge, or compress. Polish lightly for grammar and organisation only. If a section was answered as "not yet known at current stage", include that note verbatim — it's useful diligence signal.

After showing the assessment, end with one line:

"Read through it — if anything needs a tweak, just tell me. Otherwise click **'I'm done — send to Unleash team'** below and it goes to Phil, Nicolene, and your own inbox. They'll be in touch within 48 hours."

If the founder requests changes, apply them and re-output the corrected assessment. Then close again with the same one-line send prompt. Do NOT add commentary beyond that.`;

// CORS allowlist — only these origins can call the Worker
const ALLOWED_ORIGINS = [
  'https://unleash-ventures.com',
  'https://www.unleash-ventures.com',
  'http://localhost:8080',  // for local dev / testing
  'http://localhost:5500',
];

// Token / message caps to prevent runaway cost
const MAX_MESSAGES = 80;             // hard ceiling on conversation length
const MAX_INPUT_CHARS = 200000;      // ~50K tokens estimate (4 chars per token)

function getCorsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function isOriginAllowed(request) {
  const origin = request.headers.get('Origin');
  if (!origin) return false;  // requires Origin header on POST
  return ALLOWED_ORIGINS.includes(origin);
}

function getClientIP(request) {
  return request.headers.get('CF-Connecting-IP') || 'unknown';
}

async function checkRateLimit(env, ip, kind) {
  // Use Cloudflare's Rate Limiting binding if available; otherwise no-op (fail-open).
  if (!env.RATE_LIMITER) return { success: true };
  try {
    return await env.RATE_LIMITER.limit({ key: `${kind}:${ip}` });
  } catch (e) {
    console.error('Rate limit check failed:', e);
    return { success: true }; // fail-open if binding misbehaves
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const corsHeaders = { ...getCorsHeaders(origin), 'Content-Type': 'application/json' };

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders(origin) });
    }

    // Health check — no auth needed
    if (url.pathname === '/' || url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', service: 'luna-venture-assessment' }), {
        headers: corsHeaders,
      });
    }

    // Resend webhook — server-to-server, no CORS check (Resend signs requests).
    // Set up at resend.com → Webhooks → endpoint: https://luna-venture-assessment.pas-bf6.workers.dev/webhook/resend
    // Events to subscribe: email.sent, email.delivered, email.delivery_delayed, email.bounced, email.complained
    if (url.pathname === '/webhook/resend' && request.method === 'POST') {
      return await handleResendWebhook(request, env);
    }

    // Status polling — frontend calls GET /api/status/<submissionId> to learn delivery state.
    // Allowed-origin lockdown applies (same as /api/done).
    if (url.pathname.startsWith('/api/status/') && request.method === 'GET') {
      if (!isOriginAllowed(request)) {
        return new Response(JSON.stringify({ error: 'Forbidden — origin not allowed' }), {
          status: 403, headers: corsHeaders,
        });
      }
      const submissionId = url.pathname.slice('/api/status/'.length);
      return await handleStatusLookup(submissionId, env, corsHeaders);
    }

    // All other endpoints require allowed origin (CORS lockdown)
    if (!isOriginAllowed(request)) {
      return new Response(JSON.stringify({ error: 'Forbidden — origin not allowed' }), {
        status: 403, headers: corsHeaders,
      });
    }

    const ip = getClientIP(request);

    try {
      if (url.pathname === '/api/chat' && request.method === 'POST') {
        // Rate limit: 20 req/min per IP for chat
        const rl = await checkRateLimit(env, ip, 'chat');
        if (!rl.success) {
          return new Response(JSON.stringify({ error: 'Too many requests — please slow down' }), {
            status: 429, headers: corsHeaders,
          });
        }

        const { messages } = await request.json();
        if (!Array.isArray(messages)) {
          return new Response(JSON.stringify({ error: 'messages must be an array' }), {
            status: 400, headers: corsHeaders,
          });
        }

        // Token / message caps
        if (messages.length > MAX_MESSAGES) {
          return new Response(JSON.stringify({ error: 'Conversation has reached its maximum length. Please click "I\'m done" to send to the team.' }), {
            status: 413, headers: corsHeaders,
          });
        }
        const totalChars = messages.reduce((sum, m) => sum + (m.content || '').length, 0);
        if (totalChars > MAX_INPUT_CHARS) {
          return new Response(JSON.stringify({ error: 'Conversation has reached its maximum length. Please click "I\'m done" to send to the team.' }), {
            status: 413, headers: corsHeaders,
          });
        }

        const reply = await callClaude(messages, env.ANTHROPIC_API_KEY, { model: 'claude-haiku-4-5-20251001', maxTokens: 1024 });
        return new Response(JSON.stringify({ reply }), { headers: corsHeaders });
      }

      if (url.pathname === '/api/done' && request.method === 'POST') {
        // Rate limit: 5 done-submissions per day per IP (stricter window)
        const rl = await checkRateLimit(env, ip, 'done');
        if (!rl.success) {
          return new Response(JSON.stringify({ error: 'Daily submission limit reached. Please contact pas@pas-ventures.com directly.' }), {
            status: 429, headers: corsHeaders,
          });
        }

        const { messages, founderName, founderEmail, companyName, preGeneratedSummary } = await request.json();
        if (!Array.isArray(messages) || messages.length === 0) {
          return new Response(JSON.stringify({ error: 'messages required' }), {
            status: 400, headers: corsHeaders,
          });
        }
        const todayISO = new Date().toISOString().slice(0, 10);

        // Generate submission ID FIRST — persisted record exists even if every downstream step fails.
        const submissionId = generateSubmissionId();
        const createdAt = new Date().toISOString();

        // Raw transcript of the founder's actual answers — the ultimate fallback copy.
        const transcript = messages
          .map((m) => `${m.role === 'assistant' ? 'Luna' : 'Founder'}: ${typeof m.content === 'string' ? m.content : JSON.stringify(m.content)}`)
          .join('\n\n');

        // PERSIST RAW FIRST — before summary generation or email, both of which can fail.
        // The founder's answers are saved server-side the instant they submit, no matter
        // what breaks downstream (this is the core "never lose their input" guarantee).
        const submissionRecord = {
          submissionId,
          status: 'received',       // received → queued → sent → delivered (or failed/bounced)
          founderName: founderName || 'Unknown Founder',
          founderEmail: founderEmail || 'unknown',
          companyName: companyName || 'Unknown Company',
          transcript,               // raw conversation — always present, the copy-paste fallback
          summary: null,            // filled in after generation below
          messageCount: messages.length,
          ip,
          createdAt,
          updatedAt: createdAt,
          deliveryEvents: [],       // appended to by /webhook/resend
        };
        await persistSubmission(env, submissionRecord);

        // Generate the structured summary. If the AI step fails, degrade gracefully
        // to the raw transcript so the email + the founder's screen still carry their content.
        let summary;
        let summaryFailed = false;
        try {
        if (preGeneratedSummary && typeof preGeneratedSummary === 'string' && preGeneratedSummary.length > 200) {
          summary = preGeneratedSummary;
        } else {
          const summaryMessages = [
            ...messages,
            {
              role: 'user',
              content: `[Today's date is ${todayISO}. Use this exact ISO date in the "Submitted" field.]

Please now produce the structured Venture Assessment to send to the Unleash team. CRITICAL RULES:

1. **ALWAYS produce the assessment.** Do NOT refuse, do NOT say "we haven't completed the intake," do NOT ask to continue. The founder has clicked "I'm done" — they want what they have, even if partial. Generate the assessment with whatever info exists in our conversation above.

2. **Format:** markdown with clear section headers matching the 11 intake sections in order:
   - Company Snapshot
   - Founders & Origin Story
   - Customer & Problem
   - Product & Value Proposition
   - Market & Competitive Landscape
   - Traction & PMF Evidence
   - Business Model & Economics
   - GTM Plan to Next Major Milestone
   - Product Roadmap & Defensibility
   - Fundraising & Use of Funds
   - Biggest Risks & How We Can Help

   Preceded by a Contact section that includes Submitted: ${todayISO}.

3. **For sections that WERE covered in our conversation:** include the founder's voice verbatim where they gave specific answers. Do not summarise, merge, or compress. Polish lightly for organisation and grammar only. Include the forced follow-up answers (why-now in §1, founder relationship in §2, customer examples in §3, founder-insight in §4) within their respective sections if asked and answered.

4. **For sections that were NOT reached in our conversation (the founder ended early):** include the section header anyway, with the text: *"Not yet covered — founder ended the intake before reaching this section."* in italics. Do this for every missing section so the structure stays whole.

5. **For sections where the founder said "not yet known at current stage":** include that note verbatim.

6. **No commentary, no preamble, no "here's your assessment".** Output the assessment markdown directly, starting with the company name as h2.`,
            },
          ];
          summary = await callClaude(summaryMessages, env.ANTHROPIC_API_KEY, { model: 'claude-sonnet-4-5-20250929', maxTokens: 2048 });
        }
        } catch (e) {
          summaryFailed = true;
          console.error('Summary generation failed; falling back to raw transcript:', e);
        }

        // Graceful fallback: if the AI summary is missing/too short, use the raw transcript
        // so the email and the founder's on-screen copy still contain their full answers.
        if (!summary || typeof summary !== 'string' || summary.length < 20) {
          summaryFailed = true;
          summary = `## ${submissionRecord.companyName} — Venture Assessment (raw intake)\n\n_The automated summary could not be generated, so the founder's raw intake is included below. Submitted: ${todayISO}._\n\n${transcript}`;
        }

        // Update the persisted record with the summary (or fallback) before emailing.
        submissionRecord.summary = summary;
        submissionRecord.summaryFailed = summaryFailed;
        submissionRecord.status = 'queued';      // queued → sent → delivered (or bounced/failed)
        submissionRecord.updatedAt = new Date().toISOString();
        await persistSubmission(env, submissionRecord);

        // Now attempt the email.
        let resendId = null;
        let resendError = null;
        try {
          const resendResponse = await emailSummary({
            summary,
            founderName: submissionRecord.founderName,
            founderEmail: submissionRecord.founderEmail,
            companyName: submissionRecord.companyName,
            submissionId,
            resendKey: env.RESEND_API_KEY,
          });
          resendId = resendResponse && resendResponse.id ? resendResponse.id : null;
        } catch (e) {
          resendError = e.message;
          console.error('Resend send failed:', e);
        }

        // Update the persisted record with send result.
        submissionRecord.status = resendError ? 'failed' : 'sent';
        submissionRecord.resendId = resendId;
        submissionRecord.resendError = resendError;
        submissionRecord.updatedAt = new Date().toISOString();
        await persistSubmission(env, submissionRecord);

        // Mirror to the Notion founder table — fire-and-forget AFTER the response is sent.
        // Wrapped so a Notion outage can never block, slow, or break the founder flow or the KV record.
        ctx.waitUntil(mirrorToNotion(env, submissionRecord));

        // Log for observability (visible in Cloudflare Workers Logs dashboard)
        console.log(JSON.stringify({
          event: 'submission',
          submissionId,
          resendId,
          status: submissionRecord.status,
          ip,
          founderName: submissionRecord.founderName,
          founderEmail: submissionRecord.founderEmail,
          companyName: submissionRecord.companyName,
          messageCount: messages.length,
          timestamp: createdAt,
        }));

        // If Resend failed, the submission is persisted but email didn't go.
        // Return success: false so the frontend tells the founder honestly.
        if (resendError) {
          return new Response(JSON.stringify({
            success: false,
            submissionId,
            status: 'failed',
            error: 'Email delivery service rejected the send. Your assessment is safely stored — Phil will reach out.',
          }), { status: 502, headers: corsHeaders });
        }

        return new Response(JSON.stringify({
          success: true,
          submissionId,
          status: 'sent',          // Resend accepted; webhook will upgrade to 'delivered' when confirmed
          summary,                 // returned so frontend doesn't have to keep its copy
        }), { headers: corsHeaders });
      }

      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: corsHeaders });
    } catch (err) {
      console.error('Worker error:', err);
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
    }
  },
};

async function callClaude(messages, apiKey, options = {}) {
  // Conversational turns default to Haiku 4.5 (fast); the final assessment passes Sonnet for quality.
  const model = options.model || 'claude-haiku-4-5-20251001';
  const maxTokens = options.maxTokens || 1024;
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      // Prompt caching: mark the system prompt as cacheable so subsequent
      // turns in the same conversation reuse it at $0.30/M instead of $3/M.
      // 5-min ephemeral TTL fits the natural cadence of a 20-min intake.
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: messages,
    }),
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${errText}`);
  }
  const data = await response.json();
  if (!data || !Array.isArray(data.content) || !data.content[0] || typeof data.content[0].text !== 'string') {
    throw new Error('Anthropic returned an unexpected/empty response');
  }
  return data.content[0].text;
}

async function emailSummary({ summary, founderName, founderEmail, companyName, submissionId, resendKey }) {
  const isValidEmail = (e) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e);
  const founderHasEmail = isValidEmail(founderEmail);

  const subject = founderHasEmail
    ? `Your Venture Assessment — ${founderName} (${companyName})`
    : `New Venture Assessment — ${founderName} (${companyName})`;

  // Render markdown → HTML for proper email formatting
  const renderedSummary = markdownToHtml(summary);

  const intro = founderHasEmail
    ? `<p style="font-size: 15px; color: #444; margin-bottom: 24px;">Hi ${escapeHtml(founderName.split(' ')[0])},<br><br>Here's your complete Venture Assessment from your conversation with Luna. Phil and Nicolene at Unleash have also received this and will be in touch.</p>`
    : `<p style="font-size: 15px; color: #444; margin-bottom: 24px;">A new Venture Assessment has been submitted via unleash-ventures.com/members/venture-assessment.</p>`;

  const htmlBody = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family: Helvetica, Arial, sans-serif; max-width: 720px; margin: 0 auto; padding: 24px; color: #1a1a1a; line-height: 1.6;">
<div style="border-bottom: 3px solid #FF6B35; padding-bottom: 14px; margin-bottom: 28px;">
  <div style="font-family: Helvetica, Arial, sans-serif; font-size: 12px; color: #FF6B35; letter-spacing: 2px; text-transform: uppercase; font-weight: 700; margin-bottom: 6px;">UNLEASH · Venture Assessment</div>
  <h1 style="font-family: Helvetica, Arial, sans-serif; font-size: 26px; margin: 0; color: #1a1a1a;">Venture Assessment</h1>
</div>
${intro}
<div style="background: #fafafa; border: 1px solid #eee; border-radius: 8px; padding: 16px 20px; margin-bottom: 28px;">
  <table cellpadding="3" style="font-size: 14px;">
    <tr><td style="color: #666; padding-right: 12px;"><strong>Founder:</strong></td><td>${escapeHtml(founderName)}</td></tr>
    <tr><td style="color: #666; padding-right: 12px;"><strong>Email:</strong></td><td>${escapeHtml(founderEmail)}</td></tr>
    <tr><td style="color: #666; padding-right: 12px;"><strong>Company:</strong></td><td>${escapeHtml(companyName)}</td></tr>
    <tr><td style="color: #666; padding-right: 12px;"><strong>Submitted:</strong></td><td>${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Johannesburg', dateStyle: 'medium', timeStyle: 'short' })} SAST</td></tr>
  </table>
</div>
<div style="font-size: 15px; line-height: 1.7;">${renderedSummary}</div>
<hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;">
<p style="font-size: 12px; color: #999; margin-top: 16px;">Generated by Luna at <a href="https://unleash-ventures.com" style="color: #FF6B35;">unleash-ventures.com</a></p>
</body></html>`;

  // Multi-recipient logic
  const recipients = founderHasEmail
    ? { to: [founderEmail], cc: ['pas@pas-ventures.com', 'nicolene@pas-ventures.com'] }
    : { to: ['pas@pas-ventures.com'], cc: ['nicolene@pas-ventures.com'] };

  // Tag the email with the submissionId so the Resend webhook can look it up.
  // Resend headers: X-Entity-Ref-ID is also visible on every event; tags are queryable on the dashboard.
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Unleash Ventures <luna@mail.unleash-ventures.com>',
      to: recipients.to,
      cc: recipients.cc,
      subject: subject,
      html: htmlBody,
      text: summary,
      headers: submissionId ? { 'X-Submission-ID': submissionId } : undefined,
      tags: submissionId ? [{ name: 'submission_id', value: submissionId }] : undefined,
    }),
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Resend API error ${response.status}: ${errText}`);
  }
  return await response.json();
}

// ============ Submission persistence (KV) ============
// Every /api/done call writes here BEFORE the email goes. Webhook updates the record
// with delivery state. Frontend polls /api/status/<id> to learn current state.

function generateSubmissionId() {
  // Format: sub_<unix-seconds>_<6-char-random>. Sortable + readable + collision-resistant enough.
  const ts = Math.floor(Date.now() / 1000).toString(36);
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(4)))
    .map(b => b.toString(36).padStart(2, '0'))
    .join('')
    .slice(0, 6);
  return `sub_${ts}_${rand}`;
}

async function persistSubmission(env, record) {
  if (!env.SUBMISSIONS_KV) {
    console.warn('SUBMISSIONS_KV binding missing — submission not persisted:', record.submissionId);
    return;
  }
  try {
    // 90-day TTL — plenty of time for follow-up but not forever.
    await env.SUBMISSIONS_KV.put(record.submissionId, JSON.stringify(record), {
      expirationTtl: 60 * 60 * 24 * 90,
    });
  } catch (e) {
    console.error('KV write failed for', record.submissionId, e);
  }
}

async function readSubmission(env, submissionId) {
  if (!env.SUBMISSIONS_KV) return null;
  try {
    const raw = await env.SUBMISSIONS_KV.get(submissionId);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('KV read failed for', submissionId, e);
    return null;
  }
}

// ============ Notion mirror ============
// Writes each submission as a row in the "Venture Assessments" Notion DB: founder identity +
// the 11 assessment sections parsed into columns + the full assessment in the page body.
// Best-effort + fully isolated — any failure is logged and swallowed, never affecting the founder.

const NOTION_SECTION_MAP = [
  { col: '1. Company Snapshot', keys: ['company snapshot'] },
  { col: '2. Founders & Origin', keys: ['founders & origin', 'founders and origin', 'origin story', 'founders'] },
  { col: '3. Customer & Problem', keys: ['customer & problem', 'customer and problem'] },
  { col: '4. Product & Value Prop', keys: ['product & value', 'product and value', 'value proposition'] },
  { col: '5. Market & Competition', keys: ['market & competitive', 'market and competitive', 'competitive landscape', 'market &'] },
  { col: '6. Traction & PMF', keys: ['traction', 'pmf'] },
  { col: '7. Business Model', keys: ['business model', 'economics'] },
  { col: '8. GTM Plan', keys: ['gtm plan', 'go-to-market', 'go to market', 'gtm'] },
  { col: '9. Roadmap & Defensibility', keys: ['roadmap', 'defensibility'] },
  { col: '10. Fundraising & Use of Funds', keys: ['fundraising', 'use of funds'] },
  { col: '11. Risks & How We Help', keys: ['risks', 'how we can help', 'how we help'] },
];

function parseAssessmentSections(summary) {
  // Split markdown on ## / ### headers, map each block to one of the 11 sections by keyword.
  // Best-effort: unmatched sections are simply skipped (full text is always in the page body).
  const out = {};
  if (!summary || typeof summary !== 'string') return out;
  let current = null;
  let buf = [];
  const flush = () => {
    if (current !== null) {
      const hl = current.toLowerCase();
      const m = NOTION_SECTION_MAP.find(s => s.keys.some(k => hl.includes(k)));
      if (m && !out[m.col]) out[m.col] = buf.join('\n').trim().slice(0, 1900);
    }
    buf = [];
  };
  for (const line of summary.split('\n')) {
    const h = line.match(/^#{2,3}\s+(.*\S)\s*$/);
    if (h) { flush(); current = h[1]; }
    else { buf.push(line); }
  }
  flush();
  return out;
}

function notionText(content) {
  return [{ type: 'text', text: { content: String(content || '').slice(0, 1900) } }];
}

async function mirrorToNotion(env, record) {
  if (!env.NOTION_TOKEN || !env.NOTION_DB_ID) {
    console.warn('Notion mirror skipped — NOTION_TOKEN/NOTION_DB_ID not configured');
    return;
  }
  try {
    const sections = parseAssessmentSections(record.summary);
    const props = {
      'Company': { title: notionText(record.companyName || 'Unknown Company') },
      'Founder': { rich_text: notionText(record.founderName || 'Unknown Founder') },
      'Status': { select: { name: record.status || 'received' } },
      'Submitted': { date: { start: record.createdAt } },
      'Submission ID': { rich_text: notionText(record.submissionId) },
      'Messages': { number: record.messageCount || 0 },
      'Summary Failed': { checkbox: !!record.summaryFailed },
    };
    if (record.founderEmail && record.founderEmail.includes('@')) {
      props['Email'] = { email: record.founderEmail };
    }
    for (const { col } of NOTION_SECTION_MAP) {
      if (sections[col]) props[col] = { rich_text: notionText(sections[col]) };
    }
    // Body: the full assessment, chunked into <=1900-char paragraph blocks (Notion limits).
    const bodyText = record.summary || record.transcript || '(no content captured)';
    const children = [];
    for (let i = 0; i < bodyText.length && children.length < 95; i += 1900) {
      children.push({
        object: 'block', type: 'paragraph',
        paragraph: { rich_text: [{ type: 'text', text: { content: bodyText.slice(i, i + 1900) } }] },
      });
    }
    const resp = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ parent: { database_id: env.NOTION_DB_ID }, properties: props, children }),
    });
    if (!resp.ok) {
      console.error('Notion mirror failed:', resp.status, (await resp.text()).slice(0, 400));
    } else {
      console.log('Notion mirror ok:', record.submissionId);
    }
  } catch (e) {
    console.error('Notion mirror error for', record.submissionId, e);
  }
}

async function handleStatusLookup(submissionId, env, corsHeaders) {
  if (!submissionId || !/^sub_[a-z0-9_]+$/i.test(submissionId)) {
    return new Response(JSON.stringify({ error: 'Invalid submission id' }), {
      status: 400, headers: corsHeaders,
    });
  }
  const record = await readSubmission(env, submissionId);
  if (!record) {
    return new Response(JSON.stringify({ error: 'Not found', status: 'unknown' }), {
      status: 404, headers: corsHeaders,
    });
  }
  // Return only the public-safe slice. No summary content, no IP, no Resend internals.
  return new Response(JSON.stringify({
    submissionId: record.submissionId,
    status: record.status,                            // queued | sent | delivered | bounced | complained | failed
    deliveryEvents: record.deliveryEvents || [],
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  }), { headers: corsHeaders });
}

// ============ Resend webhook handler ============
// Resend POSTs JSON like: { type: 'email.delivered', created_at, data: { email_id, tags: [...], to, ... } }
// We look up our submission by the submission_id tag and update its status.

async function handleResendWebhook(request, env) {
  const headers = { 'Content-Type': 'application/json' };

  // Verify signature when secret is configured. (Resend uses svix-style headers.)
  // We accept unsigned webhooks only if no secret is set, to ease initial setup.
  const secret = env.RESEND_WEBHOOK_SECRET;
  const rawBody = await request.text();
  if (secret) {
    const verified = await verifyResendWebhook(request, rawBody, secret);
    if (!verified) {
      console.warn('Resend webhook signature verification failed');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 401, headers });
    }
  }

  let payload;
  try { payload = JSON.parse(rawBody); }
  catch { return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers }); }

  const eventType = payload && payload.type;
  const data = payload && payload.data;
  if (!eventType || !data) {
    return new Response(JSON.stringify({ ok: true, ignored: 'missing-type-or-data' }), { headers });
  }

  // Resend includes our tags array. Find the submission_id tag we set in emailSummary.
  let submissionId = null;
  if (Array.isArray(data.tags)) {
    const tag = data.tags.find(t => t && t.name === 'submission_id');
    if (tag) submissionId = tag.value;
  }
  if (!submissionId) {
    // Older sends without tags — log + bail.
    console.log('Resend webhook with no submission_id tag:', eventType);
    return new Response(JSON.stringify({ ok: true, ignored: 'no-submission-id' }), { headers });
  }

  const record = await readSubmission(env, submissionId);
  if (!record) {
    console.warn('Resend webhook for unknown submission:', submissionId);
    return new Response(JSON.stringify({ ok: true, ignored: 'unknown-submission' }), { headers });
  }

  // Append the event + update status if this is a state transition we care about.
  record.deliveryEvents = record.deliveryEvents || [];
  record.deliveryEvents.push({ type: eventType, at: payload.created_at || new Date().toISOString() });
  record.updatedAt = new Date().toISOString();

  // Status priority: failure states override; delivered wins over sent; sent wins over queued.
  const statusFromEvent = ({
    'email.sent': 'sent',
    'email.delivered': 'delivered',
    'email.delivery_delayed': 'delayed',
    'email.bounced': 'bounced',
    'email.complained': 'complained',
  })[eventType];
  if (statusFromEvent) {
    const PRIORITY = { queued: 0, sent: 1, delayed: 2, delivered: 3, bounced: 4, complained: 5, failed: 6 };
    if ((PRIORITY[statusFromEvent] || 0) > (PRIORITY[record.status] || 0) || ['bounced', 'complained', 'failed'].includes(statusFromEvent)) {
      record.status = statusFromEvent;
    }
  }

  await persistSubmission(env, record);

  // Surface bounces / complaints in the logs so Phil sees them in Cloudflare dashboard.
  if (['bounced', 'complained'].includes(statusFromEvent)) {
    console.error(JSON.stringify({
      event: 'delivery-failure',
      type: eventType,
      submissionId,
      founderEmail: record.founderEmail,
      data,
    }));
  }

  return new Response(JSON.stringify({ ok: true, submissionId, status: record.status }), { headers });
}

// Resend uses svix-style signed webhooks: headers `svix-id`, `svix-timestamp`, `svix-signature`.
// We verify: HMAC-SHA256("{svix-id}.{svix-timestamp}.{rawBody}", secret) base64-encoded.
async function verifyResendWebhook(request, rawBody, secret) {
  try {
    const svixId = request.headers.get('svix-id');
    const svixTs = request.headers.get('svix-timestamp');
    const svixSig = request.headers.get('svix-signature');
    if (!svixId || !svixTs || !svixSig) return false;

    // Reject events older than 5 minutes to prevent replay.
    const tsSec = parseInt(svixTs, 10);
    if (!Number.isFinite(tsSec) || Math.abs(Date.now() / 1000 - tsSec) > 300) return false;

    // Resend secrets are prefixed with `whsec_` and the rest is base64. Strip the prefix before decoding.
    const cleanedSecret = secret.startsWith('whsec_') ? secret.slice(6) : secret;
    const keyBytes = Uint8Array.from(atob(cleanedSecret), c => c.charCodeAt(0));
    const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const signed = `${svixId}.${svixTs}.${rawBody}`;
    const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signed));
    const computed = btoa(String.fromCharCode(...new Uint8Array(sigBuf)));

    // svix-signature header is space-separated list of `v1,<sig>` pairs — accept if ANY matches.
    return svixSig.split(' ').some(part => {
      const [, sig] = part.split(',');
      return sig === computed;
    });
  } catch (e) {
    console.error('Webhook signature verification crashed:', e);
    return false;
  }
}

// Lightweight markdown → HTML converter for email rendering
// Handles: headers (# / ## / ###), bold, italic, bullet lists, paragraphs
function markdownToHtml(md) {
  if (!md) return '';
  // Normalise line endings
  let html = md.replace(/\r\n/g, '\n');

  // Escape HTML chars first (so we don't double-escape after replacements)
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Headers (in order — longest first)
  html = html.replace(/^### (.+)$/gm, '<h3 style="font-family: Helvetica, Arial, sans-serif; font-size: 16px; color: #1a1a1a; margin: 22px 0 10px 0; font-weight: 700;">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 style="font-family: Helvetica, Arial, sans-serif; font-size: 19px; color: #FF6B35; margin: 28px 0 12px 0; font-weight: 700; padding-bottom: 4px; border-bottom: 1px solid #f0f0f0;">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 style="font-family: Helvetica, Arial, sans-serif; font-size: 24px; color: #1a1a1a; margin: 30px 0 14px 0; font-weight: 700;">$1</h1>');

  // Bold + italic
  html = html.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>');

  // Bullet lists — group consecutive "- " lines into <ul>
  html = html.replace(/(^- .+(\n- .+)*)/gm, function (block) {
    const items = block.split('\n').map(line => line.replace(/^- (.+)$/, '<li style="margin: 4px 0;">$1</li>')).join('');
    return '<ul style="margin: 10px 0 14px 0; padding-left: 22px;">' + items + '</ul>';
  });

  // Paragraphs — wrap remaining non-tag lines in <p>
  // Split by double-newline first; lines that aren't already HTML tags wrap in <p>
  html = html.split(/\n\n+/).map(block => {
    block = block.trim();
    if (!block) return '';
    // If block already starts with an HTML tag, leave it alone
    if (/^<(h[1-6]|ul|ol|li|p|div|blockquote|hr)/i.test(block)) return block;
    // Otherwise convert single newlines to <br> and wrap in <p>
    return '<p style="margin: 0 0 14px 0;">' + block.replace(/\n/g, '<br>') + '</p>';
  }).join('\n');

  return html;
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
