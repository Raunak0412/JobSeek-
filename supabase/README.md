# Supabase Auth Setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and set:
   - `NEXT_PUBLIC_SUPABASE_URL` (must be `https://<project-ref>.supabase.co`, not the Postgres `SUPABASE_DB_URL`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_DB_URL` (server-only, Postgres connection string)
3. Run migration from terminal:
   - `npm run migrate:supabase`
4. (Optional manual) Open Supabase SQL Editor and run `supabase/schema.sql`.
5. In Supabase Dashboard:
   - Authentication -> Providers -> enable **Google**
   - Add your Google OAuth client ID/secret
   - Authentication -> URL Configuration:
     - Site URL: `http://localhost:3000`
     - Redirect URL: `http://localhost:3000/auth/callback`
     - Redirect URL: `http://localhost:3000/auth/reset-password`
6. Restart your Next.js app.

When env keys are missing, the app automatically falls back to demo auth mode.


Troubleshooting:
- If Google sign in returns Unsupported provider: provider is not enabled, open Supabase Dashboard -> Authentication -> Providers, enable **Google**, and set your Google OAuth client ID/secret.

