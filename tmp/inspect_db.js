import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mdpmqndnbwohkddwbiff.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcG1xbmRuYndvaGtkZHdiaWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4ODUyNzMsImV4cCI6MjA5MzQ2MTI3M30.qzd5xYkJ3xurcrX0v5FS114oCxX0ALsmMgk-4VtL6II';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.from('products').select('*').limit(1);
  if (error) {
    console.error('Error fetching from products:', error);
  } else {
    console.log('Sample product:', data[0]);
  }
}

main();
