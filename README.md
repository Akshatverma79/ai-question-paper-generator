# Setter — AI Question Paper Generator

Generate fully configurable exam/question papers (MCQ, true/false, short,
long, fill-in-the-blank) with an AI-written answer key, save them to your
account, edit them, and export to PDF.

**Stack**
- **Next.js 14** (App Router, TypeScript) — full-stack React framework
- **Supabase** — auth (email/password) + Postgres storage, with Row Level
  Security so each user only ever sees their own papers
- **OpenAI API** (`gpt-4o-mini`) — question generation, called from a
  server-side API route so the key never reaches the browser
- **Tailwind CSS** — styling
- **jsPDF** — client-side PDF export

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** → paste the contents of `supabase/schema.sql` → **Run**.
   This creates the `question_papers` table and Row Level Security policies
   so users can only read/write their own rows.
3. Go to **Authentication → Providers** and make sure **Email** is enabled.
   (For local dev, you can also turn off "Confirm email" under
   **Authentication → Settings** to skip the confirmation email step.)
4. Go to **Project Settings → API** and copy your **Project URL** and
   **anon public key**.
5. Go to **Authentication → URL Configuration** and add
   `http://localhost:3000/auth/callback` (and your production URL's
   equivalent) to **Redirect URLs**.

## 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from step 1.4
- `OPENAI_API_KEY` — from https://platform.openai.com/api-keys
- `NEXT_PUBLIC_SITE_URL` — `http://localhost:3000` locally

## 3. Install and run

```bash
npm install
npm run dev
```

Visit http://localhost:3000, create an account, and generate your first paper.

## Project structure

```
app/
  page.tsx                     Landing page
  login/, signup/               Auth pages (Supabase email/password)
  auth/callback/route.ts        Handles Supabase email confirmation redirect
  dashboard/                    Signed-in area (protected by middleware.ts)
    page.tsx                    List of saved papers
    new/page.tsx                Paper generator form
    papers/[id]/page.tsx        View / edit / export a paper
  api/
    generate/route.ts           Calls OpenAI, saves the result to Supabase
    papers/[id]/route.ts        Delete a paper
lib/
  supabase/                     Browser, server, and middleware Supabase clients
  openai.ts                     Prompt + OpenAI call
  pdf.ts                        Client-side PDF export (jsPDF)
  types.ts                      Shared TypeScript types
components/                     UI components
supabase/schema.sql             Database schema + RLS policies
middleware.ts                   Protects /dashboard, refreshes auth session
```

## Notes on auth

Auth is handled entirely by Supabase:
- Sign up / log in with email + password (`app/login`, `app/signup`)
- Session cookies are read/refreshed on every request by `middleware.ts`
- `/dashboard/*` routes redirect to `/login` if you're not signed in
- All question papers are scoped to `auth.uid()` via Postgres RLS policies,
  so this is enforced at the database level, not just in the UI

## Deploying

Any Next.js host (e.g. Vercel) works. Set the same environment variables in
your host's dashboard, and add your production domain's `/auth/callback` URL
to Supabase's Redirect URLs list.
