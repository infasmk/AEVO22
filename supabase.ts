
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qznujzgqcmirchkwhzxu.supabase.co';

/**
 * 🔗 DATABASE AUTHENTICATED
 * Using the verified Supabase Anon Key.
 */
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6bnVqemdxY21pcmNoa3doenh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NjU5MjEsImV4cCI6MjA4NTU0MTkyMX0.0PxfII9ZPyUs6Fa1ASiN5I57J3F7uZzlvpzKN-Za-BA';

// Helper to check if configuration is valid
export const isConfigValid = () => {
  return supabaseAnonKey.startsWith('eyJ') && supabaseUrl.includes('.supabase.co');
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
