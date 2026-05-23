-- Optional demo seed for AgencyOS.
-- Prereq: at least one user has signed up so that public.profiles has a row.
-- Run AFTER 0001_init.sql.
-- Safe to re-run: deletes any existing demo rows owned by the first profile first.

do $$
declare
  owner uuid;
  c_sarah uuid := uuid_generate_v4();
  c_daniel uuid := uuid_generate_v4();
  c_aisha uuid := uuid_generate_v4();
  c_marcus uuid := uuid_generate_v4();
  c_hannah uuid := uuid_generate_v4();
  p_brightline uuid := uuid_generate_v4();
  p_investor uuid := uuid_generate_v4();
  p_noor uuid := uuid_generate_v4();
  p_leadbot uuid := uuid_generate_v4();
  p_verdant uuid := uuid_generate_v4();
  p_retainer uuid := uuid_generate_v4();
  p_microsite uuid := uuid_generate_v4();
begin
  -- Use the first profile we find as owner.
  select id into owner from public.profiles order by created_at asc limit 1;
  if owner is null then
    raise notice 'No profile found — sign up a user first, then re-run seed.';
    return;
  end if;

  -- Wipe any prior demo data owned by this user (idempotent re-seed).
  delete from public.notifications where user_id = owner;
  delete from public.files where owner_id = owner;
  delete from public.proposals where owner_id = owner;
  delete from public.notes where owner_id = owner;
  delete from public.tasks
    where project_id in (select id from public.projects where owner_id = owner);
  delete from public.projects where owner_id = owner;
  delete from public.clients where owner_id = owner;

  -- Clients
  insert into public.clients (id, owner_id, name, company, email, phone, fiverr_url, upwork_url, website, notes) values
    (c_sarah,  owner, 'Sarah Mitchell',  'Brightline Studio',     'sarah@brightline.co',     '+1 415 555 2210', 'https://fiverr.com/brightline', 'https://upwork.com/freelancers/~brightline', 'https://brightline.co',   'Prefers async updates. Strong opinions on typography.'),
    (c_daniel, owner, 'Daniel Park',     'Park Capital',          'daniel@parkcapital.io',   '+1 212 555 9981', null,                              'https://upwork.com/freelancers/~parkcapital', 'https://parkcapital.io',  'Long-term retainer. Monthly invoicing.'),
    (c_aisha,  owner, 'Aisha Khan',      'Noor Cosmetics',        'aisha@noor.beauty',       '+44 20 7946 0123','https://fiverr.com/noor',         null,                                            'https://noor.beauty',     'Shopify storefront + custom checkout flow.'),
    (c_marcus, owner, 'Marcus Rivera',   'Rivera Realty Group',   'marcus@riverarealty.com', '+1 305 555 4012', null,                              'https://upwork.com/freelancers/~riverarealty',  'https://riverarealty.com','AI lead-qualification bot. Wants Twilio integration.'),
    (c_hannah, owner, 'Hannah Lee',      'Verdant Foods',         'hannah@verdant.co',       '+1 206 555 7733', 'https://fiverr.com/verdant',      'https://upwork.com/freelancers/~verdant',       'https://verdant.co',      'Headless Next.js + Sanity rebuild.');

  -- Projects
  insert into public.projects (id, owner_id, client_id, title, description, status, priority, budget, deadline, progress) values
    (p_brightline, owner, c_sarah,  'Brightline marketing site rebuild', 'Migrate WordPress to Next.js + Sanity. Improve Lighthouse scores and add a case-study system.', 'in_progress',    'high',   8400,  current_date + 9,  62),
    (p_investor,   owner, c_daniel, 'Investor portal v2',                'Add document vault, quarterly report generation, and SSO via Auth0.',                          'revision',       'urgent', 18000, current_date + 3,  88),
    (p_noor,       owner, c_aisha,  'Noor Shopify custom checkout',      'Custom upsell + bundle logic in checkout.liquid.',                                              'discussion',     'medium', 4200,  current_date + 21, 8),
    (p_leadbot,    owner, c_marcus, 'AI lead-qualification bot',         'OpenAI + Twilio bot that qualifies inbound leads and books showings via Cal.com.',              'in_progress',    'high',   6800,  current_date + 14, 35),
    (p_verdant,    owner, c_hannah, 'Verdant headless rebuild',          'Next.js + Sanity. CMS for recipes, blog, and product pages.',                                   'waiting_client', 'medium', 11500, current_date + 28, 45),
    (p_retainer,   owner, c_daniel, 'Park Capital monthly retainer — June', 'Ongoing maintenance, perf monitoring, and ad-hoc features.',                                 'in_progress',    'low',    3500,  current_date + 18, 50),
    (p_microsite,  owner, c_sarah,  'Brightline brand microsite',        'Single-page launch microsite for new product line.',                                            'completed',      'medium', 2200,  current_date - 12, 100);

  -- Tasks
  insert into public.tasks (project_id, title, description, status, priority, due_date, position) values
    (p_brightline, 'Set up Sanity schema for case studies', 'Fields: title, hero image, sections, client, tech stack.', 'done',        'medium', current_date - 5, 0),
    (p_brightline, 'Migrate blog posts from WordPress',     'Use sanity-import and clean up image refs.',                'done',        'medium', current_date - 3, 1),
    (p_brightline, 'Build /case-studies index + detail',    'Static generation with on-demand revalidation.',            'in_progress', 'high',   current_date + 2, 0),
    (p_brightline, 'Lighthouse audit + image optimization', 'Target 95+ on all metrics.',                                'in_progress', 'medium', current_date + 5, 1),
    (p_brightline, 'Wire contact form to Resend',           null,                                                        'review',      'low',    current_date + 4, 0),
    (p_brightline, 'Final QA pass + handoff doc',           null,                                                        'todo',        'medium', current_date + 8, 0),

    (p_investor,   'Fix SSO redirect bug for Safari',       'Reported by Daniel — only happens on first login.',         'in_progress', 'urgent', current_date + 1, 0),
    (p_investor,   'Generate Q2 PDF report template',       null,                                                        'review',      'high',   current_date + 2, 0),
    (p_investor,   'Document vault — multi-file upload',    null,                                                        'done',        'high',   current_date - 2, 0),
    (p_investor,   'Polish audit log UI',                   null,                                                        'todo',        'low',    current_date + 6, 0),

    (p_leadbot,    'Draft system prompt + qualification rubric', null,                                                   'done',        'high',   current_date - 1, 0),
    (p_leadbot,    'Twilio webhook → OpenAI handler',       null,                                                        'in_progress', 'high',   current_date + 3, 0),
    (p_leadbot,    'Cal.com booking link generation',       null,                                                        'todo',        'medium', current_date + 7, 0),
    (p_leadbot,    'Lead transcript dashboard',             null,                                                        'todo',        'medium', current_date + 10, 1);

  -- Notes
  insert into public.notes (owner_id, project_id, client_id, title, body, category, pinned) values
    (owner, p_brightline, c_sarah, 'Brand voice guidelines',
      'Warm, confident, never corporate. Avoid em-dashes. Sentence case headings.',
      'requirement', true),
    (owner, p_investor, c_daniel, 'Hosting credentials (Vercel + Supabase)',
      'Vercel team: park-capital. DB: prod-supa-east. Rotate secrets quarterly.',
      'credential', true),
    (owner, p_investor, c_daniel, 'Kickoff call notes — Apr 12',
      'Daniel wants the v2 portal in time for Q2 LP meeting. Key deliverables: SSO, quarterly reports, doc vault.',
      'meeting', false),
    (owner, p_brightline, c_sarah, 'Revision round 2 — Sarah',
      'Hero CTA copy is too pushy. Try "See what we built" instead. Reduce shadow on cards.',
      'revision', false),
    (owner, null, null, 'Internal — Q3 hiring',
      'Looking for a part-time React dev to take on smaller retainers.',
      'internal', false);

  -- Proposals
  insert into public.proposals (owner_id, title, body, category, tags, use_count) values
    (owner, 'Upwork — Next.js marketing site rebuild',
$$Hi {{name}},

I noticed you're rebuilding your marketing site on Next.js — that's exactly what I've done for 30+ agencies and SaaS teams over the last 4 years.

A few quick thoughts on your brief:
• You mentioned Lighthouse scores. I typically ship 95+ across the board.
• Sanity is great here — happy to set up the schema so your team can publish without touching code.
• I can usually deliver this scope in 3–4 weeks.

Would love to jump on a 15-min call to align. My calendar: {{link}}

Best,
{{my_name}}$$,
      'upwork', array['nextjs','sanity','marketing-site']::text[], 12),
    (owner, 'Fiverr — Shopify custom checkout response',
$$Hey! Yes, I can absolutely build the custom upsell + bundle logic you're describing.

Quick clarifying questions:
1. Are you on Shopify Plus? (Required for checkout.liquid edits)
2. Do bundles need their own SKU or are they virtual?
3. Any analytics events you want fired on upsell accept/decline?

If Plus + virtual bundles + GA4 events, my quote is $1,800 with 7-day turnaround. Send the questions back and I'll send a Fiverr offer.$$,
      'fiverr', array['shopify','checkout','upsell']::text[], 7),
    (owner, 'Discovery questions — AI automation projects',
$$1. What is the current process you'd like to automate, end-to-end?
2. Which tools/systems does it touch today?
3. What's the volume (per day / week / month)?
4. What does success look like in 90 days?
5. Who else on your team needs access?
6. Any compliance constraints (HIPAA, SOC 2, GDPR)?
7. Budget range — is this a fixed project or ongoing?
8. What's already been tried that didn't work?$$,
      'discovery', array['ai','discovery','automation']::text[], 18),
    (owner, 'Client onboarding — kickoff email',
$$Welcome aboard {{name}}!

A few things to get us moving:

1. Shared drive — I've created a folder here: {{link}}. Drop brand assets, content, and any reference material in there.
2. Kickoff call — Pick a time: {{cal_link}}. 45 min.
3. Access — I'll need admin on the domain registrar, hosting, and any CMS we'll be touching. I'll send a credential request via 1Password.
4. Comms — I default to async (Slack/email) and batch responses 2x/day. For anything urgent, just say "urgent" in the subject.

Excited to build this with you.$$,
      'onboarding', array['onboarding','kickoff','email']::text[], 22),
    (owner, 'Upwork — AI automation / OpenAI integration',
$$Hi {{name}},

Building OpenAI-powered tooling is most of what I do these days. A few that are live in production:

• Lead qualification bot for a real-estate brokerage (Twilio + GPT-4)
• Internal doc Q&A for a 200-person ops team (pgvector + GPT-4o)
• Auto-generated weekly reports for a fintech (Claude + Slack)

For your scope, I'd typically structure it as:
1. Week 1: prompt design, eval set, dataset prep
2. Week 2: integration + observability
3. Week 3: hardening, fallback handling, handoff

Quote depends on the volume and whether you need a UI. Happy to scope on a call. {{link}}$$,
      'upwork', array['ai','openai','automation']::text[], 9);

  -- Notifications
  insert into public.notifications (user_id, type, title, body, link, read) values
    (owner, 'deadline',       'Investor portal v2 due in 3 days',                  'Park Capital — quarterly review meeting Mon.',     '/projects', false),
    (owner, 'status_change',  'Verdant headless rebuild moved to Waiting for Client', 'Awaiting copy from Hannah.',                    '/projects', false),
    (owner, 'task_assigned',  'New task: Lighthouse audit + image optimization',   'Due in 5 days.',                                   '/projects', false),
    (owner, 'client_message', 'Sarah Mitchell sent a revision request',            'Round 2 — hero CTA copy.',                         '/clients',  true),
    (owner, 'project_update', 'Brightline microsite marked Completed',             null,                                                '/projects', true);

  raise notice 'Seed complete for owner %', owner;
end $$;
