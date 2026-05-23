import type {
  Client,
  Project,
  Task,
  Note,
  Proposal,
  Notification,
  FileItem,
} from "./types";

const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

export const mockClients: Client[] = [
  {
    id: "c1",
    name: "Sarah Mitchell",
    company: "Brightline Studio",
    email: "sarah@brightline.co",
    phone: "+1 415 555 2210",
    fiverr_url: "https://fiverr.com/brightline",
    upwork_url: "https://upwork.com/freelancers/~brightline",
    website: "https://brightline.co",
    notes: "Prefers async updates. Strong opinions on typography.",
    avatar_url: null,
    created_at: daysFromNow(-92),
  },
  {
    id: "c2",
    name: "Daniel Park",
    company: "Park Capital",
    email: "daniel@parkcapital.io",
    phone: "+1 212 555 9981",
    fiverr_url: null,
    upwork_url: "https://upwork.com/freelancers/~parkcapital",
    website: "https://parkcapital.io",
    notes: "Long-term retainer. Monthly invoicing.",
    avatar_url: null,
    created_at: daysFromNow(-180),
  },
  {
    id: "c3",
    name: "Aisha Khan",
    company: "Noor Cosmetics",
    email: "aisha@noor.beauty",
    phone: "+44 20 7946 0123",
    fiverr_url: "https://fiverr.com/noor",
    upwork_url: null,
    website: "https://noor.beauty",
    notes: "Shopify storefront + custom checkout flow.",
    avatar_url: null,
    created_at: daysFromNow(-45),
  },
  {
    id: "c4",
    name: "Marcus Rivera",
    company: "Rivera Realty Group",
    email: "marcus@riverarealty.com",
    phone: "+1 305 555 4012",
    fiverr_url: null,
    upwork_url: "https://upwork.com/freelancers/~riverarealty",
    website: "https://riverarealty.com",
    notes: "AI lead-qualification bot. Wants Twilio integration.",
    avatar_url: null,
    created_at: daysFromNow(-20),
  },
  {
    id: "c5",
    name: "Hannah Lee",
    company: "Verdant Foods",
    email: "hannah@verdant.co",
    phone: "+1 206 555 7733",
    fiverr_url: "https://fiverr.com/verdant",
    upwork_url: "https://upwork.com/freelancers/~verdant",
    website: "https://verdant.co",
    notes: "Headless Next.js + Sanity rebuild.",
    avatar_url: null,
    created_at: daysFromNow(-10),
  },
];

export const mockProjects: Project[] = [
  {
    id: "p1",
    client_id: "c1",
    title: "Brightline marketing site rebuild",
    description:
      "Migrate WordPress to Next.js + Sanity. Improve Lighthouse scores and add a case-study system.",
    status: "in_progress",
    priority: "high",
    budget: 8400,
    deadline: daysFromNow(9).slice(0, 10),
    progress: 62,
    created_at: daysFromNow(-30),
  },
  {
    id: "p2",
    client_id: "c2",
    title: "Investor portal v2",
    description:
      "Add document vault, quarterly report generation, and SSO via Auth0.",
    status: "revision",
    priority: "urgent",
    budget: 18000,
    deadline: daysFromNow(3).slice(0, 10),
    progress: 88,
    created_at: daysFromNow(-65),
  },
  {
    id: "p3",
    client_id: "c3",
    title: "Noor Shopify custom checkout",
    description: "Custom upsell + bundle logic in checkout.liquid.",
    status: "discussion",
    priority: "medium",
    budget: 4200,
    deadline: daysFromNow(21).slice(0, 10),
    progress: 8,
    created_at: daysFromNow(-7),
  },
  {
    id: "p4",
    client_id: "c4",
    title: "AI lead-qualification bot",
    description:
      "OpenAI + Twilio bot that qualifies inbound leads and books showings via Cal.com.",
    status: "in_progress",
    priority: "high",
    budget: 6800,
    deadline: daysFromNow(14).slice(0, 10),
    progress: 35,
    created_at: daysFromNow(-12),
  },
  {
    id: "p5",
    client_id: "c5",
    title: "Verdant headless rebuild",
    description: "Next.js + Sanity. CMS for recipes, blog, and product pages.",
    status: "waiting_client",
    priority: "medium",
    budget: 11500,
    deadline: daysFromNow(28).slice(0, 10),
    progress: 45,
    created_at: daysFromNow(-22),
  },
  {
    id: "p6",
    client_id: "c2",
    title: "Park Capital monthly retainer — June",
    description: "Ongoing maintenance, perf monitoring, and ad-hoc features.",
    status: "in_progress",
    priority: "low",
    budget: 3500,
    deadline: daysFromNow(18).slice(0, 10),
    progress: 50,
    created_at: daysFromNow(-15),
  },
  {
    id: "p7",
    client_id: "c1",
    title: "Brightline brand microsite",
    description: "Single-page launch microsite for new product line.",
    status: "completed",
    priority: "medium",
    budget: 2200,
    deadline: daysFromNow(-12).slice(0, 10),
    progress: 100,
    created_at: daysFromNow(-60),
  },
];

export const mockTasks: Task[] = [
  // p1 — Brightline
  { id: "t1", project_id: "p1", assignee_id: null, title: "Set up Sanity schema for case studies", description: "Fields: title, hero image, sections, client, tech stack.", status: "done", priority: "medium", due_date: daysFromNow(-5).slice(0,10), position: 0, created_at: daysFromNow(-20) },
  { id: "t2", project_id: "p1", assignee_id: null, title: "Migrate blog posts from WordPress", description: "Use sanity-import and clean up image refs.", status: "done", priority: "medium", due_date: daysFromNow(-3).slice(0,10), position: 1, created_at: daysFromNow(-18) },
  { id: "t3", project_id: "p1", assignee_id: null, title: "Build /case-studies index + detail pages", description: "Static generation with on-demand revalidation.", status: "in_progress", priority: "high", due_date: daysFromNow(2).slice(0,10), position: 0, created_at: daysFromNow(-10) },
  { id: "t4", project_id: "p1", assignee_id: null, title: "Lighthouse audit + image optimization", description: "Target 95+ on all metrics.", status: "in_progress", priority: "medium", due_date: daysFromNow(5).slice(0,10), position: 1, created_at: daysFromNow(-9) },
  { id: "t5", project_id: "p1", assignee_id: null, title: "Wire contact form to Resend", description: null, status: "review", priority: "low", due_date: daysFromNow(4).slice(0,10), position: 0, created_at: daysFromNow(-6) },
  { id: "t6", project_id: "p1", assignee_id: null, title: "Final QA pass + handoff doc", description: null, status: "todo", priority: "medium", due_date: daysFromNow(8).slice(0,10), position: 0, created_at: daysFromNow(-2) },

  // p2 — Investor portal v2
  { id: "t7", project_id: "p2", assignee_id: null, title: "Fix SSO redirect bug for Safari", description: "Reported by Daniel — only happens on first login.", status: "in_progress", priority: "urgent", due_date: daysFromNow(1).slice(0,10), position: 0, created_at: daysFromNow(-4) },
  { id: "t8", project_id: "p2", assignee_id: null, title: "Generate Q2 PDF report template", description: null, status: "review", priority: "high", due_date: daysFromNow(2).slice(0,10), position: 0, created_at: daysFromNow(-5) },
  { id: "t9", project_id: "p2", assignee_id: null, title: "Document vault — multi-file upload", description: null, status: "done", priority: "high", due_date: daysFromNow(-2).slice(0,10), position: 0, created_at: daysFromNow(-12) },
  { id: "t10", project_id: "p2", assignee_id: null, title: "Polish audit log UI", description: null, status: "todo", priority: "low", due_date: daysFromNow(6).slice(0,10), position: 0, created_at: daysFromNow(-1) },

  // p4 — AI lead bot
  { id: "t11", project_id: "p4", assignee_id: null, title: "Draft system prompt + qualification rubric", description: null, status: "done", priority: "high", due_date: daysFromNow(-1).slice(0,10), position: 0, created_at: daysFromNow(-10) },
  { id: "t12", project_id: "p4", assignee_id: null, title: "Twilio webhook → OpenAI handler", description: null, status: "in_progress", priority: "high", due_date: daysFromNow(3).slice(0,10), position: 0, created_at: daysFromNow(-7) },
  { id: "t13", project_id: "p4", assignee_id: null, title: "Cal.com booking link generation", description: null, status: "todo", priority: "medium", due_date: daysFromNow(7).slice(0,10), position: 0, created_at: daysFromNow(-5) },
  { id: "t14", project_id: "p4", assignee_id: null, title: "Lead transcript dashboard", description: null, status: "todo", priority: "medium", due_date: daysFromNow(10).slice(0,10), position: 1, created_at: daysFromNow(-3) },
];

export const mockNotes: Note[] = [
  {
    id: "n1",
    project_id: "p1",
    client_id: "c1",
    title: "Brand voice guidelines",
    body: "Warm, confident, never corporate. Avoid em-dashes. Sentence case headings.",
    category: "requirement",
    pinned: true,
    created_at: daysFromNow(-25),
    updated_at: daysFromNow(-5),
  },
  {
    id: "n2",
    project_id: "p2",
    client_id: "c2",
    title: "Hosting credentials (Vercel + Supabase)",
    body: "Vercel team: park-capital. DB: prod-supa-east. Rotate secrets quarterly.",
    category: "credential",
    pinned: true,
    created_at: daysFromNow(-40),
    updated_at: daysFromNow(-40),
  },
  {
    id: "n3",
    project_id: "p2",
    client_id: "c2",
    title: "Kickoff call notes — Apr 12",
    body: "Daniel wants the v2 portal in time for Q2 LP meeting. Key deliverables: SSO, quarterly reports, doc vault.",
    category: "meeting",
    pinned: false,
    created_at: daysFromNow(-50),
    updated_at: daysFromNow(-50),
  },
  {
    id: "n4",
    project_id: "p1",
    client_id: "c1",
    title: "Revision round 2 — Sarah",
    body: "Hero CTA copy is too pushy. Try 'See what we built' instead. Reduce shadow on cards.",
    category: "revision",
    pinned: false,
    created_at: daysFromNow(-3),
    updated_at: daysFromNow(-3),
  },
  {
    id: "n5",
    project_id: null,
    client_id: null,
    title: "Internal — Q3 hiring",
    body: "Looking for a part-time React dev to take on smaller retainers.",
    category: "internal",
    pinned: false,
    created_at: daysFromNow(-2),
    updated_at: daysFromNow(-2),
  },
];

export const mockProposals: Proposal[] = [
  {
    id: "pr1",
    title: "Upwork — Next.js marketing site rebuild",
    body: `Hi {{name}},\n\nI noticed you're rebuilding your marketing site on Next.js — that's exactly what I've done for 30+ agencies and SaaS teams over the last 4 years.\n\nA few quick thoughts on your brief:\n• You mentioned Lighthouse scores. I typically ship 95+ across the board.\n• Sanity is great here — happy to set up the schema so your team can publish without touching code.\n• I can usually deliver this scope in 3–4 weeks.\n\nWould love to jump on a 15-min call to align. My calendar: {{link}}\n\nBest,\n{{my_name}}`,
    category: "upwork",
    tags: ["nextjs", "sanity", "marketing-site"],
    use_count: 12,
    created_at: daysFromNow(-120),
  },
  {
    id: "pr2",
    title: "Fiverr — Shopify custom checkout response",
    body: `Hey! Yes, I can absolutely build the custom upsell + bundle logic you're describing.\n\nQuick clarifying questions:\n1. Are you on Shopify Plus? (Required for checkout.liquid edits)\n2. Do bundles need their own SKU or are they virtual?\n3. Any analytics events you want fired on upsell accept/decline?\n\nIf Plus + virtual bundles + GA4 events, my quote is $1,800 with 7-day turnaround. Send the questions back and I'll send a Fiverr offer.`,
    category: "fiverr",
    tags: ["shopify", "checkout", "upsell"],
    use_count: 7,
    created_at: daysFromNow(-90),
  },
  {
    id: "pr3",
    title: "Discovery questions — AI automation projects",
    body: `1. What is the current process you'd like to automate, end-to-end?\n2. Which tools/systems does it touch today?\n3. What's the volume (per day / week / month)?\n4. What does success look like in 90 days?\n5. Who else on your team needs access?\n6. Any compliance constraints (HIPAA, SOC 2, GDPR)?\n7. Budget range — is this a fixed project or ongoing?\n8. What's already been tried that didn't work?`,
    category: "discovery",
    tags: ["ai", "discovery", "automation"],
    use_count: 18,
    created_at: daysFromNow(-200),
  },
  {
    id: "pr4",
    title: "Client onboarding — kickoff email",
    body: `Welcome aboard {{name}}!\n\nA few things to get us moving:\n\n1. **Shared drive** — I've created a folder here: {{link}}. Drop brand assets, content, and any reference material in there.\n2. **Kickoff call** — Pick a time: {{cal_link}}. 45 min.\n3. **Access** — I'll need admin on the domain registrar, hosting, and any CMS we'll be touching. I'll send a credential request via 1Password.\n4. **Comms** — I default to async (Slack/email) and batch responses 2x/day. For anything urgent, just say "urgent" in the subject.\n\nExcited to build this with you.`,
    category: "onboarding",
    tags: ["onboarding", "kickoff", "email"],
    use_count: 22,
    created_at: daysFromNow(-180),
  },
  {
    id: "pr5",
    title: "Upwork — AI automation / OpenAI integration",
    body: `Hi {{name}},\n\nBuilding OpenAI-powered tooling is most of what I do these days. A few that are live in production:\n\n• Lead qualification bot for a real-estate brokerage (Twilio + GPT-4)\n• Internal doc Q&A for a 200-person ops team (pgvector + GPT-4o)\n• Auto-generated weekly reports for a fintech (Claude + Slack)\n\nFor your scope, I'd typically structure it as:\n1. Week 1: prompt design, eval set, dataset prep\n2. Week 2: integration + observability\n3. Week 3: hardening, fallback handling, handoff\n\nQuote depends on the volume and whether you need a UI. Happy to scope on a call. {{link}}`,
    category: "upwork",
    tags: ["ai", "openai", "automation"],
    use_count: 9,
    created_at: daysFromNow(-60),
  },
];

export const mockNotifications: Notification[] = [
  { id: "no1", type: "deadline", title: "Investor portal v2 due in 3 days", body: "Park Capital — quarterly review meeting Mon.", link: "/projects/p2", read: false, created_at: daysFromNow(-0.1) },
  { id: "no2", type: "status_change", title: "Verdant headless rebuild moved to Waiting for Client", body: "Awaiting copy from Hannah.", link: "/projects/p5", read: false, created_at: daysFromNow(-0.3) },
  { id: "no3", type: "task_assigned", title: "New task: Lighthouse audit + image optimization", body: "Due in 5 days.", link: "/projects/p1", read: false, created_at: daysFromNow(-0.5) },
  { id: "no4", type: "client_message", title: "Sarah Mitchell sent a revision request", body: "Round 2 — hero CTA copy.", link: "/clients/c1", read: true, created_at: daysFromNow(-1) },
  { id: "no5", type: "project_update", title: "Brightline microsite marked Completed", body: null, link: "/projects/p7", read: true, created_at: daysFromNow(-12) },
];

export const mockFiles: FileItem[] = [
  { id: "f1", project_id: "p1", client_id: "c1", name: "brightline-brand-v3.zip", storage_path: "files/f1", mime_type: "application/zip", size_bytes: 4_842_010, created_at: daysFromNow(-20) },
  { id: "f2", project_id: "p1", client_id: "c1", name: "hero-illustration.png", storage_path: "files/f2", mime_type: "image/png", size_bytes: 1_204_900, created_at: daysFromNow(-15) },
  { id: "f3", project_id: "p2", client_id: "c2", name: "Q2-report-template.pdf", storage_path: "files/f3", mime_type: "application/pdf", size_bytes: 312_204, created_at: daysFromNow(-8) },
  { id: "f4", project_id: "p4", client_id: "c4", name: "qualification-rubric.pdf", storage_path: "files/f4", mime_type: "application/pdf", size_bytes: 87_120, created_at: daysFromNow(-6) },
  { id: "f5", project_id: "p5", client_id: "c5", name: "verdant-product-shots.zip", storage_path: "files/f5", mime_type: "application/zip", size_bytes: 23_410_990, created_at: daysFromNow(-4) },
];

// ---- helpers ----
export function getClient(id: string) {
  return mockClients.find((c) => c.id === id) ?? null;
}
export function getProject(id: string) {
  return mockProjects.find((p) => p.id === id) ?? null;
}
export function getProjectsByClient(clientId: string) {
  return mockProjects.filter((p) => p.client_id === clientId);
}
export function getTasksByProject(projectId: string) {
  return mockTasks.filter((t) => t.project_id === projectId);
}
export function getNotesByProject(projectId: string) {
  return mockNotes.filter((n) => n.project_id === projectId);
}
export function getFilesByProject(projectId: string) {
  return mockFiles.filter((f) => f.project_id === projectId);
}
