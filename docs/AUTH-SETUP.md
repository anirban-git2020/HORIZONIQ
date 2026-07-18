# HorizonIQ — Cross-Device Accounts: Setup Guide

This guide covers every dashboard step you (Ani) need to do **before** I build the
app code. It's all on free tiers — total cost **$0**.

You'll configure four things:

1. The Supabase **anon key** as an environment variable (local + Vercel)
2. The **`profiles` table** (run one SQL file)
3. The **Email (magic link)** auth provider
4. **Google** sign-in (Google Cloud + Supabase)

Then verify, and tell me to start Move 1.

> Terminology: your **project ref** is the subdomain in your Supabase URL.
> If `NEXT_PUBLIC_SUPABASE_URL = https://abcd1234.supabase.co`, then
> `abcd1234` is your project ref. You'll reuse it below.

---

## Step 1 — Anon key → environment variables

The anon (public) key is safe to expose in the browser; Row Level Security is
what actually protects data. (The **service-role** key is the secret one — never
put it in a `NEXT_PUBLIC_` variable.)

### 1a. Copy the key
1. Supabase Dashboard → your project.
2. Left sidebar → **Project Settings** (gear) → **API**.
3. Under **Project API keys**, copy the **`anon` `public`** key (a long JWT).

### 1b. Add it locally
In `C:\Claude_test\HorizonIQ\.env.local` (create the file if it doesn't exist),
add:

```
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste-the-anon-public-key-here
```

`.env.local` is git-ignored, so this stays off GitHub. (`NEXT_PUBLIC_SUPABASE_URL`
should already be there from the feedback setup — if not, add it too.)

### 1c. Add it to Vercel
1. Vercel → your project → **Settings** → **Environment Variables**.
2. Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` = the same key.
3. Apply to **Production, Preview, and Development**.
4. Save. (A redeploy later will pick it up — no need to redeploy now.)

---

## Step 2 — Create the `profiles` table

1. Supabase Dashboard → **SQL Editor** → **New query**.
2. Open `supabase/profiles-schema.sql` from the repo, copy its entire contents,
   paste into the editor.
3. Click **Run**. You should see "Success. No rows returned."

What this created:
- A `profiles` table (one row per user: role, region, interests, name, email).
- **Row Level Security** so each user can touch only their own row.
- A trigger that **auto-creates** a profile row the moment someone signs up.

Verify: **Table Editor** → you should now see an empty `public.profiles` table.

---

## Step 3 — Enable Email (magic link)

1. Supabase Dashboard → **Authentication** → **Providers**.
2. **Email** is usually on by default. Open it and confirm **Enable Email
   provider** is ON.
3. Turn **"Confirm email"** ON (this is what makes it a magic link — the user
   clicks a link in their inbox to sign in). You can leave "Secure email change"
   and other defaults as-is.
4. Save.

> **Email rate limit (important):** Supabase's built-in email sender allows only
> a few messages per hour — fine for testing and early beta. If you outgrow it,
> add a free SMTP provider (Resend or Brevo free tier) under
> **Authentication → Emails → SMTP Settings**. Still $0. Not needed to start.

---

## Step 4 — Configure URLs (Supabase side)

Auth needs to know which URLs it's allowed to redirect back to after sign-in.

1. Supabase Dashboard → **Authentication** → **URL Configuration**.
2. **Site URL:** set to your production domain, e.g. `https://your-app.vercel.app`
   (use your real Vercel domain).
3. **Redirect URLs:** click add, and include each of these (one per line):
   - `http://localhost:3000/auth/callback`
   - `https://your-app.vercel.app/auth/callback`
   - `https://*.vercel.app/auth/callback`  ← covers preview deployments (wildcards allowed)
4. Save.

`/auth/callback` is the route I'll build in Move 1 that completes the sign-in.

---

## Step 5 — Google sign-in

Two halves: create an OAuth client in **Google Cloud**, then paste its
credentials into **Supabase**.

### 5a. Google Cloud — create the OAuth client
> **Note (2026 UI):** Google replaced the old "OAuth consent screen" + "Credentials"
> pages with **Google Auth Platform**. In the left nav you'll see: Overview,
> Branding, Audience, Clients, Data access, Verification centre, Settings.

1. Go to **https://console.cloud.google.com** and sign in.
2. Top bar → project picker → **New Project** (name it "HorizonIQ") → Create →
   select it.
3. Left menu → **APIs & Services** → **OAuth consent screen** (opens **Google
   Auth Platform**). If prompted with a **Get started** wizard, fill:
   - **App Information:** App name `HorizonIQ`, user support email = your email.
   - **Audience:** **External**.
   - **Contact Information:** your email. → Finish / Create.
4. Left nav → **Audience** → confirm **User type = External**. While it shows
   "Testing", only listed **Test users** can sign in — add your email there, or
   click **Publish app** to open it to everyone (safe: basic scopes need no
   Google verification).
5. Left nav → **Clients** → **Create OAuth client** (or **Create client**).
   - **Application type:** Web application.
   - **Name:** `HorizonIQ Web` (just a label).
   - **Authorized JavaScript origins** → Add URI:
     - `http://localhost:3000`
     - `https://your-app.vercel.app`
   - **Authorized redirect URIs** → Add this **exactly** — it points at Supabase,
     not your app:
     - `https://<PROJECT_REF>.supabase.co/auth/v1/callback`
     - Best source of the exact string: **Supabase → Authentication → Providers →
       Google** shows a **Callback URL** — copy it verbatim. A one-character
       mismatch causes `redirect_uri_mismatch`.
   - **Create.**
6. A dialog shows your **Client ID** and **Client Secret** — copy both.

   (**Data access** / **Verification centre** / **Settings** tabs: not needed —
   the default `openid` / `email` / `profile` scopes are enough for sign-in.)

### 5b. Supabase — enable Google
1. Supabase Dashboard → **Authentication** → **Providers** → **Google**.
2. Toggle **Enable**.
3. Paste **Client ID** and **Client Secret** from the previous step.
4. Save.

> Tip: Supabase shows the exact **Callback URL** to use on the Google side right
> there on the Google provider page — it should match the
> `https://<PROJECT_REF>.supabase.co/auth/v1/callback` you entered in 5a. If they
> differ, trust the one Supabase shows and update Google to match.

---

## Step 6 — Verify (after I ship Move 1)

Once Steps 1–5 are done and I've built Move 1, we'll confirm:

- **Magic link:** enter your email in the sign-in panel → receive a link → click
  it → you're signed in.
- **Google:** click "Continue with Google" → consent → back to the app, signed in.
- **Row created:** Supabase → Table Editor → `profiles` → your row exists.
- **RLS holds:** in the SQL editor, running `select * from profiles;` as the
  service role shows all rows, but the app (anon key) only ever returns the
  signed-in user's own row.
- **Cross-device:** sign in on your phone with the same email/Google → your role,
  region, and interests appear without re-entering them.

---

## Security recap (what makes this safe)

- **No passwords** stored or handled by us — magic link and Google only.
- **Sessions in httpOnly cookies** (via `@supabase/ssr`) — not readable by
  page JavaScript, so an XSS bug can't steal a session token.
- **Row Level Security** — Postgres itself blocks any user from reading another
  user's row; it's not enforced by app code that could have a bug.
- **Key hygiene** — the browser only ever gets the public **anon** key; the
  **service-role** key stays server-side (as it already is for feedback).
- **Minimal data** — a profile holds email + preferences. Nothing sensitive.

---

## What I build after this (for reference)

- **Move 1 — Auth plumbing:** browser/server Supabase clients, session refresh in
  middleware, `/auth/callback` route, sign-in panel (magic link + Google), account
  menu, auth provider. Outcome: sign-in works and a `profiles` row appears.
- **Move 2 — Preference sync:** when signed in, hydrate preferences from the
  profile and write changes back (debounced); on first sign-in, migrate existing
  local role/region/interests/name into the empty profile. Outcome: true
  cross-device sync.

The anonymous, no-login experience stays exactly as it is today — signing in is
an optional upgrade.
