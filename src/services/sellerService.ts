import { db } from './firebase';
import { ref, set, get, push, onValue, off } from 'firebase/database';
import { Budget, ChatMessage, Taller, Order, Product, VendorCredential } from '../types';

export const getSellerTalleres = async (salespersonId: string): Promise<Taller[]> => {
  const talleresRef = ref(db, 'talleres');
  const snapshot = await get(talleresRef);
  if (!snapshot.exists()) return [];
  const val = snapshot.val();
  const all: Taller[] = Array.isArray(val) ? val : Object.values(val);
  return all.filter(t => t.salespersonId === salespersonId);
};

export const createTaller = async (data: Omit<Taller, 'id' | 'joinDate'>): Promise<Taller> => {
  const talleresRef = ref(db, 'talleres');
  const snapshot = await get(talleresRef);
  const current: Taller[] = snapshot.exists()
    ? Array.isArray(snapshot.val())
      ? snapshot.val()
      : Object.values(snapshot.val())
    : [];
  
  const newTaller: Taller = {
    ...data,
    id: `TALLER-${Date.now()}`,
    joinDate: new Date().toISOString(),
  };
  
  await set(talleresRef, [...current, newTaller]);
  return newTaller;
};

export const createBudget = async (budget: Omit<Budget, 'id' | 'createdAt'>): Promise<Budget> => {
  const budgetsRef = ref(db, 'budgets');
  const newBudgetRef = push(budgetsRef);
  const newBudget: Budget = {
    ...budget,
    id: newBudgetRef.key || `BUD-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  await set(newBudgetRef, newBudget);
  return newBudget;
};

export const getSellerBudgets = async (salespersonId: string): Promise<Budget[]> => {
  const budgetsRef = ref(db, 'budgets');
  const snapshot = await get(budgetsRef);
  if (!snapshot.exists()) return [];
  const val = snapshot.val();
  const all: Budget[] = Object.values(val);
  return all.filter(b => b.salespersonId === salespersonId);
};

export const sendMessage = async (msg: Omit<ChatMessage, 'id' | 'timestamp' | 'read'>): Promise<void> => {
  const chatRef = ref(db, `chats/${msg.senderId}_${msg.receiverId}`);
  const newMessageRef = push(chatRef);
  await set(newMessageRef, {
    ...msg,
    id: newMessageRef.key,
    timestamp: new Date().toISOString(),
    read: false
  });
};

export const listenToMessages = (userId1: string, userId2: string, callback: (msgs: ChatMessage[]) => void) => {
  const chatRef = ref(db, `chats/${userId1}_${userId2}`);
  const listener = onValue(chatRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(Object.values(snapshot.val()));
    } else {
      callback([]);
    }
  });
  return () => off(chatRef, 'value', listener);
};

export const createWorkshopOrder = async (order: Omit<Order, 'id' | 'date' | 'status'>): Promise<Order> => {
  const ordersRef = ref(db, 'admin/orders');
  const snapshot = await get(ordersRef);
  const current = snapshot.exists() ? snapshot.val() : [];
  
  const newOrder: Order = {
    ...order,
    id: `ORD-W-${Date.now()}`,
    date: new Date().toISOString(),
    status: 'Pendiente'
  };
  
  await set(ordersRef, [...current, newOrder]);
  return newOrder;
};
