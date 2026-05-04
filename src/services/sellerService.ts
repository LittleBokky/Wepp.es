import { supabase } from './supabase';
import { Budget, ChatMessage, Taller, Order } from '../types';

export const getSellerTalleres = async (salespersonId: string): Promise<Taller[]> => {
  const { data, error } = await supabase
    .from('talleres')
    .select('*')
    .eq('salesperson_id', salespersonId);
  
  if (error) {
    console.error('Error fetching talleres:', error);
    return [];
  }
  return data as Taller[];
};

export const createTaller = async (data: Omit<Taller, 'id' | 'joinDate'>): Promise<Taller> => {
  const newTaller = {
    ...data,
    id: `TALLER-${Date.now()}`,
    join_date: new Date().toISOString(),
    salesperson_id: data.salespersonId // Map to snake_case for DB
  };
  
  // Remove camelCase salespersonId before inserting if it's not in the DB schema
  const { salespersonId, ...insertData } = newTaller;

  const { error } = await supabase
    .from('talleres')
    .insert([insertData]);
  
  if (error) throw error;
  return newTaller as unknown as Taller;
};

export const createBudget = async (budget: Omit<Budget, 'id' | 'createdAt'>): Promise<Budget> => {
  const newBudget = {
    ...budget,
    id: `BUD-${Date.now()}`,
    created_at: new Date().toISOString(),
    taller_id: budget.tallerId,
    taller_name: budget.tallerName,
    salesperson_id: budget.salespersonId
  };

  const { error } = await supabase
    .from('budgets')
    .insert([newBudget]);
  
  if (error) throw error;
  return newBudget as unknown as Budget;
};

export const getSellerBudgets = async (salespersonId: string): Promise<Budget[]> => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('salesperson_id', salespersonId);
  
  if (error) {
    console.error('Error fetching budgets:', error);
    return [];
  }
  return data as Budget[];
};

export const sendMessage = async (msg: Omit<ChatMessage, 'id' | 'timestamp' | 'read'>): Promise<void> => {
  const { error } = await supabase
    .from('chat_messages')
    .insert([{
      sender_id: msg.senderId,
      receiver_id: msg.receiverId,
      text: msg.text,
      timestamp: new Date().toISOString(),
      read: false
    }]);
  
  if (error) throw error;
};

export const listenToMessages = (userId1: string, userId2: string, callback: (msgs: ChatMessage[]) => void) => {
  // Supabase Realtime for chat
  const channel = supabase
    .channel('public:chat_messages')
    .on('postgres_changes', { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'chat_messages',
      filter: `sender_id=eq.${userId1},receiver_id=eq.${userId2}`
    }, (payload) => {
      // This is a simplified listener. Real implementation would fetch initial messages and then append.
      // For now, we'll fetch all on change to match the old behavior.
      fetchMessages(userId1, userId2, callback);
    })
    .subscribe();

  const fetchMessages = async (u1: string, u2: string, cb: (m: ChatMessage[]) => void) => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .or(`and(sender_id.eq.${u1},receiver_id.eq.${u2}),and(sender_id.eq.${u2},receiver_id.eq.${u1})`)
      .order('timestamp', { ascending: true });
    
    if (data) {
      cb(data.map(m => ({
        id: m.id,
        senderId: m.sender_id,
        receiverId: m.receiver_id,
        text: m.text,
        timestamp: m.timestamp,
        read: m.read
      })));
    }
  };

  fetchMessages(userId1, userId2, callback);

  return () => {
    supabase.removeChannel(channel);
  };
};

export const createWorkshopOrder = async (order: Omit<Order, 'id' | 'date' | 'status'>): Promise<Order> => {
  const newOrder = {
    ...order,
    id: `ORD-W-${Date.now()}`,
    date: new Date().toISOString(),
    status: 'Pendiente',
    customer_name: order.customerName,
    customer_email: order.customerEmail,
    shipping_address: order.shippingAddress,
    salesperson_id: order.salespersonId
  };

  const { error } = await supabase
    .from('orders')
    .insert([newOrder]);
  
  if (error) throw error;
  return newOrder as unknown as Order;
};

