------------------------------------------------------
-- Add role to user's claims (JWT)
------------------------------------------------------
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
  declare
    claims jsonb;
    user_role public.app_role;
  begin
    -- Fetch the user role in the user_roles table
    select r.role into user_role
    from public.user_roles ur
    join public.roles r on ur.role_id = r.id
    where ur.user_id = (event->>'user_id')::uuid;

    claims := event->'claims';

    if user_role is not null then
      -- Set the claim
      claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
    else
      claims := jsonb_set(claims, '{user_role}', 'null');
    end if;

    -- Update the 'claims' object in the original event
    event := jsonb_set(event, '{claims}', claims);

    -- Return the modified or original event
    return event;
  end;
$$;

grant usage on schema public to supabase_auth_admin;

grant execute
  on function public.custom_access_token_hook
  to supabase_auth_admin;

revoke execute
  on function public.custom_access_token_hook
  from authenticated, anon, public;

-- Grant permissions for user_roles table
grant all
  on table public.user_roles
to supabase_auth_admin;

revoke all
  on table public.user_roles
  from authenticated, anon, public;

-- Grant permissions for roles table
grant all
  on table public.roles
  to supabase_auth_admin;

revoke all
  on table public.roles
  from authenticated, anon, public;