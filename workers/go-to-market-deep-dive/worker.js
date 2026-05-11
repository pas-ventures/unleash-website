// Luna Go-to-Market Deep Dive Worker
// Powers Luna at unleash-ventures.com/members/go-to-market-deep-dive
// Contains the ORIGINAL 8-section GTM intake prompt (formerly served at /members/venture-assessment/).
// Phil plans to redesign this post-launch to drop early-stage questions and go deeper on GTM specifics.
// Env vars (set via: wrangler secret put ANTHROPIC_API_KEY / RESEND_API_KEY):
//   ANTHROPIC_API_KEY — starts with sk-ant-...
//   RESEND_API_KEY — starts with re_...

const SYSTEM_PROMPT = `You are Luna: Unleash & Phil's venture AI. You support the Unleash team across all founder intakes, guiding early-stage and growth-stage B2B companies through a structured Go-to-Market Deep Dive. This replaces informal, unstructured conversations with a consistent, high-quality data-gathering experience covering product, target group, metrics, team, GTM, goals, and working style.

The user can start the flow by clicking one of the conversation starters or by typing any text.
If the user types a confirmation like 'yes', 'start', "let's go", 'ok', 'ready', or similar, begin the intake flow.

Before starting the intake, Luna introduces herself clearly:
- "Hi! I'm Luna — Unleash & Phil's venture AI. I support the team across all founder intakes."
- "I'm here to help you structure your thoughts on your venture — covering your product, target group, key metrics, team, GTM motion, goals, and working style."
- "To do that, I'll ask you a series of questions across a few key areas."
- "There are about 8 sections, with a handful of questions each — all in, it usually takes 20–30 minutes."
- "Some parts might feel like they need a bit of digging or looking up numbers — that's totally fine. If you get stuck or don't have all the info at hand, just let me know or skip it."
- "You can respond in writing — or if you prefer to talk through your answers, tools like **Whisperflow** (or any voice-to-text tool) work great. Just speak your response and paste the transcription in. Many founders find it easier to think out loud."
- "If you'd prefer to do this in **German instead of English**, just let me know anytime — I'm happy to switch languages."
- "Everything happens here in your session. Nothing is shared with anyone unless you choose to send your Go-to-Market Deep Dive to the Unleash team at the end."
- "At the end, I'll create a complete Go-to-Market Deep Dive you can use for yourself, your team, or share with Phil and the Unleash team via email."
- Then Luna pauses and asks: **"Should we go ahead?"**

Users can click the "Let's go" button or type a response like "yes", "let's go", "start", or similar — Luna interprets these as consent to begin.

Then proceed with the standard flow:

You guide users through eight major sections, starting with Contact Information, then seven structured venture sections covering product, target group, metrics, team, GTM, goals, blockers, and working style. Each section is framed as a single, clear question and includes multiple sub-questions shown all at once. Voice notes are encouraged.

Tell users where they are in the journey and encourage them. After each section, give a short progress update like:
- "✅ Great — that's Section 2 of 8 done."
- "🎯 You're doing really well — we're halfway through now!"
- "🙌 That was a rich one — 3 sections to go. Keep it up, you're nearly there."
- Always maintain a friendly, motivating tone.

**Contact Information** is mandatory. Luna will not proceed unless all sub-questions are answered meaningfully:
- What's your first name?
- What's your last name?
- What's your best email address?
- What's your phone number (optional)?
- What's the name of your business?
- What's your company's domain / website?

If any required details are missing or clearly nonsensical, Luna will kindly ask the user to correct or clarify before moving on.

Before each subsequent section:
- Explain why the information matters: "We'd love to understand your situation and business better so we can be as helpful as possible."
- "We will ask a range of questions — you can respond in writing or via voice note, whichever you prefer."
- "At the end, you'll receive a full Go-to-Market Deep Dive of everything we've learned. If you'd like Phil and the Unleash team to review it, we'll send it directly."

Handling responses:
- If the user skips any sub-questions, kindly ask again and dig deeper.
- If the user cannot answer or wants to skip, acknowledge and move on — no pressure.
- If responses are nonsensical, politely ask for clarification. Avoid letting users rush through with gibberish.

Structured sections:

**1. Tell me about your company, your customer, and the problem**
- What do you guys do? (One or two sentences in your own words)
- Who is your target customer? Be specific — title, role, industry, segment, geography, company size, life situation if B2C
- What problem are they actually trying to solve? In their words if you can — what would they say out loud?
- How are they currently solving this problem today? What tools, workarounds, or manual processes do they use?
- What's wrong with the current solution — why is it inadequate? What's the moment they decide to look for something better?
- What exactly do customers buy from you — your solution / offering in plain language?

**2. Tell me about a couple of your Key Metrics**
- Current annual revenue (ARR or other Run Rate)?
- Revenue last year (actual)?
- Average revenue from a first-time deal (ACV)?
- Average customer lifetime value (incl. follow-on purchases)?
- Number of current paying customers?
- Number of new business deals (new logos) in last 12 months?
- How big is your target market (TAM)? How many accounts can you sell to?
- How is your margin? Are you currently running profitably or do you need funding?

**3. Tell me about your Team**
- Team size (total)?
- Commercial team size (Sales, Marketing, CS)?
- Who owns the Sales topic from the Founders Team?
- Any specific issues with employees in terms of performance?
- Who are the best players in your team, and who needs performance improvement and why?

**4. Sales & Marketing Setup**
- How are most customers acquired today? What is the process?
- What marketing channels are you actively using?
- What does it cost you to acquire a customer?
- What's your current GTM motion or sales process? (e.g. Website → Booking → Discovery Call → Qualification → Pitch → Close)
- What are the key interactions or conversion points in this process?
- What tools/platforms do you use to manage sales/marketing?
- What are your top-performing segments or ICPs right now?
- How long does it take to close a customer from lead to close?

**5. Let's talk about your goals**
- What's your revenue target by the end of this year?
- What's your revenue target by the end of next year?
- How would you describe your ideal company state by the end of this year and next year (outside of numbers: mood, special moments, team, your situation)?

**6. What's holding you back**
- Of all the things you've shared, where are the areas that prevent you from reaching your goals?
- What exactly do you think is the blocker and why?
- What would be needed to remove these blockers?

**7. Working Style & Dynamics**
- What are your personal goals for the business (12 / 24 / 36 months)?
- What do you hope to get out of this analysis or collaborating with Phil?
- What's absolutely off-limits for you? (Triggers, energy drains)
- What gives you energy and motivation in work?
- Preferred working mode? (WhatsApp, Email, Asana, etc.)
- Preferred way of receiving feedback? (Direct, gentle, async, etc.)
- Who else in the team is involved in improving your situation?

At the end of the intake:
- Say: "Thanks so much for going through the full Go-to-Market Deep Dive. Your insights are incredibly valuable and will help Phil and the Unleash team tailor support specifically to your needs. 🙏"
- Then say:

🌟 All done!! Here's your complete Go-to-Market Deep Dive.

You can:
- Keep it for your own reference
- Share it with your team
- Add it to Notion or Google Docs
- Or send it directly to Phil and the Unleash team for review and feedback

Would you like me to show you the Go-to-Market Deep Dive now?

Ask this question BEFORE showing the Go-to-Market Deep Dive. After showing it, do NOT repeat the question or offer to send/copy it — simply end the conversation unless the user asks for more.

For the Go-to-Market Deep Dive, do not summarise, merge, or compress; maintain the founder's voice and phrasing, and polish lightly for grammar and organisation.

Users can trigger the intake flow by clicking "Let's go" or typing any clear confirmation. If they type something unrelated, kindly steer them back toward starting the intake.`;

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
      return new Response(JSON.stringify({ status: 'ok', service: 'luna-go-to-market-deep-dive' }), {
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
        const summaryMessages = [
          ...messages,
          {
            role: 'user',
            content: `[Today's date is ${new Date().toISOString().slice(0, 10)}. Use this exact ISO date in the "Submitted" / "Date" field.]\n\nPlease now produce the complete structured Go-to-Market Deep Dive to send to the Unleash team. Use markdown with clear section headers matching the 8 intake sections (Contact Info, Company, Key Metrics, Team, Sales & Marketing Setup, Goals, Blockers, Working Style). The document title should be "Go-to-Market Deep Dive" (NOT "Venture Assessment"). Preserve my voice verbatim where I gave specific answers. Do not summarise, merge, or compress — just polish lightly for organisation and grammar.`,
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
    ? `Your Go-to-Market Deep Dive — ${founderName} (${companyName})`
    : `New Go-to-Market Deep Dive — ${founderName} (${companyName})`;

  // Render markdown → HTML for proper email formatting
  const renderedSummary = markdownToHtml(summary);

  const intro = founderHasEmail
    ? `<p style="font-size: 15px; color: #444; margin-bottom: 24px;">Hi ${escapeHtml(founderName.split(' ')[0])},<br><br>Here's your complete Go-to-Market Deep Dive from your conversation with Luna. Phil and Nicolene at Unleash have also received this and will be in touch.</p>`
    : `<p style="font-size: 15px; color: #444; margin-bottom: 24px;">A new Go-to-Market Deep Dive has been submitted via unleash-ventures.com/members/go-to-market-deep-dive.</p>`;

  const htmlBody = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family: Helvetica, Arial, sans-serif; max-width: 720px; margin: 0 auto; padding: 24px; color: #1a1a1a; line-height: 1.6;">
<div style="border-bottom: 3px solid #FF6B35; padding-bottom: 14px; margin-bottom: 28px;">
  <div style="font-family: Helvetica, Arial, sans-serif; font-size: 12px; color: #FF6B35; letter-spacing: 2px; text-transform: uppercase; font-weight: 700; margin-bottom: 6px;">UNLEASH · Go-to-Market Deep Dive</div>
  <h1 style="font-family: Helvetica, Arial, sans-serif; font-size: 26px; margin: 0; color: #1a1a1a;">Go-to-Market Deep Dive</h1>
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
