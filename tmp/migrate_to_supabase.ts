import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Replace with your actual Supabase URL and Key if not using .env
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrateProducts() {
  console.log('Reading productos.json...');
  const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'productos.json'), 'utf8'));
  const products = data.products;

  console.log(`Found ${products.length} products. Uploading to Supabase...`);

  const { error } = await supabase
    .from('products')
    .upsert(products);

  if (error) {
    console.error('Error migrating products:', error);
  } else {
    console.log('Products migrated successfully!');
  }
}

migrateProducts();
