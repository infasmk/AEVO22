
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qznujzgqcmirchkwhzxu.supabase.co';

/**
 * ⚠️ CRITICAL WARNING:
 * The key 'sb_publishable_...' is a STRIPE PUBLIC KEY, not a Supabase key.
 * 
 * To fix the "Database not syncing" error:
 * 1. Go to your Supabase Dashboard (https://supabase.com/dashboard)
 * 2. Select Project > Settings > API
 * 3. Copy the 'anon' / 'public' key (IT MUST START WITH 'eyJ...')
 * 4. Paste it below.
 */
const supabaseAnonKey = 'sb_publishable_GmEeY_Tm7kmXIXO42mqxgw_0CidlEWG';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
