import React, { useState, useEffect } from 'react';
import { ShoppingCart, TrendingUp, DollarSign, Package, LogOut, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { VendorCredential, Order, Salesperson } from '../types';
import { ref, get } from 'firebase/database';
import { db } from '../services/firebase';

interface VendorPortalProps {
  credential: VendorCredential;
  onClose: () => void;
}

export const VendorPortal: React.FC<VendorPortalProps> = ({ credential, onClose }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [salesperson, setSalesperson] = useState<Salesperson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [ordersSnap, salespeopleSnap] = await Promise.all([
        get(ref(db, 'admin/orders')),
        get(ref(db, 'admin/salespeople')),
      ]);

      if (ordersSnap.exists()) {
        const allOrders: Order[] = ordersSnap.val();
        setOrders(allOrders.filter(o => o.salespersonId === credential.salespersonId));
      }

      if (salespeopleSnap.exists()) {
        const all: Salesperson[] = salespeopleSnap.val();
        setSalesperson(all.find(s => s.id === credential.salespersonId) || null);
      }

      setLoading(false);
    };
    loadData();
  }, [credential.salespersonId]);

  const myRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const myCommissions = salesperson?.commissions ?? 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-wepp-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-wepp-navy text-white px-6 md:px-12 py-6 flex items-center justify-between">
        <div>
          <p className="text-wepp-red text-[9px] font-black uppercase tracking-[0.4em] mb-1">
            Portal Vendedor
          </p>
          <h1 className="text-2xl font-black uppercase tracking-tighter">
            Bienvenido, {credential.name}
          </h1>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-2 border border-white/20 px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          <LogOut className="w-4 h-4" /> Cerrar Sesión
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {[
            {
              label: 'Mis Pedidos',
              value: orders.length,
              icon: ShoppingCart,
              color: 'blue',
            },
            {
              label: 'Ventas Totales',
              value: `${myRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€`,
              icon: TrendingUp,
              color: 'emerald',
            },
            {
              label: 'Mis Comisiones',
              value: `${myCommissions.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€`,
              icon: DollarSign,
              color: 'amber',
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-slate-100 p-8 shadow-sm"
            >
              <stat.icon className={`w-8 h-8 mb-4 text-${stat.color}-500`} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-black text-wepp-navy tracking-tighter">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="p-8 border-b border-slate-50 flex items-center gap-4">
            <Package className="w-5 h-5 text-wepp-red" />
            <h2 className="text-sm font-black uppercase tracking-widest text-wepp-navy">
              Mis Pedidos
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="p-16 text-center">
              <ShoppingCart className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 text-sm font-medium">No hay pedidos asignados aún</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      ID
                    </th>
                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Cliente
                    </th>
                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Total
                    </th>
                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Estado
                    </th>
                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5 text-xs font-black text-wepp-navy">{order.id}</td>
                      <td className="px-8 py-5 text-xs font-bold text-wepp-navy">
                        {order.customerName}
                      </td>
                      <td className="px-8 py-5 text-xs font-black text-wepp-navy">
                        {order.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€
                      </td>
                      <td className="px-8 py-5">
                        <span
                          className={`inline-flex px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                            order.status === 'Entregado'
                              ? 'bg-emerald-50 text-emerald-600'
                              : order.status === 'Pendiente'
                              ? 'bg-amber-50 text-amber-600'
                              : order.status === 'Cancelado'
                              ? 'bg-red-50 text-red-600'
                              : 'bg-blue-50 text-blue-600'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-xs text-slate-400">
                        {new Date(order.date).toLocaleDateString('es-ES')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};
