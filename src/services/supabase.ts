import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = supabaseUrl && supabaseUrl.startsWith('http');

// Provide a mock object that won't crash if not configured
const mockSupabase = {
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: [], error: null }),
    update: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }),
    delete: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }),
    upsert: () => Promise.resolve({ data: [], error: null }),
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  }
};

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey || '') 
  : mockSupabase as any;
