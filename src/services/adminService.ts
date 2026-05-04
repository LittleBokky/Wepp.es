import { supabase } from './supabase';
import { Order, Salesperson, AdminStats, Product, Taller } from '../types';

export const initAdminData = async () => {
  const { data: ordersData } = await supabase.from('orders').select('*');
  const { data: salespeopleData } = await supabase.from('salespeople').select('*');
  
  if ((!ordersData || ordersData.length === 0) && (!salespeopleData || salespeopleData.length === 0)) {
    // If no data, return empty or initial state. 
    // In original code, it generated mock data. I'll skip mock generation to keep DB clean, 
    // but return structure expected.
    return { orders: [], salespeople: [], stats: { totalRevenue: 0, totalOrders: 0, activeSalespeople: 0, inventoryValue: 0, salesGrowth: 0, recentOrders: [] } };
  }
  
  const orders = (ordersData || []) as Order[];
  const salespeople = (salespeopleData || []) as Salesperson[];

  const stats: AdminStats = {
    totalRevenue: orders.reduce((acc, o) => acc + o.total, 0),
    totalOrders: orders.length,
    activeSalespeople: salespeople.filter(s => s.status === 'Activo').length,
    inventoryValue: 154200.00,
    salesGrowth: 15.4,
    recentOrders: orders.slice(0, 5)
  };
  
  return { orders, salespeople, stats };
};

export const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
  const { error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);
  
  if (error) throw error;
  
  const { data } = await supabase.from('orders').select('*');
  return (data || []) as Order[];
};

export const addSalesperson = async (salesperson: Omit<Salesperson, 'id' | 'joinDate' | 'commissions' | 'totalSales'>) => {
  const newSalesperson = {
    ...salesperson,
    id: `VEND-00${Date.now()}`, // Simple ID generation
    join_date: new Date().toISOString(),
    commissions: 0,
    total_sales: 0
  };
  
  const { error } = await supabase.from('salespeople').insert([newSalesperson]);
  if (error) throw error;

  const { data } = await supabase.from('salespeople').select('*');
  return (data || []) as Salesperson[];
};

export const deleteOrder = async (orderId: string) => {
  await supabase.from('orders').delete().eq('id', orderId);
  const { data } = await supabase.from('orders').select('*');
  return (data || []) as Order[];
};

export const deleteSalesperson = async (salespersonId: string) => {
  await supabase.from('salespeople').delete().eq('id', salespersonId);
  const { data } = await supabase.from('salespeople').select('*');
  return (data || []) as Salesperson[];
};

export const updateSalesperson = async (salespersonId: string, data: Partial<Salesperson>) => {
  // Map camelCase to snake_case if needed
  const updateData: any = { ...data };
  if (data.totalSales !== undefined) {
    updateData.total_sales = data.totalSales;
    delete updateData.totalSales;
  }

  await supabase.from('salespeople').update(updateData).eq('id', salespersonId);
  const { data: allData } = await supabase.from('salespeople').select('*');
  return (allData || []) as Salesperson[];
};

export const deleteProduct = async (productId: string) => {
  await supabase.from('products').delete().eq('id', productId);
  const { data } = await supabase.from('products').select('*');
  return (data || []) as any[];
};

export const updateProduct = async (productId: string, data: Partial<Product>) => {
  await supabase.from('products').update(data).eq('id', productId);
  const { data: allData } = await supabase.from('products').select('*');
  return (allData || []) as any[];
};

// ─── Talleres ───────────────────────────────────────────────────────────────

export const getTalleres = async (): Promise<Taller[]> => {
  const { data, error } = await supabase.from('talleres').select('*');
  if (error) return [];
  return (data || []) as Taller[];
};

export const addTaller = async (
  data: Omit<Taller, 'id' | 'joinDate'>
): Promise<Taller> => {
  const newTaller = {
    ...data,
    id: `TALLER-${Date.now()}`,
    join_date: new Date().toISOString(),
    salesperson_id: data.salespersonId
  };
  // Remove camelCase
  const { salespersonId, ...insertData } = newTaller;

  const { error } = await supabase.from('talleres').insert([insertData]);
  if (error) throw error;
  return newTaller as unknown as Taller;
};

export const updateTaller = async (
  tallerId: string,
  data: Partial<Taller>
): Promise<Taller[]> => {
  const updateData: any = { ...data };
  if (data.salespersonId !== undefined) {
    updateData.salesperson_id = data.salespersonId;
    delete updateData.salespersonId;
  }

  await supabase.from('talleres').update(updateData).eq('id', tallerId);
  const { data: allData } = await supabase.from('talleres').select('*');
  return (allData || []) as Taller[];
};

export const deleteTaller = async (tallerId: string): Promise<Taller[]> => {
  await supabase.from('talleres').delete().eq('id', tallerId);
  const { data } = await supabase.from('talleres').select('*');
  return (data || []) as Taller[];
};



