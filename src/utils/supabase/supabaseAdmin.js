// we cant use supabase/ssr because it is only for user level operations using anon key by row level security
// only for admin actions on the server. Like delete Account Operation whihc requires service_rol key

import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // This must be the service role key!
);

export default supabaseAdmin;
