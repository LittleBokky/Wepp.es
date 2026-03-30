import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Package, 
  Settings, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  ChevronRight, 
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Ban,
  ArrowUpRight,
  Trash2,
  Edit3,
  X as CloseIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  initAdminData, 
  updateOrderStatus, 
  addSalesperson, 
  deleteOrder, 
  deleteSalesperson, 
  updateSalesperson,
  deleteProduct,
  updateProduct
} from '../services/adminService';

import { Order, Salesperson, AdminStats, Product, PRODUCTS } from '../types';


interface AdminPortalProps {
  onClose: () => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onClose, products, setProducts }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'salespeople' | 'inventory' | 'settings'>('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [salespeople, setSalespeople] = useState<Salesperson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [editingSalesperson, setEditingSalesperson] = useState<Salesperson | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);


  useEffect(() => {

    const loadData = async () => {
      const data = await initAdminData();
      setStats(data.stats);
      setOrders(data.orders);
      setSalespeople(data.salespeople);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = await updateOrderStatus(orderId, newStatus);
    setOrders(updatedOrders);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm('¿Estás seguro de eliminar este pedido?')) {
      const updatedOrders = await deleteOrder(orderId);
      setOrders(updatedOrders);
    }
  };

  const handleDeleteSalesperson = async (salespersonId: string) => {
    if (confirm('¿Estás seguro de eliminar este vendedor?')) {
      const updatedSalespeople = await deleteSalesperson(salespersonId);
      setSalespeople(updatedSalespeople);
    }
  };

  const handleUpdateSalesperson = async (id: string, data: Partial<Salesperson>) => {
    const updatedSalespeople = await updateSalesperson(id, data);
    setSalespeople(updatedSalespeople);
    setEditingSalesperson(null);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      await deleteProduct(productId);
      // No need to setProducts here as onValue in App.tsx will catch it
    }
  };

  const handleUpdateProduct = async (id: string, data: Partial<Product>) => {
    await updateProduct(id, data);
    setEditingProduct(null);
  };



  const tabs = [
    { id: 'dashboard', label: 'Panel General', icon: LayoutDashboard },
    { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
    { id: 'salespeople', label: 'Vendedores', icon: Users },
    { id: 'inventory', label: 'Inventario', icon: Package },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-wepp-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-wepp-navy text-white flex flex-col h-screen overflow-hidden sticky top-0">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-wepp-red font-black text-xs tracking-widest uppercase">Admin Portal</span>
            <span className="text-xl font-black uppercase tracking-tighter">WEPP GLOBAL</span>
          </div>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="md:hidden text-white/60 hover:text-white"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2 mt-4 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-4 px-4 py-4 transition-all group ${
                activeTab === tab.id 
                  ? 'bg-wepp-red text-white' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`} />
              <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
              {activeTab === tab.id && (
                <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 bg-slate-900/50 mt-auto border-t border-white/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-wepp-red to-orange-500 flex items-center justify-center font-black">AD</div>
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase">Administrador</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">Online</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-full py-2 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-wepp-navy uppercase tracking-tighter mb-2">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-slate-400 text-sm font-medium">Panel de control de la empresa · {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar globalmente..." 
                className="bg-white border border-slate-200 rounded-none px-12 py-3 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-wepp-red transition-all w-64"
              />
            </div>
            <button className="bg-wepp-navy text-white px-8 py-3 font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-wepp-red transition-all shadow-xl shadow-slate-200">
              <RefreshCw className="w-4 h-4" /> Refrescar Datos
            </button>
          </div>
        </header>

        {/* Dynamic Content based on activeTab */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'dashboard' && stats && (
              <div className="space-y-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Ingresos Totales', value: `${stats.totalRevenue.toLocaleString()}€`, icon: DollarSign, color: 'emerald', trend: '+12.5%' },
                    { label: 'Pedidos Realizados', value: stats.totalOrders, icon: ShoppingCart, color: 'wepp-red', trend: '+5.2%' },
                    { label: 'Vendedores Activos', value: stats.activeSalespeople, icon: Users, color: 'blue', trend: '0%' },
                    { label: 'Valor Inventario', value: `${stats.inventoryValue.toLocaleString()}€`, icon: Package, color: 'amber', trend: '-2.1%' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
                      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-${stat.color === 'wepp-red' ? 'red-500' : stat.color + '-500'}/10 rounded-full group-hover:scale-150 transition-transform duration-700`}></div>
                      <stat.icon className={`w-10 h-10 mb-6 ${stat.color === 'wepp-red' ? 'text-red-500' : 'text-' + stat.color + '-500'}`} />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</span>
                        <div className="flex items-end gap-3">
                          <span className="text-3xl font-black text-wepp-navy tracking-tighter leading-none">{stat.value}</span>
                          <span className={`text-[10px] font-black ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{stat.trend}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Main View: Recent Orders & Performance */}
                <div className="grid lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 bg-white border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <TrendingUp className="w-5 h-5 text-wepp-red" />
                        <h3 className="text-sm font-black uppercase tracking-widest text-wepp-navy">Pedidos Recientes</h3>
                      </div>
                      <button className="text-[10px] font-black text-wepp-red uppercase tracking-widest hover:underline flex items-center gap-2">
                        Ver todo <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50">
                            <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">ID Pedido</th>
                            <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Cliente</th>
                            <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Total</th>
                            <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Estado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {orders.slice(0, 5).map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-8 py-6 text-xs font-black text-wepp-navy">{order.id}</td>
                              <td className="px-8 py-6">
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-wepp-navy">{order.customerName}</span>
                                  <span className="text-[10px] text-slate-400">{order.customerEmail}</span>
                                </div>
                              </td>
                              <td className="px-8 py-6 text-xs font-black text-wepp-navy">{order.total.toLocaleString()}€</td>
                              <td className="px-8 py-6">
                                <span className={`inline-flex px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                                  order.status === 'Entregado' ? 'bg-emerald-50 text-emerald-600' : 
                                  order.status === 'Pendiente' ? 'bg-amber-50 text-amber-600' :
                                  'bg-blue-50 text-blue-600'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white border border-slate-100 shadow-sm p-8">
                      <h3 className="text-sm font-black uppercase tracking-widest text-wepp-navy mb-8">Performance por Región</h3>
                      <div className="space-y-6">
                        {[
                          { region: 'Madrid', sales: 45, color: 'wepp-red' },
                          { region: 'Barcelona', sales: 30, color: 'blue' },
                          { region: 'Valencia', sales: 15, color: 'amber' },
                          { region: 'Otros', sales: 10, color: 'slate' }
                        ].map((reg, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                              <span>{reg.region}</span>
                              <span className="text-slate-400">{reg.sales}%</span>
                            </div>
                            <div className="h-1 bg-slate-100 w-full rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${reg.sales}%` }}
                                className={`h-full ${reg.color === 'wepp-red' ? 'bg-red-500' : 'bg-' + reg.color + '-500'}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-wepp-navy p-8 relative overflow-hidden group shadow-2xl">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Activity className="w-24 h-24 text-white" />
                      </div>
                      <h3 className="text-white font-black uppercase text-xl leading-none tracking-tighter mb-4">Empresa Nivel 1</h3>
                      <p className="text-slate-400 text-xs mb-8">Estado operativo garantizado al 100%. Sistemas en tiempo real conectados.</p>
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-emerald-500 text-[9px] font-black uppercase tracking-widest">Servidores Activos</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white border border-slate-100 shadow-sm">
                <div className="p-8 border-b border-slate-50 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <ShoppingCart className="w-5 h-5 text-wepp-red" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-wepp-navy">Gestión de Pedidos</h3>
                  </div>
                  <div className="flex gap-2">
                    {['Todos', 'Pendiente', 'Enviado', 'Entregado'].map(f => (
                      <button
                        key={f}
                        onClick={() => setStatusFilter(f)}
                        className={`px-6 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${
                          statusFilter === f ? 'bg-wepp-navy text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">ID</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Fecha</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Cliente</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Artículos</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Total</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Estado</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {orders
                        .filter(o => statusFilter === 'Todos' || o.status === statusFilter)
                        .map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-8 py-6 text-xs font-black text-wepp-navy">{order.id}</td>
                          <td className="px-8 py-6 text-xs text-slate-500">{new Date(order.date).toLocaleDateString()}</td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-wepp-navy">{order.customerName}</span>
                              <span className="text-[10px] text-slate-400">{order.customerEmail}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col gap-1">
                              {order.items.map((item, i) => (
                                <span key={i} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                                  {item.quantity}x {item.productName}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-sm font-black text-wepp-navy">{order.total.toLocaleString()}€</td>
                          <td className="px-8 py-6">
                            <select 
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                              className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest border-none focus:ring-1 focus:ring-wepp-red ${
                                order.status === 'Entregado' ? 'bg-emerald-50 text-emerald-600' : 
                                order.status === 'Pendiente' ? 'bg-amber-50 text-amber-600' :
                                'bg-blue-50 text-blue-600'
                              }`}
                            >
                              <option value="Pendiente">Pendiente</option>
                              <option value="Procesando">Procesando</option>
                              <option value="Enviado">Enviado</option>
                              <option value="Entregado">Entregado</option>
                              <option value="Cancelado">Cancelado</option>
                            </select>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleDeleteOrder(order.id)}
                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-slate-400 hover:text-wepp-navy transition-colors">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'salespeople' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center bg-white p-8 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <Users className="w-5 h-5 text-wepp-red" />
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-wepp-navy leading-none mb-2">Equipo de Ventas</h3>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Gestionar accesos y comisiones</p>
                    </div>
                  </div>
                  <button className="bg-wepp-red text-white px-8 py-3 font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-wepp-navy transition-all shadow-xl shadow-red-100">
                    <Plus className="w-4 h-4" /> Nuevo Vendedor
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {salespeople.map((person) => (
                    <div key={person.id} className="bg-white p-8 border border-slate-100 shadow-sm group hover:border-wepp-red transition-all relative">
                      <div className="flex items-center justify-between mb-8">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-wepp-navy font-black">
                          {person.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest ${
                          person.status === 'Activo' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                        }`}>
                          {person.status}
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-wepp-navy leading-tight mb-1">{person.name}</h4>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-6">{person.region}</p>
                      
                      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ventas</span>
                          <span className="text-sm font-black text-wepp-navy">{person.totalSales.toLocaleString()}€</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Comisión</span>
                          <span className="text-sm font-black text-wepp-red">{person.commissions.toLocaleString()}€</span>
                        </div>
                      </div>
                      
                      <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => setEditingSalesperson(person)}
                          className="p-2 bg-white shadow-lg border border-slate-100 text-slate-400 hover:text-wepp-navy"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteSalesperson(person.id)}
                          className="p-2 bg-white shadow-lg border border-slate-100 text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  ))}
                </div>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div className="bg-white border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Package className="w-5 h-5 text-wepp-red" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-wepp-navy">Control de Stock Profesional</h3>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Producto</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Categoría</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Precio Unit.</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Estado Stock</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <img src={product.image} alt={product.name} className="w-10 h-10 object-cover bg-slate-50" referrerPolicy="no-referrer" />
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-wepp-navy">{product.name}</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-widest">ID: {product.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1">{product.category}</span>
                          </td>
                          <td className="px-8 py-6 text-xs font-black text-wepp-navy">{product.price.toLocaleString()}€</td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="w-[100%] h-full bg-emerald-500"></div>
                              </div>
                              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">OK</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => setEditingProduct(product)}
                                className="text-[9px] font-black text-wepp-navy uppercase tracking-widest border border-slate-200 px-4 py-2 hover:bg-wepp-navy hover:text-white transition-all"
                              >
                                Editar
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="bg-white border border-slate-100 shadow-sm p-12">
                  <h3 className="text-2xl font-black text-wepp-navy uppercase tracking-tighter mb-12 flex items-center gap-6">
                    <Settings className="w-8 h-8 text-wepp-red" /> Configuración de la Empresa
                  </h3>
                  
                  <div className="space-y-12">
                    <div className="space-y-6">
                      <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] border-b border-slate-100 pb-2">Información Fiscal</h4>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Nombre Legal</label>
                          <input type="text" defaultValue="WEPP GmbH & Co. KG" className="w-full bg-slate-50 border border-slate-200 p-4 text-[11px] font-black uppercase outline-none focus:border-wepp-red transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">NIF / VAT ID</label>
                          <input type="text" defaultValue="DE123456789" className="w-full bg-slate-50 border border-slate-200 p-4 text-[11px] font-black uppercase outline-none focus:border-wepp-red transition-all" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] border-b border-slate-100 pb-2">Preferencias del Portal</h4>
                      <div className="space-y-4">
                        {[
                          { label: 'Notificaciones de nuevos pedidos', active: true },
                          { label: 'Informes semanales automáticos', active: true },
                          { label: 'Acceso internacional a vendedores', active: false },
                          { label: 'Control de precios automático AI', active: true }
                        ].map((opt, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50">
                            <span className="text-[10px] font-black uppercase tracking-widest text-wepp-navy">{opt.label}</span>
                            <div className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-all ${opt.active ? 'bg-wepp-red' : 'bg-slate-300'}`}>
                              <div className={`w-4 h-4 bg-white rounded-full transition-all ${opt.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button className="w-full bg-wepp-navy text-white py-5 font-black uppercase tracking-widest text-xs hover:bg-wepp-red transition-all shadow-xl">
                      Guardar Cambios Globales
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Edit Salesperson Modal */}
        <AnimatePresence>
          {editingSalesperson && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-wepp-dark/80 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white w-full max-w-lg p-12 overflow-hidden relative border border-white/10"
              >
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-2xl font-black text-wepp-navy uppercase tracking-tighter">Editar Vendedor</h3>
                  <button onClick={() => setEditingSalesperson(null)} className="text-slate-400 hover:text-wepp-navy transition-colors">
                    <CloseIcon className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleUpdateSalesperson(editingSalesperson.id, {
                    name: formData.get('name') as string,
                    email: formData.get('email') as string,
                    region: formData.get('region') as string,
                    status: formData.get('status') as any
                  });
                }} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nombre Completo</label>
                    <input name="name" defaultValue={editingSalesperson.name} required className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email Corporativo</label>
                    <input name="email" type="email" defaultValue={editingSalesperson.email} required className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Región</label>
                      <input name="region" defaultValue={editingSalesperson.region} required className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Estado</label>
                      <select name="status" defaultValue={editingSalesperson.status} className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red">
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="pt-8 flex gap-4">
                    <button type="button" onClick={() => setEditingSalesperson(null)} className="flex-1 py-4 border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">Cancelar</button>
                    <button type="submit" className="flex-1 py-4 bg-wepp-navy text-white text-[10px] font-black uppercase tracking-widest hover:bg-wepp-red">Guardar Cambios</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Edit Product Modal */}
        <AnimatePresence>
          {editingProduct && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-wepp-dark/80 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white w-full max-w-lg p-12 overflow-hidden relative border border-white/10"
              >
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-2xl font-black text-wepp-navy uppercase tracking-tighter">Editar Producto</h3>
                  <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-wepp-navy transition-colors">
                    <CloseIcon className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleUpdateProduct(editingProduct.id, {
                    name: formData.get('name') as string,
                    category: formData.get('category') as any,
                    price: parseFloat(formData.get('price') as string),
                    description: formData.get('description') as string
                  });
                }} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nombre del Producto</label>
                    <input name="name" defaultValue={editingProduct.name} required className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Categoría</label>
                      <select name="category" defaultValue={editingProduct.category} className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red">
                        {['Motor y Transmisión', 'Refrigeración', 'Aire Acondicionado', 'Combustible', 'Frenos', 'Mantenimiento y Cuidado', 'Carrocería'].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Precio (€)</label>
                      <input name="price" type="number" step="0.01" defaultValue={editingProduct.price} required className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Descripción</label>
                    <textarea name="description" defaultValue={editingProduct.description} rows={3} className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red resize-none"></textarea>
                  </div>
                  
                  <div className="pt-8 flex gap-4">
                    <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 py-4 border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">Cancelar</button>
                    <button type="submit" className="flex-1 py-4 bg-wepp-navy text-white text-[10px] font-black uppercase tracking-widest hover:bg-wepp-red">Guardar Cambios</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>


    </div>
  );
};
