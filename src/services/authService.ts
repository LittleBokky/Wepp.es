import { supabase } from './supabase';
import { VendorCredential, WorkshopCredential } from '../types';

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
      username: 'roberto_comercial',
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

  // DEVELOPMENT BYPASS
  if (normalizedEmail === 'admin@wepp.es' && password === 'admin123') {
    return { email: normalizedEmail };
  }
  
  if (!ADMIN_EMAILS.map(e => e.toLowerCase()).includes(normalizedEmail)) return null;

  // For Admins, we might want a separate table or just check against hardcoded emails if they use a shared password or external auth.
  const { data: admins, error } = await supabase.from('admins').select('*');
  
  // Fallback to successful login if email is in ADMIN_EMAILS and DB is unavailable/empty (for testing)
  if ((!admins || admins.length === 0) && password === 'admin123' && ADMIN_EMAILS.map(e => e.toLowerCase()).includes(normalizedEmail)) {
    return { email: normalizedEmail };
  }

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
  const normalizedUsername = username.toLowerCase().trim();

  // DEVELOPMENT BYPASS
  if (normalizedUsername === 'roberto_comercial' && password === 'comercial123') {
    return {
      id: 'VCRED-001',
      username: 'roberto_comercial',
      passwordHash: '',
      salespersonId: 'VEND-001',
      name: 'Roberto Gómez',
      active: true,
      createdAt: new Date().toISOString()
    };
  }

  await initAuth();
  const hash = await hashPassword(password);
  
  const { data, error } = await supabase
    .from('vendor_credentials')
    .select('*')
    .eq('username', normalizedUsername)
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

export const loginWorkshop = async (
  username: string,
  password: string
): Promise<WorkshopCredential | null> => {
  const normalizedUsername = username.toLowerCase().trim();

  // DEVELOPMENT BYPASS
  if (normalizedUsername === 'taller_demo' && password === 'taller123') {
    return {
      id: 'WCRED-001',
      username: 'taller_demo',
      passwordHash: '',
      tallerId: 'TALLER-001',
      name: 'Taller Demo Wepp',
      active: true,
      createdAt: new Date().toISOString()
    };
  }

  const hash = await hashPassword(password);
  
  const { data, error } = await supabase
    .from('workshop_credentials')
    .select('*')
    .eq('username', normalizedUsername)
    .eq('password_hash', hash)
    .eq('active', true)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    username: data.username,
    passwordHash: data.password_hash,
    tallerId: data.taller_id,
    name: data.name,
    active: data.active,
    createdAt: data.created_at
  };
};

export const getWorkshopCredentials = async (): Promise<WorkshopCredential[]> => {
  const { data, error } = await supabase.from('workshop_credentials').select('*');
  if (error) return [];
  return data.map((w: any) => ({
    id: w.id,
    username: w.username,
    passwordHash: w.password_hash,
    tallerId: w.taller_id,
    name: w.name,
    active: w.active,
    createdAt: w.created_at
  }));
};

export const addWorkshopCredential = async (data: {
  username: string;
  password: string;
  tallerId: string;
  name: string;
}): Promise<WorkshopCredential> => {
  const id = `WCRED-${Date.now()}`;
  const passwordHash = await hashPassword(data.password);
  const newCredential = {
    id,
    username: data.username,
    password_hash: passwordHash,
    taller_id: data.tallerId,
    name: data.name,
    active: true,
    created_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('workshop_credentials').insert([newCredential]);
  if (error) throw error;

  return {
    ...newCredential,
    passwordHash: newCredential.password_hash,
    createdAt: newCredential.created_at,
    tallerId: newCredential.taller_id
  } as unknown as WorkshopCredential;
};

export const updateWorkshopCredential = async (id: string, data: {
  username?: string;
  name?: string;
  password?: string;
  active?: boolean;
}): Promise<void> => {
  const updateData: any = { ...data };
  if (data.password) {
    updateData.password_hash = await hashPassword(data.password);
    delete updateData.password;
  }
  const { error } = await supabase
    .from('workshop_credentials')
    .update(updateData)
    .eq('id', id);
  
  if (error) throw error;
};

export const deleteWorkshopCredential = async (id: string): Promise<void> => {
  await supabase.from('workshop_credentials').delete().eq('id', id);
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

export const updateVendorCredential = async (id: string, data: {
  username?: string;
  name?: string;
  password?: string;
  active?: boolean;
}): Promise<void> => {
  const updateData: any = { ...data };
  if (data.password) {
    updateData.password_hash = await hashPassword(data.password);
    delete updateData.password;
  }
  const { error } = await supabase
    .from('vendor_credentials')
    .update(updateData)
    .eq('id', id);
  
  if (error) throw error;
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

