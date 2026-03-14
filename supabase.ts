
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qdlnnqadljkvfkcbrvgl.supabase.co';

/**
 * 🔗 DATABASE AUTHENTICATED
 * Using the provided Supabase Publishable Key.
 */
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_avInPHQ_8it5nqz8zaHqZQ_7wLz5Pn0';

// Helper to check if configuration is valid
export const isConfigValid = () => {
  return (supabaseAnonKey.startsWith('eyJ') || supabaseAnonKey.startsWith('sb_publishable_')) && supabaseUrl.includes('.supabase.co');
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
