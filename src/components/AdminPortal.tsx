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
  ArrowUpRight,
  Trash2,
  Edit3,
  X as CloseIcon,
  KeyRound,
  Wrench,
  MapPin,
  Phone,
  Mail,
  CheckCircle
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
  updateProduct,
  getTalleres,
  addTaller,
  deleteTaller,
  approveTaller
} from '../services/adminService';
import {
  getVendorCredentials,
  addVendorCredential,
  deleteVendorCredential,
  getWorkshopCredentials,
  addWorkshopCredential,
  deleteWorkshopCredential,
  updateWorkshopCredential,
  changeAdminPassword
} from '../services/authService';

import { Order, Comercial, AdminStats, Product, VendorCredential, WorkshopCredential, Taller } from '../types';


interface AdminPortalProps {
  onClose: () => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  adminEmail?: string;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onClose, products, setProducts, adminEmail }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'salespeople' | 'inventory' | 'settings' | 'accesos' | 'talleres'>('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [salespeople, setSalespeople] = useState<Comercial[]>([]);
  const [vendorCredentials, setVendorCredentials] = useState<VendorCredential[]>([]);
  const [workshopCredentials, setWorkshopCredentials] = useState<WorkshopCredential[]>([]);
  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [editingSalesperson, setEditingSalesperson] = useState<Comercial | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [showAddTaller, setShowAddTaller] = useState(false);
  const [showAddSalesperson, setShowAddSalesperson] = useState(false);
  const [editingVendor, setEditingVendor] = useState<VendorCredential | null>(null);
  const [editingWorkshop, setEditingWorkshop] = useState<WorkshopCredential | null>(null);
  const [showAddWorkshop, setShowAddWorkshop] = useState(false);
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [approvingTaller, setApprovingTaller] = useState<Taller | null>(null);
  const [approveClientNumber, setApproveClientNumber] = useState('');
  const [approveComercialId, setApproveComercialId] = useState('');
  const [tallerFilter, setTallerFilter] = useState<'Todos' | 'Pendiente' | 'Activo' | 'Inactivo'>('Todos');


  useEffect(() => {
    const loadData = async () => {
      const data = await initAdminData();
      setStats(data.stats);
      setOrders(data.orders);
      setSalespeople(data.salespeople);
      const [creds, wcreds, tals] = await Promise.all([
        getVendorCredentials(),
        getWorkshopCredentials(),
        getTalleres(),
      ]);
      setVendorCredentials(creds);
      setWorkshopCredentials(wcreds);
      setTalleres(tals);
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

  const handleUpdateSalesperson = async (id: string, data: Partial<Comercial>) => {
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
    { id: 'salespeople', label: 'Comerciales', icon: Users },
    { id: 'inventory', label: 'Inventario', icon: Package },
    { id: 'accesos', label: 'Accesos', icon: KeyRound },
    { id: 'talleres', label: 'Talleres', icon: Wrench },
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
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative">
      {/* Mobile Header Toggle */}
      <div className="md:hidden bg-wepp-navy text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex flex-col">
          <span className="text-wepp-red font-black text-[10px] uppercase tracking-widest">Admin</span>
          <span className="text-lg font-black tracking-tighter">WEPP GLOBAL</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-white/5 rounded-lg text-white"
        >
          {isSidebarOpen ? <CloseIcon className="w-6 h-6" /> : <LayoutDashboard className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-wepp-navy text-white flex flex-col h-screen transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 border-b border-white/5 hidden md:flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-wepp-red font-black text-xs tracking-widest uppercase">Admin Portal</span>
            <span className="text-xl font-black uppercase tracking-tighter">WEPP GLOBAL</span>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2 mt-4 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setIsSidebarOpen(false);
              }}
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-wepp-red to-orange-500 flex items-center justify-center font-black text-white">AD</div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-black uppercase">Administrador</span>
              <span className="text-[9px] text-slate-500 tracking-widest truncate">{adminEmail || 'admin'}</span>
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

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-12 overflow-x-hidden">
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
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
                    { label: 'Comerciales Activos', value: stats.activeComerciales, icon: Users, color: 'blue', trend: '0%' },
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
                  <button 
                    onClick={() => setShowAddSalesperson(true)}
                    className="bg-wepp-red text-white px-8 py-3 font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-wepp-navy transition-all shadow-xl shadow-red-100"
                  >
                    <Plus className="w-4 h-4" /> Nuevo Comercial
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
                          <span className="text-sm font-black text-wepp-navy">{(person.totalSales || 0).toLocaleString()}€</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Comisión</span>
                          <span className="text-sm font-black text-wepp-red">{(person.commissions || 0).toLocaleString()}€</span>
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

            {activeTab === 'accesos' && (
              <div className="space-y-8">
                {/* Vendor Credentials */}
                <div className="bg-white border border-slate-100 shadow-sm">
                  <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <KeyRound className="w-5 h-5 text-wepp-red" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-wepp-navy">Accesos Comerciales</h3>
                    </div>
                    <button
                      onClick={() => setShowAddVendor(true)}
                      className="bg-wepp-red text-white px-8 py-3 font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-wepp-navy transition-all"
                    >
                      <Plus className="w-4 h-4" /> Nuevo Acceso
                    </button>
                  </div>

                  {vendorCredentials.length === 0 ? (
                    <div className="p-16 text-center">
                      <KeyRound className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-400 text-sm font-medium">No hay accesos creados</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50">
                            <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Usuario</th>
                            <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Nombre</th>
                            <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Comercial ID</th>
                            <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Estado</th>
                            <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Creado</th>
                            <th className="px-8 py-4"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {vendorCredentials.map(vc => (
                            <tr key={vc.id} className="hover:bg-slate-50">
                              <td className="px-8 py-5 text-xs font-black text-wepp-navy">{vc.username}</td>
                              <td className="px-8 py-5 text-xs font-bold text-wepp-navy">{vc.name}</td>
                              <td className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase">{vc.salespersonId}</td>
                              <td className="px-8 py-5">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 ${vc.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                  {vc.active ? 'Activo' : 'Inactivo'}
                                </span>
                              </td>
                              <td className="px-8 py-5 text-xs text-slate-400">
                                {new Date(vc.createdAt).toLocaleDateString('es-ES')}
                              </td>
                              <td className="px-8 py-5 text-right">
                                <div className="flex items-center justify-end gap-3">
                                  <button 
                                    onClick={() => setEditingVendor(vc)}
                                    className="p-2 text-slate-400 hover:text-wepp-navy transition-colors"
                                    title="Editar acceso"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (confirm(`¿Eliminar acceso de "${vc.username}"?`)) {
                                        await deleteVendorCredential(vc.id);
                                        setVendorCredentials(prev => prev.filter(v => v.id !== vc.id));
                                      }
                                    }}
                                    className="p-2 text-slate-400 hover:text-wepp-red"
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
                  )}
                </div>

                {/* Workshop Credentials */}
                <div className="bg-white border border-slate-100 shadow-sm mt-12">
                  <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Wrench className="w-5 h-5 text-wepp-red" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-wepp-navy">Accesos Talleres</h3>
                    </div>
                    <button
                      onClick={() => setShowAddWorkshop(true)}
                      className="bg-wepp-red text-white px-8 py-3 font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-wepp-navy transition-all"
                    >
                      <Plus className="w-4 h-4" /> Nuevo Acceso Taller
                    </button>
                  </div>

                  {workshopCredentials.length === 0 ? (
                    <div className="p-16 text-center">
                      <Wrench className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-400 text-sm font-medium">No hay accesos de talleres creados</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50">
                            <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Usuario</th>
                            <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Nombre</th>
                            <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Taller ID</th>
                            <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Estado</th>
                            <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Creado</th>
                            <th className="px-8 py-4"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {workshopCredentials.map(wc => (
                            <tr key={wc.id} className="hover:bg-slate-50">
                              <td className="px-8 py-5 text-xs font-black text-wepp-navy">{wc.username}</td>
                              <td className="px-8 py-5 text-xs font-bold text-wepp-navy">{wc.name}</td>
                              <td className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase">{wc.tallerId}</td>
                              <td className="px-8 py-5">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 ${wc.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                  {wc.active ? 'Activo' : 'Inactivo'}
                                </span>
                              </td>
                              <td className="px-8 py-5 text-xs text-slate-400">
                                {new Date(wc.createdAt).toLocaleDateString('es-ES')}
                              </td>
                              <td className="px-8 py-5 text-right">
                                <div className="flex items-center justify-end gap-3">
                                  <button 
                                    onClick={() => setEditingWorkshop(wc)}
                                    className="p-2 text-slate-400 hover:text-wepp-navy transition-colors"
                                    title="Editar acceso"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (confirm(`¿Eliminar acceso de "${wc.username}"?`)) {
                                        await deleteWorkshopCredential(wc.id);
                                        setWorkshopCredentials(prev => prev.filter(v => v.id !== wc.id));
                                      }
                                    }}
                                    className="p-2 text-slate-400 hover:text-wepp-red"
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
                  )}
                </div>

                {/* Admin Password Change */}
                <div className="bg-white border border-slate-100 shadow-sm p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <Settings className="w-5 h-5 text-wepp-red" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-wepp-navy">Cambiar Contraseña Admin</h3>
                  </div>
                  <div className="max-w-md space-y-4">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-2">Nueva Contraseña</label>
                      <input
                        type="password"
                        value={newAdminPassword}
                        onChange={e => setNewAdminPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-wepp-navy transition-colors"
                      />
                    </div>
                    <button
                      onClick={async () => {
                        if (!newAdminPassword || newAdminPassword.length < 6) return alert('Mínimo 6 caracteres');
                        if (!adminEmail) return;
                        await changeAdminPassword(adminEmail, newAdminPassword);
                        setNewAdminPassword('');
                        alert('Contraseña actualizada');
                      }}
                      className="bg-wepp-navy text-white px-8 py-3 font-black text-[10px] uppercase tracking-widest hover:bg-wepp-red transition-all"
                    >
                      Actualizar Contraseña
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'talleres' && (
              <div className="space-y-8">
                {/* Pending Alert */}
                {talleres.filter(t => t.status === 'Pendiente').length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 p-6 flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Wrench className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-amber-800 uppercase tracking-tight">
                        {talleres.filter(t => t.status === 'Pendiente').length} solicitud(es) pendiente(s) de aprobación
                      </h4>
                      <p className="text-xs text-amber-600 mt-1">Revisa las solicitudes y asigna número de cliente y comercial.</p>
                    </div>
                  </div>
                )}

                <div className="bg-white border border-slate-100 shadow-sm">
                  <div className="p-8 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Wrench className="w-5 h-5 text-wepp-red" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-wepp-navy">Talleres Registrados</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {(['Todos', 'Pendiente', 'Activo', 'Inactivo'] as const).map(f => (
                          <button
                            key={f}
                            onClick={() => setTallerFilter(f)}
                            className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${
                              tallerFilter === f ? 'bg-wepp-navy text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            } ${f === 'Pendiente' && talleres.filter(t => t.status === 'Pendiente').length > 0 ? 'relative' : ''}`}
                          >
                            {f}
                            {f === 'Pendiente' && talleres.filter(t => t.status === 'Pendiente').length > 0 && (
                              <span className="absolute -top-1 -right-1 w-4 h-4 bg-wepp-red text-white text-[8px] font-black rounded-full flex items-center justify-center">
                                {talleres.filter(t => t.status === 'Pendiente').length}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setShowAddTaller(true)}
                        className="bg-wepp-red text-white px-6 py-2 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-wepp-navy transition-all"
                      >
                        <Plus className="w-4 h-4" /> Añadir
                      </button>
                    </div>
                  </div>

                  {talleres.length === 0 ? (
                    <div className="p-16 text-center">
                      <Wrench className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-400 text-sm font-medium">No hay talleres registrados</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
                      {talleres
                        .filter(t => tallerFilter === 'Todos' || t.status === tallerFilter)
                        .map(taller => (
                        <div
                          key={taller.id}
                          className={`border p-6 relative group transition-all ${
                            taller.status === 'Pendiente'
                              ? 'border-amber-200 bg-amber-50/30 hover:border-amber-400'
                              : 'border-slate-100 hover:border-wepp-red'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 bg-wepp-navy rounded-xl flex items-center justify-center">
                              <Wrench className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex items-center gap-2">
                              {taller.clientNumber && (
                                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-blue-50 text-blue-600">
                                  Nº {taller.clientNumber}
                                </span>
                              )}
                              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 ${
                                taller.status === 'Activo' ? 'bg-emerald-50 text-emerald-600' :
                                taller.status === 'Pendiente' ? 'bg-amber-50 text-amber-600 animate-pulse' :
                                'bg-slate-100 text-slate-400'
                              }`}>
                                {taller.status}
                              </span>
                            </div>
                          </div>
                          <h4 className="text-sm font-black text-wepp-navy uppercase tracking-tight mb-1">{taller.name}</h4>
                          {taller.cif && (
                            <p className="text-[10px] text-slate-400 font-bold mb-2">CIF: {taller.cif}</p>
                          )}
                          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                            <MapPin className="w-3 h-3 text-wepp-red flex-shrink-0" />
                            {taller.address ? `${taller.address}, ${taller.city}` : taller.city}
                          </div>
                          {taller.shippingAddress && taller.shippingAddress !== taller.address && (
                            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                              <span className="text-[9px] text-slate-300 ml-5">Envío: {taller.shippingAddress}</span>
                            </div>
                          )}
                          {taller.phone && (
                            <div className="flex items-center gap-2 text-slate-400 text-xs">
                              <Phone className="w-3 h-3 text-wepp-red flex-shrink-0" />
                              {taller.phone}
                            </div>
                          )}
                          {taller.email && (
                            <div className="flex items-center gap-2 text-slate-400 text-xs mt-1">
                              <Mail className="w-3 h-3 text-wepp-red flex-shrink-0" />
                              {taller.email}
                            </div>
                          )}
                          {taller.orderContactName && (
                            <div className="mt-3 pt-3 border-t border-slate-100">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Contacto Pedidos</span>
                              <span className="text-xs text-wepp-navy font-bold">{taller.orderContactName}</span>
                              {taller.orderContactPhone && <span className="text-xs text-slate-400 ml-2">· {taller.orderContactPhone}</span>}
                            </div>
                          )}
                          {taller.gdprAccepted && (
                            <div className="mt-3 flex items-center gap-1.5">
                              <div className="w-3 h-3 bg-emerald-100 rounded-full flex items-center justify-center">
                                <svg className="w-2 h-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                              </div>
                              <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest">RGPD Aceptado</span>
                            </div>
                          )}

                          {/* Action buttons */}
                          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
                            {taller.status === 'Pendiente' && (
                              <button
                                onClick={() => {
                                  setApprovingTaller(taller);
                                  setApproveClientNumber('');
                                  setApproveComercialId('');
                                }}
                                className="flex-1 bg-emerald-500 text-white py-2 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                              >
                                <CheckCircle className="w-3 h-3" /> Aprobar
                              </button>
                            )}
                            <button
                              onClick={async () => {
                                if (confirm(`¿Eliminar "${taller.name}"?`)) {
                                  const updated = await deleteTaller(taller.id);
                                  setTalleres(updated);
                                }
                              }}
                              className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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

      {/* Add Vendor Credential Modal */}
      <AnimatePresence>
        {showAddVendor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-wepp-dark/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-lg p-12 relative border border-white/10"
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-wepp-navy uppercase tracking-tighter">Nuevo Acceso Comercial</h3>
                <button onClick={() => setShowAddVendor(false)} className="text-slate-400 hover:text-wepp-navy">
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const cred = await addVendorCredential({
                  username: fd.get('username') as string,
                  password: fd.get('password') as string,
                  salespersonId: fd.get('salespersonId') as string,
                  name: fd.get('name') as string,
                });
                setVendorCredentials(prev => [...prev, cred]);
                setShowAddVendor(false);
              }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Nombre Completo</label>
                  <input name="name" required className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Nombre de Usuario</label>
                  <input name="username" required className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Contraseña</label>
                  <input name="password" type="password" required minLength={6} className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Vendedor Asignado</label>
                  <select name="salespersonId" required className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red">
                    <option value="">— Seleccionar —</option>
                    {salespeople.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowAddVendor(false)} className="flex-1 py-4 border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">Cancelar</button>
                  <button type="submit" className="flex-1 py-4 bg-wepp-navy text-white text-[10px] font-black uppercase tracking-widest hover:bg-wepp-red transition-all">Crear Acceso</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Taller Modal */}
      <AnimatePresence>
        {showAddTaller && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-wepp-dark/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-lg p-12 relative border border-white/10"
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-wepp-navy uppercase tracking-tighter">Añadir Taller</h3>
                <button onClick={() => setShowAddTaller(false)} className="text-slate-400 hover:text-wepp-navy">
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const newTaller = await addTaller({
                  name: fd.get('name') as string,
                  cif: fd.get('cif') as string,
                  city: fd.get('city') as string,
                  address: fd.get('address') as string,
                  phone: fd.get('phone') as string,
                  email: fd.get('email') as string,
                  status: fd.get('status') as Taller['status'],
                  notes: fd.get('notes') as string,
                  salespersonId: fd.get('salespersonId') as string,
                });
                setTalleres(prev => [...prev, newTaller]);
                setShowAddTaller(false);
              }} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Nombre del Taller</label>
                    <input name="name" required className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">CIF / NIF</label>
                    <input name="cif" className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red" placeholder="B12345678" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Ciudad</label>
                    <input name="city" required className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Estado</label>
                    <select name="status" defaultValue="Activo" className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red">
                      <option value="Activo">Activo</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Teléfono</label>
                    <input name="phone" className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Email</label>
                    <input name="email" type="email" className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Dirección</label>
                    <input name="address" className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Vendedor Asignado</label>
                    <select name="salespersonId" className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red">
                      <option value="">— Ninguno —</option>
                      {salespeople.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowAddTaller(false)} className="flex-1 py-4 border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">Cancelar</button>
                  <button type="submit" className="flex-1 py-4 bg-wepp-navy text-white text-[10px] font-black uppercase tracking-widest hover:bg-wepp-red transition-all">Guardar Taller</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Salesperson Modal */}
      <AnimatePresence>
        {showAddSalesperson && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-wepp-dark/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-lg p-12 relative border border-white/10"
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-wepp-navy uppercase tracking-tighter">Nuevo Comercial</h3>
                <button onClick={() => setShowAddSalesperson(false)} className="text-slate-400 hover:text-wepp-navy">
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const updatedSalespeople = await addSalesperson({
                  name: fd.get('name') as string,
                  email: fd.get('email') as string,
                  region: fd.get('region') as string,
                  status: fd.get('status') as Salesperson['status'],
                });
                setSalespeople(updatedSalespeople);
                setShowAddSalesperson(false);
              }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Nombre Completo</label>
                  <input name="name" required className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Email Corporativo</label>
                  <input name="email" type="email" required className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Región</label>
                    <input name="region" required className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Estado Inicial</label>
                    <select name="status" defaultValue="Activo" className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red">
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowAddSalesperson(false)} className="flex-1 py-4 border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">Cancelar</button>
                  <button type="submit" className="flex-1 py-4 bg-wepp-navy text-white text-[10px] font-black uppercase tracking-widest hover:bg-wepp-red transition-all">Crear Vendedor</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Vendor Credential Modal */}
      <AnimatePresence>
        {editingVendor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-wepp-dark/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-lg p-12 relative border border-white/10"
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-wepp-navy uppercase tracking-tighter">Editar Acceso</h3>
                <button onClick={() => setEditingVendor(null)} className="text-slate-400 hover:text-wepp-navy">
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const password = fd.get('password') as string;
                
                const updateData: any = {
                  name: fd.get('name') as string,
                  username: fd.get('username') as string,
                };
                if (password) updateData.password = password;

                await updateVendorCredential(editingVendor.id, updateData);
                const updatedCreds = await getVendorCredentials();
                setVendorCredentials(updatedCreds);
                setEditingVendor(null);
              }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Nombre Completo</label>
                  <input name="name" defaultValue={editingVendor.name} required className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Nombre de Usuario</label>
                  <input name="username" defaultValue={editingVendor.username} required className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Nueva Contraseña (dejar en blanco para no cambiar)</label>
                  <input name="password" type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red" />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setEditingVendor(null)} className="flex-1 py-4 border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">Cancelar</button>
                  <button type="submit" className="flex-1 py-4 bg-wepp-navy text-white text-[10px] font-black uppercase tracking-widest hover:bg-wepp-red transition-all">Guardar Cambios</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddWorkshop && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-wepp-dark/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-lg p-12 relative border border-white/10"
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-wepp-navy uppercase tracking-tighter">Nuevo Acceso Taller</h3>
                <button onClick={() => setShowAddWorkshop(false)} className="text-slate-400 hover:text-wepp-navy">
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const cred = await addWorkshopCredential({
                  username: fd.get('username') as string,
                  password: fd.get('password') as string,
                  tallerId: fd.get('tallerId') as string,
                  name: fd.get('name') as string,
                });
                setWorkshopCredentials(prev => [...prev, cred]);
                setShowAddWorkshop(false);
              }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Nombre Taller / Responsable</label>
                  <input name="name" required className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Nombre de Usuario</label>
                  <input name="username" required className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Contraseña</label>
                  <input name="password" type="password" required minLength={6} className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Asignar a Taller</label>
                  <select name="tallerId" required className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red">
                    <option value="">— Seleccionar —</option>
                    {talleres.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.city})</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowAddWorkshop(false)} className="flex-1 py-4 border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">Cancelar</button>
                  <button type="submit" className="flex-1 py-4 bg-wepp-navy text-white text-[10px] font-black uppercase tracking-widest hover:bg-wepp-red transition-all">Crear Acceso</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingWorkshop && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-wepp-dark/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-lg p-12 relative border border-white/10"
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-wepp-navy uppercase tracking-tighter">Editar Acceso Taller</h3>
                <button onClick={() => setEditingWorkshop(null)} className="text-slate-400 hover:text-wepp-navy">
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const password = fd.get('password') as string;
                
                const updateData: any = {
                  name: fd.get('name') as string,
                  username: fd.get('username') as string,
                };
                if (password) updateData.password = password;

                await updateWorkshopCredential(editingWorkshop.id, updateData);
                const updatedCreds = await getWorkshopCredentials();
                setWorkshopCredentials(updatedCreds);
                setEditingWorkshop(null);
              }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Nombre Taller / Responsable</label>
                  <input name="name" defaultValue={editingWorkshop.name} required className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Nombre de Usuario</label>
                  <input name="username" defaultValue={editingWorkshop.username} required className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Nueva Contraseña (dejar en blanco para no cambiar)</label>
                  <input name="password" type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red" />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setEditingWorkshop(null)} className="flex-1 py-4 border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">Cancelar</button>
                  <button type="submit" className="flex-1 py-4 bg-wepp-navy text-white text-[10px] font-black uppercase tracking-widest hover:bg-wepp-red transition-all">Guardar Cambios</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Approve Taller Modal */}
      <AnimatePresence>
        {approvingTaller && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-wepp-dark/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-lg p-12 relative border border-white/10"
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-wepp-navy uppercase tracking-tighter">Aprobar Taller</h3>
                <button onClick={() => setApprovingTaller(null)} className="text-slate-400 hover:text-wepp-navy">
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Taller summary */}
              <div className="bg-slate-50 border border-slate-100 p-6 mb-8 space-y-3">
                <h4 className="text-lg font-black text-wepp-navy uppercase tracking-tight">{approvingTaller.name}</h4>
                {approvingTaller.cif && <p className="text-xs text-slate-500">CIF: <strong>{approvingTaller.cif}</strong></p>}
                <p className="text-xs text-slate-500">{approvingTaller.address}, {approvingTaller.city}</p>
                {approvingTaller.email && <p className="text-xs text-slate-500">{approvingTaller.email} · {approvingTaller.phone}</p>}
                {approvingTaller.gdprAccepted && (
                  <div className="flex items-center gap-1.5 pt-2">
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                    <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest">RGPD Firmado</span>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Número de Cliente *</label>
                  <input
                    value={approveClientNumber}
                    onChange={e => setApproveClientNumber(e.target.value)}
                    placeholder="Ej: CLI-00123"
                    className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Comercial Asignado *</label>
                  <select
                    value={approveComercialId}
                    onChange={e => setApproveComercialId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-bold outline-none focus:border-wepp-red"
                  >
                    <option value="">— Seleccionar Comercial —</option>
                    {salespeople.filter(s => s.status === 'Activo').map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.region})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-8">
                <button
                  type="button"
                  onClick={() => setApprovingTaller(null)}
                  className="flex-1 py-4 border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    if (!approveClientNumber.trim()) return alert('Asigna un número de cliente');
                    if (!approveComercialId) return alert('Selecciona un comercial');
                    const updated = await approveTaller(approvingTaller.id, approveClientNumber, approveComercialId);
                    setTalleres(updated);
                    setApprovingTaller(null);
                  }}
                  className="flex-1 py-4 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Aprobar y Activar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
