# AgencyOS

Modern internal operations system for a small web development and AI automation agency.
Built to be fast, minimal, and ergonomic — Linear/Notion vibes without the bloat.

## Stack

- **Next.js 16** (App Router, RSC, Server Actions)
- **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** components
- **Supabase** (Postgres, Auth, Storage)
- **dnd-kit** for the Kanban board
- **Recharts** for dashboard charts
- **next-themes** for dark/light mode
- **Sonner** for toasts

## What's in here

| Module             | Where to look                                  |
|--------------------|------------------------------------------------|
| Auth               | `src/app/(auth)/login/`                        |
| App shell          | `src/app/(app)/layout.tsx`, `src/components/layout/` |
| Dashboard          | `src/app/(app)/dashboard/`                     |
| Clients            | `src/app/(app)/clients/`                       |
| Projects           | `src/app/(app)/projects/`                      |
| Kanban             | `src/components/kanban/`                       |
| Tasks (global)     | `src/app/(app)/tasks/`                         |
| Notes              | `src/app/(app)/notes/`                         |
| Proposal Vault     | `src/app/(app)/proposals/`                     |
| Notifications      | `src/app/(app)/notifications/`                 |
| Files              | `src/app/(app)/files/`                         |
| AI Tools           | `src/app/(app)/ai/` + `src/app/api/ai/`        |
| Settings           | `src/app/(app)/settings/`                      |
| DB schema (SQL)    | `supabase/migrations/0001_init.sql`            |
| Mock data          | `src/lib/mock-data.ts`                         |

## Getting started

```bash
npm install
cp .env.example .env.local   # leave blank to run in demo mode
npm run dev
```

Visit http://localhost:3000 — you'll land on the login page.
**Demo mode**: any email/password works (e.g. `demo@agencyos.app` / `demo`).

## Going live with Supabase

1. Create a new Supabase project.
2. SQL editor: run `supabase/migrations/0001_init.sql` (schema + RLS).
3. SQL editor: run `supabase/migrations/0002_storage.sql` (creates the
   `files` storage bucket and per-user RLS policies).
4. Add to `.env.local` (or Vercel env vars):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
5. Create your first admin user in the Supabase Auth dashboard — the
   `handle_new_user` trigger creates a matching profile row automatically.
6. (Optional) seed demo data: SQL editor → paste `supabase/seed.sql` → Run.

## Going live with AI

1. Add `OPENAI_API_KEY=sk-...` to `.env.local`.
2. Open `src/lib/ai.ts` and uncomment the live OpenAI block (the import and
   `chat.completions.create` call).
3. `npm i openai`.

The three AI endpoints (`/api/ai/proposal`, `/summarize`, `/breakdown`) share
that helper, so a single change wires up all of them.

## Demo mode

Without `NEXT_PUBLIC_SUPABASE_URL`, the app runs against the mock data in
`src/lib/mock-data.ts`. Auth, lists, detail pages, and Kanban drag-and-drop all
work — but writes don't persist past a page reload. This is intentional so the
UI can be evaluated before wiring up infrastructure.
