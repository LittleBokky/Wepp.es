import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = supabaseUrl && supabaseUrl.startsWith('http');

console.log('[Supabase Config] URL:', supabaseUrl?.substring(0, 15) + '...', 'KEY:', supabaseAnonKey?.substring(0, 10) + '...', 'Configured:', isConfigured);

// Persistent Mock DB using localStorage for development without Supabase
const getMockData = (table: string) => {
  try {
    const db = JSON.parse(localStorage.getItem('wepp_mock_db') || '{}');
    return db[table] || [];
  } catch { return []; }
};

const saveMockData = (table: string, data: any[]) => {
  try {
    const db = JSON.parse(localStorage.getItem('wepp_mock_db') || '{}');
    db[table] = data;
    localStorage.setItem('wepp_mock_db', JSON.stringify(db));
  } catch (e) { console.error('MockDB Save Error', e); }
};

const createMockChain = (table: string) => {
  let currentFilter: { column: string, value: any } | null = null;
  let isSingle = false;

  const chain: any = {
    select: () => chain,
    eq: (col: string, val: any) => {
      currentFilter = { column: col, value: val };
      return chain;
    },
    single: () => {
      isSingle = true;
      return chain;
    },
    insert: async (newData: any[]) => {
      const data = getMockData(table);
      const updated = [...data, ...newData];
      saveMockData(table, updated);
      return { data: newData, error: null };
    },
    update: async (updateData: any) => {
      const data = getMockData(table);
      const updated = data.map((item: any) => {
        if (currentFilter && item[currentFilter.column] === currentFilter.value) {
          return { ...item, ...updateData };
        }
        return item;
      });
      saveMockData(table, updated);
      return { data: updateData, error: null };
    },
    delete: async () => {
      const data = getMockData(table);
      const updated = data.filter((item: any) => {
        if (currentFilter && item[currentFilter.column] === currentFilter.value) {
          return false;
        }
        return true;
      });
      saveMockData(table, updated);
      return { data: [], error: null };
    },
    upsert: async (newData: any[]) => {
      const data = getMockData(table);
      // Simplified upsert: just insert if not exists based on 'id'
      const updated = [...data];
      newData.forEach(item => {
        const idx = updated.findIndex((u: any) => u.id === item.id);
        if (idx >= 0) updated[idx] = item;
        else updated.push(item);
      });
      saveMockData(table, updated);
      return { data: newData, error: null };
    },
    then: (resolve: any) => {
      let data = getMockData(table);
      if (currentFilter) {
        data = data.filter((item: any) => item[currentFilter!.column] === currentFilter!.value);
      }
      if (isSingle) {
        resolve({ data: data[0] || null, error: data[0] ? null : { message: 'Not found' } });
      } else {
        resolve({ data, error: null });
      }
    },
  };
  return chain;
};

const mockSupabase = {
  from: (table: string) => createMockChain(table),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  }
};

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey || '') 
  : mockSupabase as any;
