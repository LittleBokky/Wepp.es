import { supabase } from './supabase';
import { VendorCredential } from '../types';

const ADMIN_EMAILS = ['michael.geonovatek@gmail.com', 'aarcas04@gmail.com', 'virexar@gmail.com'];

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode('wepp_salt_2024_' + password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export const initAuth = async () => {
  // Init Default Vendor if not exists
  const { data: vendorData, error: vendorError } = await supabase
    .from('vendor_credentials')
    .select('id')
    .eq('username', 'roberto_vendedor')
    .single();

  if (!vendorData && !vendorError) {
    const vHash = await hashPassword('vendedor123');
    const defaultVendor = {
      id: 'VCRED-001',
      username: 'roberto_vendedor',
      password_hash: vHash,
      salesperson_id: 'VEND-001',
      name: 'Roberto Gómez',
      active: true,
      created_at: new Date().toISOString()
    };
    await supabase.from('vendor_credentials').insert([defaultVendor]);
  }
};

export const loginAdmin = async (
  email: string,
  password: string
): Promise<{ email: string } | null> => {
  const normalizedEmail = email.toLowerCase().trim();
  if (!ADMIN_EMAILS.map(e => e.toLowerCase()).includes(normalizedEmail)) return null;

  // For Admins, we might want a separate table or just check against hardcoded emails if they use a shared password or external auth.
  // In the original code, it was fetching from 'auth/admins'. Let's assume a 'admins' table or similar.
  // For now, let's just check the hardcoded list and a fixed password or similar if we haven't migrated admin table.
  // If we want to keep it exactly like before:
  const { data: admins, error } = await supabase.from('admins').select('*');
  if (error || !admins) return null;

  const hash = await hashPassword(password);
  const match = admins.find(
    (a: any) => a.email.toLowerCase() === normalizedEmail && a.password_hash === hash
  );
  return match ? { email: match.email } : null;
};

export const loginVendor = async (
  username: string,
  password: string
): Promise<VendorCredential | null> => {
  await initAuth();
  const hash = await hashPassword(password);
  
  const { data, error } = await supabase
    .from('vendor_credentials')
    .select('*')
    .eq('username', username.toLowerCase().trim())
    .eq('password_hash', hash)
    .eq('active', true)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    username: data.username,
    passwordHash: data.password_hash,
    salespersonId: data.salesperson_id,
    name: data.name,
    active: data.active,
    createdAt: data.created_at
  };
};

export const addVendorCredential = async (data: {
  username: string;
  password: string;
  salespersonId: string;
  name: string;
}): Promise<VendorCredential> => {
  const id = `VCRED-${Date.now()}`;
  const passwordHash = await hashPassword(data.password);
  const newCredential = {
    id,
    username: data.username,
    password_hash: passwordHash,
    salesperson_id: data.salespersonId,
    name: data.name,
    active: true,
    created_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('vendor_credentials').insert([newCredential]);
  if (error) throw error;

  return {
    ...newCredential,
    passwordHash: newCredential.password_hash,
    createdAt: newCredential.created_at,
    salespersonId: newCredential.salesperson_id
  } as unknown as VendorCredential;
};

export const deleteVendorCredential = async (id: string): Promise<void> => {
  await supabase.from('vendor_credentials').delete().eq('id', id);
};

export const getVendorCredentials = async (): Promise<VendorCredential[]> => {
  const { data, error } = await supabase.from('vendor_credentials').select('*');
  if (error) return [];
  return data.map((v: any) => ({
    id: v.id,
    username: v.username,
    passwordHash: v.password_hash,
    salespersonId: v.salesperson_id,
    name: v.name,
    active: v.active,
    createdAt: v.created_at
  }));
};

export const changeAdminPassword = async (
  email: string,
  newPassword: string
): Promise<void> => {
  const hash = await hashPassword(newPassword);
  await supabase
    .from('admins')
    .update({ password_hash: hash })
    .eq('email', email.toLowerCase());
};

