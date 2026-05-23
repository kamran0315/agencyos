/**
 * AI helper — placeholder for OpenAI integration.
 *
 * To go live:
 *   1. npm i openai
 *   2. Set OPENAI_API_KEY in .env
 *   3. Swap the mock branches below for real `openai.chat.completions.create(...)` calls.
 */

const OPENAI_KEY = process.env.OPENAI_API_KEY;

export type AITool = "proposal" | "summarize" | "breakdown";

export async function runAI(tool: AITool, input: string): Promise<string> {
  if (!OPENAI_KEY) return mockResponse(tool, input);

  // Real implementation placeholder. Uncomment after `npm i openai` and add this file's deps.
  // const { default: OpenAI } = await import("openai");
  // const openai = new OpenAI({ apiKey: OPENAI_KEY });
  // const { choices } = await openai.chat.completions.create({
  //   model: "gpt-4o-mini",
  //   messages: [
  //     { role: "system", content: SYSTEM_PROMPTS[tool] },
  //     { role: "user", content: input },
  //   ],
  //   temperature: 0.7,
  // });
  // return choices[0]?.message?.content ?? "";

  return mockResponse(tool, input);
}

function mockResponse(tool: AITool, input: string): string {
  switch (tool) {
    case "proposal":
      return [
        `Hi there,`,
        ``,
        `Your post mentions: ${input.slice(0, 120).trim()}…`,
        ``,
        `I've delivered exactly this kind of scope for ~30 SaaS and agency teams. A few quick thoughts:`,
        `• I'd start with a 30-min discovery to lock down the must-haves.`,
        `• Typical turnaround for this scope is 2–4 weeks.`,
        `• My approach: ship a working v1 in week 1, then iterate.`,
        ``,
        `If that resonates, here's a 15-min call link: {{cal_link}}`,
        ``,
        `Best,`,
        `{{your_name}}`,
        ``,
        `— Demo mode. Set OPENAI_API_KEY to generate real proposals.`,
      ].join("\n");

    case "summarize":
      return [
        `**Requirements summary**`,
        ``,
        `1. Core deliverable: ${input.slice(0, 80).trim()}…`,
        `2. Must-haves: clearly defined acceptance criteria, mobile-responsive, SEO-friendly.`,
        `3. Nice-to-haves: analytics dashboard, A/B testing capability.`,
        `4. Constraints: budget, timeline, brand guidelines.`,
        `5. Open questions: hosting preferences, content source, integrations.`,
        ``,
        `— Demo mode. Set OPENAI_API_KEY to summarize real requirements.`,
      ].join("\n");

    case "breakdown":
      return [
        `**Suggested task breakdown**`,
        ``,
        `Phase 1 — Discovery`,
        `  □ Kickoff call + requirements doc`,
        `  □ Set up shared drive and project board`,
        ``,
        `Phase 2 — Design`,
        `  □ Wireframes for key flows`,
        `  □ Visual design + component library`,
        ``,
        `Phase 3 — Build`,
        `  □ Scaffold project + repo`,
        `  □ Implement screens`,
        `  □ Wire up integrations`,
        ``,
        `Phase 4 — Launch`,
        `  □ QA pass + cross-browser testing`,
        `  □ Deploy to production`,
        `  □ Handoff documentation`,
        ``,
        `— Demo mode. Set OPENAI_API_KEY to generate real task lists.`,
      ].join("\n");
  }
}
