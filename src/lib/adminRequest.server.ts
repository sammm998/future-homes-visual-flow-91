import { createClient } from '@supabase/supabase-js';

export async function adminRequestError(request: Request): Promise<Response | null> {
  const authorization = request.headers.get('Authorization') ?? '';
  if (!/^Bearer\s+\S+$/i.test(authorization)) return Response.json({ error: 'Sign in required' }, { status: 401 });
  const url = process.env['SUPABASE_URL'];
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'] || process.env['SUPABASE_ANON_KEY'];
  if (!url || !key) return Response.json({ error: 'Authentication unavailable' }, { status: 503 });
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: authorization } },
  });
  const { data, error } = await client.auth.getUser(authorization.replace(/^Bearer\s+/i, ''));
  if (error || !data.user) return Response.json({ error: 'Sign in required' }, { status: 401 });
  const { data: role, error: roleError } = await client.from('user_roles').select('role').eq('user_id', data.user.id).eq('role', 'admin').maybeSingle();
  if (roleError || !role) return Response.json({ error: 'Administrator access required' }, { status: 403 });
  return null;
}