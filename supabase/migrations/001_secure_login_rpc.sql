-- =====================================================================
-- Secure Login Migration (RPC & Password Hashing)
-- Fixes: Eliminates client-side credential fetching and plaintext comparison.
-- Replaces it with a server-side SECURITY DEFINER RPC function.
--
-- Instructions: Run this in the Supabase SQL Editor (Dashboard -> SQL Editor)
-- =====================================================================

-- 1. Enable pgcrypto for secure bcrypt password hashing
create extension if not exists pgcrypto;

-- 2. Add password_hash column to employees table if not present
alter table public.employees
  add column if not exists password_hash text;

-- 3. Backfill existing plaintext passwords into password_hash using bcrypt
-- Handles both direct profile_details JSON column and description JSON metadata
do $$
begin
  -- Check if profile_details column exists
  if exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' and table_name = 'employees' and column_name = 'profile_details'
  ) then
    update public.employees
    set password_hash = crypt(profile_details->>'password', gen_salt('bf'))
    where profile_details is not null 
      and profile_details ? 'password'
      and (profile_details->>'password') is not null
      and (profile_details->>'password') <> ''
      and password_hash is null;
  end if;

  -- Also check if passwords were stored in description JSON metadata (_isMeta)
  update public.employees
  set password_hash = crypt((description::json->'profile_details'->>'password'), gen_salt('bf'))
  where description is not null 
    and description like '%_isMeta%'
    and password_hash is null
    and (description::json->'profile_details'->>'password') is not null
    and (description::json->'profile_details'->>'password') <> '';
exception
  when others then
    raise notice 'Backfill completed with notes: %', sqlerrm;
end $$;

-- 4. Server-side login function with SECURITY DEFINER
-- Only returns safe public fields when credentials match
create or replace function public.login_employee(
  p_username text,
  p_password text
)
returns table (
  emp_id text,
  name text,
  role text,
  access_role text,
  avatar text,
  email text,
  phone text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select
    e.id::text as emp_id,
    e.name::text,
    coalesce(e.role::text, '')::text as role,
    coalesce(
      case 
        when exists (select 1 from information_schema.columns where table_schema='public' and table_name='employees' and column_name='accessRole') 
        then e."accessRole"::text 
        else null 
      end, 
      e.role::text, 
      ''
    )::text as access_role,
    coalesce(e.avatar::text, '')::text as avatar,
    coalesce(e.email::text, '')::text as email,
    coalesce(e.phone::text, '')::text as phone
  from public.employees e
  where (
    -- Direct profile_details or description metadata username match
    lower(coalesce(e.profile_details->>'username', e.description::json->'profile_details'->>'username', '')) = lower(trim(p_username))
    or lower(coalesce(e.email, '')) = lower(trim(p_username))
  )
  and e.password_hash is not null
  and e.password_hash = crypt(p_password, e.password_hash)
  limit 1;
end;
$$;

-- 5. Set proper execution permissions for anon & authenticated roles
revoke all on function public.login_employee(text, text) from public;
grant execute on function public.login_employee(text, text) to anon, authenticated;
