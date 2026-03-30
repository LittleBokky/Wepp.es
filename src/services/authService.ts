import { db } from './firebase';
import { ref, set, get } from 'firebase/database';
import { VendorCredential } from '../types';

const ADMIN_EMAILS = ['michael.geonovatek@gmail.com', 'aarcas04@gmail.com'];

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode('wepp_salt_2024_' + password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export const initAdminAuth = async () => {
  const authRef = ref(db, 'auth/admins');
  const snapshot = await get(authRef);
  if (!snapshot.exists()) {
    const defaultHash = await hashPassword('wepp2024');
    const admins = ADMIN_EMAILS.map((email, i) => ({
      id: `ADMIN-${String(i + 1).padStart(3, '0')}`,
      email,
      passwordHash: defaultHash,
    }));
    await set(authRef, admins);
  }
};

export const loginAdmin = async (
  email: string,
  password: string
): Promise<{ email: string } | null> => {
  const normalizedEmail = email.toLowerCase().trim();
  if (!ADMIN_EMAILS.map(e => e.toLowerCase()).includes(normalizedEmail)) return null;

  await initAdminAuth();

  const authRef = ref(db, 'auth/admins');
  const snapshot = await get(authRef);
  if (!snapshot.exists()) return null;

  const admins = snapshot.val() as Array<{ email: string; passwordHash: string }>;
  const hash = await hashPassword(password);
  const match = admins.find(
    a => a.email.toLowerCase() === normalizedEmail && a.passwordHash === hash
  );
  return match ? { email: match.email } : null;
};

export const loginVendor = async (
  username: string,
  password: string
): Promise<VendorCredential | null> => {
  const vendorsRef = ref(db, 'auth/vendors');
  const snapshot = await get(vendorsRef);
  if (!snapshot.exists()) return null;

  const vendors = Object.values(snapshot.val()) as VendorCredential[];
  const hash = await hashPassword(password);
  return (
    vendors.find(
      v =>
        v.username.toLowerCase() === username.toLowerCase().trim() &&
        v.passwordHash === hash &&
        v.active
    ) || null
  );
};

export const addVendorCredential = async (data: {
  username: string;
  password: string;
  salespersonId: string;
  name: string;
}): Promise<VendorCredential> => {
  const vendorsRef = ref(db, 'auth/vendors');
  const snapshot = await get(vendorsRef);
  const vendors = snapshot.exists() ? snapshot.val() : {};
  const id = `VCRED-${Date.now()}`;
  const passwordHash = await hashPassword(data.password);
  const newCredential: VendorCredential = {
    id,
    username: data.username,
    passwordHash,
    salespersonId: data.salespersonId,
    name: data.name,
    active: true,
    createdAt: new Date().toISOString(),
  };
  vendors[id] = newCredential;
  await set(vendorsRef, vendors);
  return newCredential;
};

export const deleteVendorCredential = async (id: string): Promise<void> => {
  const vendorsRef = ref(db, 'auth/vendors');
  const snapshot = await get(vendorsRef);
  if (snapshot.exists()) {
    const vendors = snapshot.val();
    delete vendors[id];
    await set(vendorsRef, vendors);
  }
};

export const getVendorCredentials = async (): Promise<VendorCredential[]> => {
  const vendorsRef = ref(db, 'auth/vendors');
  const snapshot = await get(vendorsRef);
  if (!snapshot.exists()) return [];
  return Object.values(snapshot.val()) as VendorCredential[];
};

export const changeAdminPassword = async (
  email: string,
  newPassword: string
): Promise<void> => {
  const authRef = ref(db, 'auth/admins');
  const snapshot = await get(authRef);
  if (snapshot.exists()) {
    const admins = snapshot.val() as Array<{
      email: string;
      passwordHash: string;
      id: string;
    }>;
    const hash = await hashPassword(newPassword);
    const updated = admins.map(a =>
      a.email.toLowerCase() === email.toLowerCase() ? { ...a, passwordHash: hash } : a
    );
    await set(authRef, updated);
  }
};
