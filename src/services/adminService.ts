import { supabase } from './supabase';
import { Order, Comercial, AdminStats, Product, Taller } from '../types';

export const initAdminData = async () => {
  const { data: ordersData } = await supabase.from('orders').select('*');
  const { data: salespeopleData } = await supabase.from('salespeople').select('*');
  
  if ((!ordersData || ordersData.length === 0) && (!salespeopleData || salespeopleData.length === 0)) {
    // If no data, return empty or initial state. 
    // In original code, it generated mock data. I'll skip mock generation to keep DB clean, 
    // but return structure expected.
    return { orders: [], salespeople: [], stats: { totalRevenue: 0, totalOrders: 0, activeSalespeople: 0, inventoryValue: 0, salesGrowth: 0, recentOrders: [] } };
  }
  
  const salespeople = (salespeopleData || []).map(s => ({
    ...s,
    totalSales: s.total_sales || 0,
    joinDate: s.join_date,
    commissions: s.commissions || 0
  })) as Comercial[];

  const orders = (ordersData || []).map(o => ({
    ...o,
    customerName: o.customer_name,
    customerEmail: o.customer_email,
    shippingAddress: o.shipping_address,
    salespersonId: o.salesperson_id
  })) as Order[];

  const stats: AdminStats = {
    totalRevenue: orders.reduce((acc, o) => acc + o.total, 0),
    totalOrders: orders.length,
    activeComerciales: salespeople.filter(s => s.status === 'Activo').length,
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
  return (data || []).map(o => ({
    ...o,
    customerName: o.customer_name,
    customerEmail: o.customer_email,
    shippingAddress: o.shipping_address,
    salespersonId: o.salesperson_id
  })) as Order[];
};

export const addSalesperson = async (salesperson: Omit<Comercial, 'id' | 'joinDate' | 'commissions' | 'totalSales'>) => {
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
  return (data || []).map(s => ({
    ...s,
    totalSales: s.total_sales || 0,
    joinDate: s.join_date,
    commissions: s.commissions || 0
  })) as Comercial[];
};

export const deleteOrder = async (orderId: string) => {
  await supabase.from('orders').delete().eq('id', orderId);
  const { data } = await supabase.from('orders').select('*');
  return (data || []).map(o => ({
    ...o,
    customerName: o.customer_name,
    customerEmail: o.customer_email,
    shippingAddress: o.shipping_address,
    salespersonId: o.salesperson_id
  })) as Order[];
};

export const deleteSalesperson = async (salespersonId: string) => {
  await supabase.from('salespeople').delete().eq('id', salespersonId);
  const { data } = await supabase.from('salespeople').select('*');
  return (data || []).map(s => ({
    ...s,
    totalSales: s.total_sales || 0,
    joinDate: s.join_date,
    commissions: s.commissions || 0
  })) as Comercial[];
};

export const updateSalesperson = async (salespersonId: string, data: Partial<Comercial>) => {
  // Map camelCase to snake_case if needed
  const updateData: any = { ...data };
  if (data.totalSales !== undefined) {
    updateData.total_sales = data.totalSales;
    delete updateData.totalSales;
  }

  await supabase.from('salespeople').update(updateData).eq('id', salespersonId);
  const { data: allData } = await supabase.from('salespeople').select('*');
  return (allData || []).map(s => ({
    ...s,
    totalSales: s.total_sales || 0,
    joinDate: s.join_date,
    commissions: s.commissions || 0
  })) as Comercial[];
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

const mapTallerToSnakeCase = (data: Partial<Taller>) => {
  const mapped: any = { ...data };
  // Map camelCase → snake_case
  if (data.salespersonId !== undefined) { mapped.salesperson_id = data.salespersonId; delete mapped.salespersonId; }
  if (data.shippingAddress !== undefined) { mapped.shipping_address = data.shippingAddress; delete mapped.shippingAddress; }
  if (data.orderContactName !== undefined) { mapped.order_contact_name = data.orderContactName; delete mapped.orderContactName; }
  if (data.orderContactPhone !== undefined) { mapped.order_contact_phone = data.orderContactPhone; delete mapped.orderContactPhone; }
  if (data.orderContactEmail !== undefined) { mapped.order_contact_email = data.orderContactEmail; delete mapped.orderContactEmail; }
  if (data.gdprAccepted !== undefined) { mapped.gdpr_accepted = data.gdprAccepted; delete mapped.gdprAccepted; }
  if (data.gdprAcceptedAt !== undefined) { mapped.gdpr_accepted_at = data.gdprAcceptedAt; delete mapped.gdprAcceptedAt; }
  if (data.clientNumber !== undefined) { mapped.client_number = data.clientNumber; delete mapped.clientNumber; }
  if (data.joinDate !== undefined) { mapped.join_date = data.joinDate; delete mapped.joinDate; }
  return mapped;
};

const mapTallerFromSnakeCase = (t: any): Taller => ({
  ...t,
  joinDate: t.join_date,
  salespersonId: t.salesperson_id,
  shippingAddress: t.shipping_address,
  orderContactName: t.order_contact_name,
  orderContactPhone: t.order_contact_phone,
  orderContactEmail: t.order_contact_email,
  gdprAccepted: t.gdpr_accepted,
  gdprAcceptedAt: t.gdpr_accepted_at,
  clientNumber: t.client_number,
});

export const getTalleres = async (): Promise<Taller[]> => {
  const { data, error } = await supabase.from('talleres').select('*');
  if (error) return [];
  return (data || []).map(mapTallerFromSnakeCase);
};

export const addTaller = async (
  data: Omit<Taller, 'id' | 'joinDate'>
): Promise<Taller> => {
  const id = `TALLER-${Date.now()}`;
  const insertData = mapTallerToSnakeCase({
    ...data,
    id,
    joinDate: new Date().toISOString(),
  } as any);

  // Remove any leftover camelCase keys just in case
  delete insertData.salespersonId;
  delete insertData.shippingAddress;
  delete insertData.orderContactName;
  delete insertData.orderContactPhone;
  delete insertData.orderContactEmail;
  delete insertData.gdprAccepted;
  delete insertData.gdprAcceptedAt;
  delete insertData.clientNumber;

  const { error } = await supabase.from('talleres').insert([insertData]);
  if (error) throw error;
  return { ...data, id, joinDate: new Date().toISOString() } as Taller;
};

export const updateTaller = async (
  tallerId: string,
  data: Partial<Taller>
): Promise<Taller[]> => {
  const updateData = mapTallerToSnakeCase(data);

  await supabase.from('talleres').update(updateData).eq('id', tallerId);
  const { data: allData } = await supabase.from('talleres').select('*');
  return (allData || []).map(mapTallerFromSnakeCase);
};

export const approveTaller = async (
  tallerId: string,
  clientNumber: string,
  salespersonId: string
): Promise<Taller[]> => {
  const updateData = {
    status: 'Activo',
    client_number: clientNumber,
    salesperson_id: salespersonId,
  };
  await supabase.from('talleres').update(updateData).eq('id', tallerId);
  const { data: allData } = await supabase.from('talleres').select('*');
  return (allData || []).map(mapTallerFromSnakeCase);
};

export const deleteTaller = async (tallerId: string): Promise<Taller[]> => {
  await supabase.from('talleres').delete().eq('id', tallerId);
  const { data } = await supabase.from('talleres').select('*');
  return (data || []).map(mapTallerFromSnakeCase);
};



