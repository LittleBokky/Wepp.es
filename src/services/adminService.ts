import { db } from './firebase';
import { ref, set, get } from 'firebase/database';
import { Order, Salesperson, AdminStats, PRODUCTS, Product } from '../types';

// Mock data generation for orders
const generateMockOrders = (): Order[] => {
  const statuses: Order['status'][] = ['Pendiente', 'Procesando', 'Enviado', 'Entregado'];
  return Array.from({ length: 15 }).map((_, i) => {
    const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    const qty = Math.floor(Math.random() * 5) + 1;
    return {
      id: `ORD-${2025000 + i}`,
      customerName: ['Juan Perez', 'Maria Garcia', 'Carlos Rodriguez', 'Ana Martinez', 'Luis Fernandez'][Math.floor(Math.random() * 5)],
      customerEmail: `customer${i}@example.com`,
      items: [{
        productId: product.id,
        productName: product.name,
        quantity: qty,
        price: product.price
      }],
      total: product.price * qty,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      date: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString(),
      shippingAddress: 'Calle Falsa 123, Madrid, España',
      salespersonId: `VEND-00${Math.floor(Math.random() * 3) + 1}`
    };
  });
};

// Mock data generation for salespeople
const generateMockSalespeople = (): Salesperson[] => {
  return [
    {
      id: 'VEND-001',
      name: 'Roberto Gómez',
      email: 'roberto@wepp.es',
      region: 'Madrid Norte',
      commissions: 1250.50,
      totalSales: 25400.00,
      status: 'Activo',
      joinDate: '2024-01-15T10:00:00Z'
    },
    {
      id: 'VEND-002',
      name: 'Elena Sanchez',
      email: 'elena@wepp.es',
      region: 'Barcelona Centro',
      commissions: 980.20,
      totalSales: 18500.00,
      status: 'Activo',
      joinDate: '2024-03-22T10:00:00Z'
    },
    {
      id: 'VEND-003',
      name: 'Javier Lopez',
      email: 'javier@wepp.es',
      region: 'Valencia Sur',
      commissions: 450.00,
      totalSales: 9200.00,
      status: 'Activo',
      joinDate: '2024-06-10T10:00:00Z'
    },
    {
      id: 'VEND-004',
      name: 'Sofia Ruiz',
      email: 'sofia@wepp.es',
      region: 'Sevilla',
      commissions: 0,
      totalSales: 0,
      status: 'Inactivo',
      joinDate: '2024-11-05T10:00:00Z'
    }
  ];
};

export const initAdminData = async () => {
  const adminRef = ref(db, 'admin');
  const snapshot = await get(adminRef);
  
  if (!snapshot.exists()) {
    const orders = generateMockOrders();
    const salespeople = generateMockSalespeople();
    
    await set(ref(db, 'admin/orders'), orders);
    await set(ref(db, 'admin/salespeople'), salespeople);
    
    const stats: AdminStats = {
      totalRevenue: orders.reduce((acc, o) => acc + o.total, 0),
      totalOrders: orders.length,
      activeSalespeople: salespeople.filter(s => s.status === 'Activo').length,
      inventoryValue: 154200.00,
      salesGrowth: 15.4,
      recentOrders: orders.slice(0, 5)
    };
    
    await set(ref(db, 'admin/stats'), stats);
    return { orders, salespeople, stats };
  }
  
  return snapshot.val();
};

export const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
  const ordersRef = ref(db, 'admin/orders');
  const snapshot = await get(ordersRef);
  if (snapshot.exists()) {
    const orders: Order[] = snapshot.val();
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    await set(ordersRef, updatedOrders);
    return updatedOrders;
  }
  return [];
};

export const addSalesperson = async (salesperson: Omit<Salesperson, 'id' | 'joinDate' | 'commissions' | 'totalSales'>) => {
  const salespeopleRef = ref(db, 'admin/salespeople');
  const snapshot = await get(salespeopleRef);
  const currentSalespeople = snapshot.exists() ? snapshot.val() : [];
  
  const newSalesperson: Salesperson = {
    ...salesperson,
    id: `VEND-00${currentSalespeople.length + 1}`,
    joinDate: new Date().toISOString(),
    commissions: 0,
    totalSales: 0
  };
  
  const updatedSalespeople = [...currentSalespeople, newSalesperson];
  await set(salespeopleRef, updatedSalespeople);
  return updatedSalespeople;
};

export const deleteOrder = async (orderId: string) => {
  const ordersRef = ref(db, 'admin/orders');
  const snapshot = await get(ordersRef);
  if (snapshot.exists()) {
    const orders: Order[] = snapshot.val();
    const updatedOrders = orders.filter(o => o.id !== orderId);
    await set(ordersRef, updatedOrders);
    return updatedOrders;
  }
  return [];
};

export const deleteSalesperson = async (salespersonId: string) => {
  const salespeopleRef = ref(db, 'admin/salespeople');
  const snapshot = await get(salespeopleRef);
  if (snapshot.exists()) {
    const salespeople: Salesperson[] = snapshot.val();
    const updatedSalespeople = salespeople.filter(s => s.id !== salespersonId);
    await set(salespeopleRef, updatedSalespeople);
    return updatedSalespeople;
  }
  return [];
};

export const updateSalesperson = async (salespersonId: string, data: Partial<Salesperson>) => {
  const salespeopleRef = ref(db, 'admin/salespeople');
  const snapshot = await get(salespeopleRef);
  if (snapshot.exists()) {
    const salespeople: Salesperson[] = snapshot.val();
    const updatedSalespeople = salespeople.map(s => s.id === salespersonId ? { ...s, ...data } : s);
    await set(salespeopleRef, updatedSalespeople);
    return updatedSalespeople;
  }
  return [];
};

export const deleteProduct = async (productId: string) => {
  const productsRef = ref(db, 'products');
  const snapshot = await get(productsRef);
  if (snapshot.exists()) {
    const products: any[] = snapshot.val();
    const updatedProducts = products.filter(p => p.id !== productId);
    await set(productsRef, updatedProducts);
    return updatedProducts;
  }
  return [];
};

export const updateProduct = async (productId: string, data: Partial<Product>) => {
  const productsRef = ref(db, 'products');
  const snapshot = await get(productsRef);
  if (snapshot.exists()) {
    const products: any[] = snapshot.val();
    const updatedProducts = products.map(p => p.id === productId ? { ...p, ...data } : p);
    await set(productsRef, updatedProducts);
    return updatedProducts;
  }
  return [];
};

// ─── Talleres ───────────────────────────────────────────────────────────────

import { Taller } from '../types';

export const getTalleres = async (): Promise<Taller[]> => {
  const talleresRef = ref(db, 'talleres');
  const snapshot = await get(talleresRef);
  if (!snapshot.exists()) return [];
  const val = snapshot.val();
  if (Array.isArray(val)) return val;
  return Object.values(val) as Taller[];
};

export const addTaller = async (
  data: Omit<Taller, 'id' | 'joinDate'>
): Promise<Taller> => {
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
  const updated = [...current, newTaller];
  await set(talleresRef, updated);
  return newTaller;
};

export const updateTaller = async (
  tallerId: string,
  data: Partial<Taller>
): Promise<Taller[]> => {
  const talleresRef = ref(db, 'talleres');
  const snapshot = await get(talleresRef);
  if (!snapshot.exists()) return [];
  const current: Taller[] = Array.isArray(snapshot.val())
    ? snapshot.val()
    : Object.values(snapshot.val());
  const updated = current.map(t => (t.id === tallerId ? { ...t, ...data } : t));
  await set(talleresRef, updated);
  return updated;
};

export const deleteTaller = async (tallerId: string): Promise<Taller[]> => {
  const talleresRef = ref(db, 'talleres');
  const snapshot = await get(talleresRef);
  if (!snapshot.exists()) return [];
  const current: Taller[] = Array.isArray(snapshot.val())
    ? snapshot.val()
    : Object.values(snapshot.val());
  const updated = current.filter(t => t.id !== tallerId);
  await set(talleresRef, updated);
  return updated;
};


