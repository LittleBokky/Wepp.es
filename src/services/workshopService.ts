import { supabase } from './supabase';
import { Budget, ChatMessage, Taller, Order } from '../types';

export const getWorkshopData = async (tallerId: string) => {
  const { data: taller } = await supabase
    .from('talleres')
    .select('*')
    .eq('id', tallerId)
    .single();

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_name', taller?.name || '');

  const { data: budgets } = await supabase
    .from('budgets')
    .select('*')
    .eq('taller_id', tallerId);

  return {
    taller: taller as Taller,
    orders: (orders || []) as Order[],
    budgets: (budgets || []) as Budget[]
  };
};

export const getWorkshopOrders = async (tallerName: string): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_name', tallerName);
  
  if (error) return [];
  return data as Order[];
};

export const getWorkshopBudgets = async (tallerId: string): Promise<Budget[]> => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('taller_id', tallerId);
  
  if (error) return [];
  return data as Budget[];
};
