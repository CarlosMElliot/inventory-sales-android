-- M2 account foundation. Review and apply to the selected environment; no business transactions yet.
-- Minimal Auth column reads for invoker-only identity reconciliation and session revocation.
grant select(id,email) on auth.users to service_role;
grant select(id,user_id) on auth.sessions to service_role;
create table public.businesses (
 id uuid primary key default gen_random_uuid(), name text not null check(length(name) between 2 and 120),
 subscription_status text not null default 'active' check(subscription_status in ('active','grace','expired','suspended')),
 enabled boolean not null default true, created_at timestamptz not null default now()
);
create table public.app_profiles (
 id uuid primary key references auth.users(id) on delete restrict,
 email text not null unique check(email=lower(email)),display_name text not null,
 role text not null check(role in ('admin','business')),business_id uuid unique references public.businesses(id) on delete restrict,
 enabled boolean not null default true,setup_state text not null default 'pending' check(setup_state in ('pending','active')),
 sessions_valid_after bigint not null default 0,created_at timestamptz not null default now(),
 check((role='admin' and business_id is null) or (role='business' and business_id is not null))
);
create table public.account_operations (
 id uuid primary key,actor_id uuid not null references public.app_profiles(id),email text not null unique,
 business_name text not null,display_name text not null,auth_user_id uuid references auth.users(id),
 business_id uuid references public.businesses(id),status text not null default 'pending' check(status in ('pending','complete')),
 created_at timestamptz not null default now()
);
create table public.admin_events (
 id uuid primary key default gen_random_uuid(),actor_id uuid not null references public.app_profiles(id),target_id uuid,
 action text not null,reason text,created_at timestamptz not null default now()
);
create table public.revoked_sessions(session_id uuid primary key,user_id uuid not null references auth.users(id),created_at timestamptz not null default now());
alter table public.revoked_sessions enable row level security;
revoke all on public.revoked_sessions from anon,authenticated,service_role;
grant select on public.revoked_sessions to authenticated;
grant select,insert on public.revoked_sessions to service_role;
create policy own_revocations on public.revoked_sessions for select to authenticated using (user_id=(select auth.uid()));
alter table public.businesses enable row level security;
alter table public.app_profiles enable row level security;
alter table public.account_operations enable row level security;
alter table public.admin_events enable row level security;
revoke all on public.businesses,public.app_profiles,public.account_operations,public.admin_events from anon,authenticated,service_role;
grant select on public.businesses,public.app_profiles to authenticated;
grant select,insert,update on public.businesses,public.app_profiles,public.account_operations to service_role;
grant select,insert on public.admin_events to service_role;
create policy own_profile on public.app_profiles for select to authenticated using (
 id=(select auth.uid()) and enabled and not exists(select 1 from public.revoked_sessions rs where rs.session_id=(((select auth.jwt())->>'session_id')::uuid)) and coalesce(((select auth.jwt())->>'iat')::bigint,0)>sessions_valid_after
);
create policy own_business on public.businesses for select to authenticated using (
 enabled and subscription_status<>'suspended' and exists(select 1 from public.app_profiles p where p.id=(select auth.uid()) and p.business_id=businesses.id)
);
-- These RPCs are invoker functions accessible ONLY to the trusted service role.
-- The server verifies the caller with Auth and current profile; RPCs recheck actor authorization.
create function public.reserve_account(p_actor uuid,p_operation uuid,p_email text,p_name text,p_display text)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare op public.account_operations;
begin
 if not exists(select 1 from public.app_profiles where id=p_actor and role='admin' and enabled) then raise exception 'forbidden'; end if;
 insert into public.account_operations(id,actor_id,email,business_name,display_name)
 values(p_operation,p_actor,lower(p_email),p_name,p_display) on conflict(id) do nothing;
 select * into op from public.account_operations where id=p_operation for update;
 if op.actor_id<>p_actor or op.email<>lower(p_email) or op.business_name<>p_name or op.display_name<>p_display then raise exception 'request mismatch'; end if;
 return to_jsonb(op);
end $$;
create function public.complete_account(p_actor uuid,p_operation uuid)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare op public.account_operations; bid uuid;
begin
 if not exists(select 1 from public.app_profiles where id=p_actor and role='admin' and enabled) then raise exception 'forbidden'; end if;
 select * into op from public.account_operations where id=p_operation for update;
 if op.id is null or op.actor_id<>p_actor or op.auth_user_id is null then raise exception 'incomplete operation'; end if;
 if op.status='complete' then return jsonb_build_object('business_id',op.business_id); end if;
 if not exists(select 1 from auth.users where id=op.auth_user_id and lower(email)=op.email) then raise exception 'identity mismatch'; end if;
 insert into public.businesses(name) values(op.business_name) returning id into bid;
 insert into public.app_profiles(id,email,display_name,role,business_id) values(op.auth_user_id,op.email,op.display_name,'business',bid);
 update public.account_operations set business_id=bid,status='complete' where id=p_operation;
 insert into public.admin_events(actor_id,target_id,action,reason) values(p_actor,op.auth_user_id,'account_created',op.business_name);
 return jsonb_build_object('business_id',bid);
end $$;
create function public.change_user_access(p_actor uuid,p_target uuid,p_enabled boolean,p_reason text,p_revoke boolean)
returns void language plpgsql security invoker set search_path='' as $$
begin
 if not exists(select 1 from public.app_profiles where id=p_actor and role='admin' and enabled) then raise exception 'forbidden'; end if;
 if length(trim(p_reason))<3 then raise exception 'reason required'; end if;
 perform 1 from public.app_profiles where id=p_target and role='business' for update;
 if not found then raise exception 'business user required'; end if;
 if p_revoke or p_enabled=false then
  insert into public.revoked_sessions(session_id,user_id) select id,user_id from auth.sessions where user_id=p_target on conflict(session_id) do nothing;
 end if;
 update public.app_profiles set enabled=coalesce(p_enabled,enabled),sessions_valid_after=case when p_revoke or p_enabled=false then floor(extract(epoch from clock_timestamp()))::bigint else sessions_valid_after end where id=p_target;
 insert into public.admin_events(actor_id,target_id,action,reason) values(p_actor,p_target,case when p_revoke then 'sessions_revoked' when p_enabled then 'user_enabled' else 'user_disabled' end,p_reason);
end $$;
create function public.bootstrap_creator(p_user uuid,p_display text)
returns void language plpgsql security invoker set search_path='' as $$
declare user_email text;
begin
 -- Serializes first-admin setup; never callable by a browser credential.
 perform pg_advisory_xact_lock(8026191);
 if exists(select 1 from public.app_profiles where role='admin') then raise exception 'creator already exists'; end if;
 select lower(email) into user_email from auth.users where id=p_user;
 if user_email is null then raise exception 'identity missing'; end if;
 insert into public.app_profiles(id,email,display_name,role) values(p_user,user_email,p_display,'admin');
 insert into public.admin_events(actor_id,target_id,action) values(p_user,p_user,'creator_bootstrapped');
end $$;
revoke all on function public.reserve_account(uuid,uuid,text,text,text),public.complete_account(uuid,uuid),public.change_user_access(uuid,uuid,boolean,text,boolean),public.bootstrap_creator(uuid,text) from public,anon,authenticated;
grant execute on function public.reserve_account(uuid,uuid,text,text,text),public.complete_account(uuid,uuid),public.change_user_access(uuid,uuid,boolean,text,boolean),public.bootstrap_creator(uuid,text) to service_role;
