-- 0002_email_role_lookup.sql
-- Adds a public role lookup RPC so signup can block cross-role reuse of the same email.

create or replace function public.get_registered_role_by_email(input_email text)
returns text
language sql
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where lower(email) = lower(trim(input_email))
  limit 1;
$$;

grant execute on function public.get_registered_role_by_email(text) to anon, authenticated;
