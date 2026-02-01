
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const supabaseUrl = 'https://qznujzgqcmirchkwhzxu.supabase.co';
const supabaseAnonKey = 'sb_publishable_GmEeY_Tm7kmXIXO42mqxgw_0CidlEWG';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
