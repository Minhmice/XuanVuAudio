-- Apply this script in Supabase Dashboard -> SQL Editor.
-- Implements locked decision D-06 by revoking all other sessions
-- for a user while preserving the current session id.

create or replace function public.internal_revoke_other_sessions(
  p_user_id uuid,
  p_current_session_id uuid
)
returns void
language plpgsql
security definer
set search_path = auth, public
as $$
begin
  if p_user_id is null then
    raise exception 'p_user_id is required';
  end if;

  if p_current_session_id is null then
    raise exception 'p_current_session_id is required';
  end if;

  delete from auth.refresh_tokens
  where user_id = p_user_id
    and session_id is distinct from p_current_session_id;

  delete from auth.sessions
  where user_id = p_user_id
    and id is distinct from p_current_session_id;
end;
$$;

revoke all on function public.internal_revoke_other_sessions(uuid, uuid) from public;
grant execute on function public.internal_revoke_other_sessions(uuid, uuid) to service_role;
