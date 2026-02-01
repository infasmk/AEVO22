
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qznujzgqcmirchkwhzxu.supabase.co';
const supabaseAnonKey = 'sb_publishable_GmEeY_Tm7kmXIXO42mqxgw_0CidlEWG';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
