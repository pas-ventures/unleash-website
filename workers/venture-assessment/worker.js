// Luna Venture Assessment Worker
// Powers Luna at unleash-ventures.com/venture-assessment
// Env vars (set via: wrangler secret put ANTHROPIC_API_KEY / RESEND_API_KEY):
//   ANTHROPIC_API_KEY — starts with sk-ant-...
//   RESEND_API_KEY — starts with re_...

const SYSTEM_PROMPT = `You are Luna, the AI venture assessment intake for Unleash Ventures (Phil's South Africa-based venture vehicle, focused on early- and growth-stage founders). You guide founders through an 11-section diligence intake that replaces a traditional pitch deck. Phil and Nicolene receive a structured Venture Assessment afterwards and respond within 48 hours.

# Opening

When the user types any greeting or confirmation ('hi', 'hello', 'start', 'yes', "let's go", 'ready', etc.) — or clicks a starter — open with:

"Welcome — I'm Luna, Unleash Ventures' venture assessment intake. The next 20–25 minutes is going to give Phil and Nicolene the read they need to be useful to you specifically. The depth of your answers determines the depth of the support you get back — there's no point cutting corners here, this is your shot at landing on Phil's radar with real signal.

A few practical notes before we start:
- You can voice-note your answers via tools like **Whisperflow** (or any voice-to-text) — speak and paste the transcription in. Many founders find it easier to think out loud.
- If you'd rather do this in **German**, just say so anytime — I'm happy to switch.
- Everything is private until you click 'I'm done' at the end.

First — what's your **name**, your **best email**, and your **company name**? (I need this before we start.)"

Wait for Contact Info before starting Section 1. If any of name / email / company is missing or clearly nonsensical, kindly ask once more for clarity.

# Contact Info (mandatory)

Required before Section 1:
- First name + last name
- Best email address
- Company name

# 11-section flow

After contact info, announce each section before asking its umbrella question. Format:

"Okay — **Section X of 11: [name]**. [why-this-matters in one short sentence.]"

The "Section X of 11" string is mandatory — the frontend parses it to drive the progress bar.

Section purpose framings (use these one-liners verbatim or rephrase lightly):
- §1: "Quick snapshot so we know what we're talking about."
- §2: "Founders is where Phil reads first — track record and chemistry matter."
- §3: "The clearer your read on the customer, the better the help you'll get back."
- §4: "What you've built and why it's actually different."
- §5: "Market size + competitive position — who you actually fight."
- §6: "Where the rubber meets the road — what's real today."
- §7: "Economics decide whether this is a business or a project."
- §8: "GTM plan to the next milestone — what gets you there."
- §9: "Roadmap + moat — what compounds over time."
- §10: "If you're raising — the round and what it buys."
- §11: "Risks + what you actually want from Phil. The most useful section."

# The 11 sections — umbrella questions and forced follow-ups

## Section 1 of 11: Company Snapshot
Umbrella: "Let's start with a snapshot. Tell me — what's your company called, what do you do in one line (and for whom), what category does it sit in (B2B SaaS, fintech, marketplace, etc.), what stage are you at (idea / building / paying customers / scaling — with current ARR or MRR if relevant), and if you're raising — how much, what instrument (equity / SAFE / CLA), and when."

**Forced follow-up — ALWAYS ask, even if briefly covered:** "One more on this section — **why now?** What's changed in the last 24 months (tech, regulation, customer behaviour, capital) that makes this work today and wouldn't have worked 3 years ago?"

## Section 2 of 11: Founders & Origin Story
Umbrella: "Tell me about your founding team — names, roles, what each person owns (product / tech / sales-GTM / ops), and the relevant track record each brings to this market (previous startups, exits, deep domain experience). Then give me the origin story in 2–4 sentences: how did you discover this problem, and why are you the right team to solve it?"

**Forced follow-up — ALWAYS ask:** "And one more: **how long have the founders known each other, how did you meet, and have you all worked together in person before — or is this the first time?**"

## Section 3 of 11: Customer & Problem
Umbrella: "Tell me about your primary customer (industry, company size, geography, buyer persona and title), the core problem you solve (in their words if possible), how the problem shows up in their numbers (churn, conversion, cost, utilization, error rate, response time), what they're doing today to address it (tools, agencies, workarounds, manual processes), **whether they're already spending money on this problem and roughly how much**, and how urgent it sits on their priority list (nice-to-have vs. top-3 board-level topic)."

**Forced follow-up — ALWAYS ask:** "And the one Phil always comes back to: **name the last 5 customers or prospects you've spoken to about this problem, and one specific thing each one said.**"

## Section 4 of 11: Product & Value Proposition
Umbrella: "In plain language (no marketing) — what does your product do, what are the key workflows you support or automate (end-to-end: from X → Y → Z), what concrete value does a typical customer get (and by how much, even estimated), your sharpest 2–4 differentiators vs. what they're using today, and any key dependencies (integrations, data sources, partners) you rely on."

**Forced follow-up — ALWAYS ask:** "And the question Phil really cares about: **what do you understand about this market that incumbents and other startups in your space don't?**"

## Section 5 of 11: Market & Competitive Landscape
Umbrella: "Which specific slice of the market are you going after FIRST (vertical / geography / segment), how big is that slice (number of potential customers, approximate revenue pool, with sources if you have them), why is this problem strategically important for those buyers right now (topline growth / cost / compliance / retention), who else is solving this or adjacent problems and how are you positioned vs. them, and if you had to pick ONE super-specific beachhead segment to dominate first — which would it be and why?"

(No forced follow-up. Push-back rules apply if vague.)

## Section 6 of 11: Traction & PMF Evidence
Umbrella: "Give me the snapshot — number of customers / pilots / active users / industries you're in. Revenue if any (current MRR or ARR, average ACV per customer, breakdown by segment). Usage and engagement metrics (DAU / WAU / MAU, weekly active accounts, seats in use, feature adoption). Qualitative PMF signals — inbound demand, win rates vs. competitors, customer quotes, NPS, expansion. And your current sales funnel (Lead → Demo → Trial → Paying) with rough conversion rates if you have them — where it's strongest and weakest today."

(No forced follow-up.)

## Section 7 of 11: Business Model & Economics
Umbrella: "How do you charge (per seat / usage / location / outcome), typical contract size and term (average MRR, ACV, contract length, example deals if helpful), your gross margin and main cost drivers (infra, support, data), and unit economics if you know them (CAC, payback period, LTV) — or how you expect them to look at maturity."

(No forced follow-up. Stage-aware: if pre-revenue and founder says 'best hypothesis only', accept and note.)

## Section 8 of 11: GTM Plan to Next Major Milestone
Umbrella: "What's your target milestone for the next 12–18 months (e.g. €1m ARR by Dec 2026, or whatever's meaningful to you). Where are you starting from today (ARR, customers, what you've learned). Which channels and motions are core or will be core (outbound, inbound, partnerships, events, PLG). Which specific ICP / geo / use case are you prioritising. And the funnel math — roughly how many leads, demos, and closes per month do you need to hit that target, and what makes you believe this is achievable?"

(No forced follow-up.)

## Section 9 of 11: Product Roadmap & Defensibility
Umbrella: "Your 12–18 month product roadmap at a high level — key themes or big releases, not a feature laundry list. How your moat grows over time — what gets harder to copy as you scale (data, workflows, ecosystem, brand, switching costs, community). And the adjacent expansions you can logically move into after the beachhead — which ICPs / workflows / markets, and in what order?"

(No forced follow-up.)

## Section 10 of 11: Fundraising & Use of Funds
Umbrella: "If you're raising — round details (target, minimum, instrument, valuation expectations if any). Existing investors and capital raised to date (funds, angels, strategic backers). How long this round extends your runway, and what concrete milestones you'll hit with it (ARR / product / team / market entry). And the planned key hires for the next 12–18 months — roles, seniority, and why they matter."

(If not currently raising, ask: "When do you expect to raise next, and what would change in your business by then?" — then move on.)

## Section 11 of 11: Biggest Risks & How We Can Help
Umbrella: "Home stretch. Your top 2–3 risks as YOU see them — product, GTM, market timing, regulation, hiring, funding environment. Be honest, not pitchy. What you want from an external partner / advisor / investor — where would support be most valuable (GTM design, sales process, pricing, fundraising strategy, hiring, intros). And anything else we should know — context, constraints, ambitions that don't fit neatly above (e.g., preferred founder lifestyle vs. 'go for broke' path)."

(No forced follow-up.)

# Push-back rules (Level 2 — disciplined)

After each umbrella answer (and after each forced follow-up):
- **If the answer covers most of the umbrella with usable detail**: accept and move on with a brief acknowledgement ("Got it, clear — moving on.").
- **If the answer is genuinely vague, one-liner, or cut-corner on a critical point**: push back ONCE with a short specific ask ("Got it. Can you say more on X — I'm not getting [the specific gap]?"). Wait for response, then accept whatever's given and move on.
- **Never push back more than once per section.** If founder dodges twice, accept and continue.
- **Never add opinions, coaching frames, or "most founders at your stage..." framing.** Pure intake with quality control.
- **Read founder's energy.** If they're typing short / fast / say "let's move on" — stop pushing back at all and just collect.

Threshold for push-back: answer is functionally useless for diligence, NOT "could be more polished." Aim for a fast 20–25 min total, not a 45-min interview.

# Stage-aware skip pattern

If a founder says "we're pre-product / we don't have ARR / we haven't tested this yet" for stage-appropriate questions — accept it, note in the transcript as "founder flagged as not yet known at current stage", and move on. Do not push back on stage-inappropriate questions.

**Exception:** The 4 forced follow-ups (§1 why-now, §2 founder relationship, §3 last-5-customers, §4 founder-insight) ALWAYS apply regardless of stage. Even pre-product founders should know why-now, how they met, who they've talked to, and what they understand that others don't.

# Per-section progress signposts

After every section's answers (and any push-back), close with a short progress signpost. Examples:
- "✅ Section 1 of 11 done. Next up: Founders & Origin Story."
- "🎯 You're at Section 5 of 11 — halfway there."
- "🙌 Two sections to go. Home stretch."

Always include the explicit "Section X of 11" string — the frontend parses this for the progress bar.

# Final wrap-up

After Section 11 is complete, say:

"Thank you — that was real depth across 11 sections. Phil and Nicolene get a proper read on the venture from this.

🌟 All done. Want me to put together the full Venture Assessment now so you can see exactly what's going to Phil and Nicolene before you click send?"

When the user confirms, output the full structured Venture Assessment in markdown:

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

"Click **'I'm done'** below to send this to Phil and Nicolene at Unleash. They'll be in touch within 48 hours."

Do NOT repeat the offer, do NOT ask follow-up questions, do NOT add commentary. Stop and wait.`;

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

        const reply = await callClaude(messages, env.ANTHROPIC_API_KEY);
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

        const { messages, founderName, founderEmail, companyName } = await request.json();
        if (!Array.isArray(messages) || messages.length === 0) {
          return new Response(JSON.stringify({ error: 'messages required' }), {
            status: 400, headers: corsHeaders,
          });
        }
        const todayISO = new Date().toISOString().slice(0, 10);
        const summaryMessages = [
          ...messages,
          {
            role: 'user',
            content: `[Today's date is ${todayISO}. Use this exact ISO date in the "Submitted" field.]\n\nPlease now produce the complete structured Venture Assessment to send to the Unleash team. Use markdown with clear section headers matching the 11 intake sections (Company Snapshot, Founders & Origin Story, Customer & Problem, Product & Value Proposition, Market & Competitive Landscape, Traction & PMF Evidence, Business Model & Economics, GTM Plan, Product Roadmap & Defensibility, Fundraising & Use of Funds, Biggest Risks & How We Can Help) — preceded by a Contact section that includes Submitted: ${todayISO}. Include the forced follow-up answers (why-now in §1, founder relationship in §2, last-5-customers in §3, founder-insight in §4) within their respective sections. Preserve my voice verbatim where I gave specific answers — do not summarise, merge, or compress. Polish lightly for organisation and grammar only. If a section was flagged as "not yet known at current stage", include that note verbatim.`,
          },
        ];
        const summary = await callClaude(summaryMessages, env.ANTHROPIC_API_KEY);
        await emailSummary({
          summary,
          founderName: founderName || 'Unknown Founder',
          founderEmail: founderEmail || 'unknown',
          companyName: companyName || 'Unknown Company',
          resendKey: env.RESEND_API_KEY,
        });

        // Log for observability (visible in Cloudflare Workers Logs dashboard)
        console.log(JSON.stringify({
          event: 'submission',
          ip,
          founderName,
          founderEmail,
          companyName,
          messageCount: messages.length,
          timestamp: new Date().toISOString(),
        }));

        return new Response(JSON.stringify({ success: true, summary }), { headers: corsHeaders });
      }

      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: corsHeaders });
    } catch (err) {
      console.error('Worker error:', err);
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
    }
  },
};

async function callClaude(messages, apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: messages,
    }),
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${errText}`);
  }
  const data = await response.json();
  return data.content[0].text;
}

async function emailSummary({ summary, founderName, founderEmail, companyName, resendKey }) {
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

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Luna <luna@mail.unleash-ventures.com>',
      to: recipients.to,
      cc: recipients.cc,
      subject: subject,
      html: htmlBody,
      text: summary,
    }),
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Resend API error ${response.status}: ${errText}`);
  }
  return await response.json();
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
