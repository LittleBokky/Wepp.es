import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  TrendingUp, 
  DollarSign, 
  Package, 
  LogOut, 
  RefreshCw, 
  Users, 
  Wrench, 
  Plus, 
  Search, 
  ChevronRight, 
  LayoutDashboard,
  MessageSquare,
  FileText,
  MapPin,
  Phone,
  Mail,
  Send,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VendorCredential, Order, Salesperson, Taller, Product, Budget, ChatMessage } from '../types';
import { supabase } from '../services/supabase';
import { 
  getSellerTalleres, 
  createTaller, 
  getSellerBudgets, 
  createBudget, 
  sendMessage, 
  listenToMessages,
  createWorkshopOrder 
} from '../services/sellerService';

interface VendorPortalProps {
  credential: VendorCredential;
  onClose: () => void;
}

export const VendorPortal: React.FC<VendorPortalProps> = ({ credential, onClose }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'talleres' | 'catalog' | 'budgets' | 'chat'>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [salesperson, setSalesperson] = useState<Salesperson | null>(null);
  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New Taller Modal
  const [showAddTaller, setShowAddTaller] = useState(false);
  const [newTaller, setNewTaller] = useState<Omit<Taller, 'id' | 'joinDate'>>({
    name: '',
    city: '',
    address: '',
    phone: '',
    email: '',
    status: 'Activo',
    salespersonId: credential.salespersonId
  });

  // Budget logic
  const [showCreateBudget, setShowCreateBudget] = useState(false);
  const [selectedTallerForBudget, setSelectedTallerForBudget] = useState<Taller | null>(null);
  const [budgetItems, setBudgetItems] = useState<{productId: string, productName: string, quantity: number, price: number}[]>([]);

  // Chat logic
  const [selectedTallerForChat, setSelectedTallerForChat] = useState<Taller | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [ordersRes, salespeopleRes, productsRes] = await Promise.all([
        supabase.from('orders').select('*').eq('salesperson_id', credential.salespersonId),
        supabase.from('salespeople').select('*'),
        supabase.from('products').select('*'),
      ]);

      if (ordersRes.data) {
        setOrders(ordersRes.data as Order[]);
      }

      if (salespeopleRes.data) {
        const all: Salesperson[] = salespeopleRes.data as Salesperson[];
        setSalesperson(all.find(s => s.id === credential.salespersonId) || null);
      }

      if (productsRes.data) {
        setProducts(productsRes.data as Product[]);
      }

      const [myTalleres, myBudgets] = await Promise.all([
        getSellerTalleres(credential.salespersonId),
        getSellerBudgets(credential.salespersonId)
      ]);
      
      setTalleres(myTalleres);
      setBudgets(myBudgets);
      setLoading(false);
    };
    loadData();
  }, [credential.salespersonId]);


  useEffect(() => {
    if (selectedTallerForChat) {
      const unsubscribe = listenToMessages(credential.salespersonId, selectedTallerForChat.id, setChatMessages);
      return () => unsubscribe();
    }
  }, [selectedTallerForChat, credential.salespersonId]);

  const handleCreateTaller = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await createTaller(newTaller);
    setTalleres(prev => [...prev, created]);
    setShowAddTaller(false);
    setNewTaller({
      name: '',
      city: '',
      address: '',
      phone: '',
      email: '',
      status: 'Activo',
      salespersonId: credential.salespersonId
    });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTallerForChat) return;
    await sendMessage({
      senderId: credential.salespersonId,
      receiverId: selectedTallerForChat.id,
      text: newMessage
    });
    setNewMessage('');
  };

  const addToBudget = (product: Product) => {
    setBudgetItems(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) {
        return prev.map(i => i.productId === product.id ? {...i, quantity: i.quantity + 1} : i);
      }
      return [...prev, { productId: product.id, productName: product.name, quantity: 1, price: product.price }];
    });
  };

  const handleSaveBudget = async () => {
    if (!selectedTallerForBudget || budgetItems.length === 0) return;
    const total = budgetItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const budget: Omit<Budget, 'id' | 'createdAt'> = {
      tallerId: selectedTallerForBudget.id,
      tallerName: selectedTallerForBudget.name,
      salespersonId: credential.salespersonId,
      items: budgetItems,
      total,
      status: 'Borrador',
      validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    };
    const created = await createBudget(budget);
    setBudgets(prev => [...prev, created]);
    setShowCreateBudget(false);
    setBudgetItems([]);
  };

  const tabs = [
    { id: 'dashboard', label: 'Monitor Personal', icon: LayoutDashboard },
    { id: 'talleres', label: 'Mis Talleres', icon: Wrench },
    { id: 'catalog', label: 'Catálogo & Pedidos', icon: Package },
    { id: 'orders', label: 'Mis Pedidos', icon: ShoppingCart },
    { id: 'budgets', label: 'Presupuestos', icon: FileText },
    { id: 'chat', label: 'Comunicación', icon: MessageSquare },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-wepp-red animate-spin" />
      </div>
    );
  }

  const myRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const myCommissions = salesperson?.commissions ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar - Same style as Admin */}
      <aside className="w-full md:w-64 bg-wepp-navy text-white flex flex-col h-screen overflow-hidden sticky top-0">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-wepp-red font-black text-xs tracking-widest uppercase">Seller Portal</span>
            <span className="text-xl font-black uppercase tracking-tighter">WEPP FORCE</span>
          </div>
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
              {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
            </button>
          ))}
        </nav>

        <div className="p-6 bg-slate-900/50 mt-auto border-t border-white/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-wepp-red to-orange-500 flex items-center justify-center font-black text-white">
              {credential.name[0]}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-black uppercase">{credential.name}</span>
              <span className="text-[9px] text-slate-500 tracking-widest truncate">{credential.username}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full py-2 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-3 h-3" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-wepp-navy uppercase tracking-tighter mb-2">
            {tabs.find(t => t.id === activeTab)?.label}
          </h1>
          <p className="text-slate-400 text-sm font-medium">Gestionando Región: {salesperson?.region || 'Principal'}</p>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'dashboard' && (
              <div className="space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Ingresos Generados', value: `${myRevenue.toLocaleString()}€`, icon: DollarSign, color: 'emerald' },
                    { label: 'Mis Pedidos', value: orders.length, icon: ShoppingCart, color: 'wepp-red' },
                    { label: 'Mis Comisiones', value: `${myCommissions.toLocaleString()}€`, icon: TrendingUp, color: 'amber' },
                    { label: 'Talleres Activos', value: talleres.length, icon: Wrench, color: 'blue' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
                      <stat.icon className={`w-10 h-10 mb-6 text-${stat.color === 'wepp-red' ? 'red-500' : stat.color + '-500'}`} />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">{stat.label}</span>
                      <span className="text-3xl font-black text-wepp-navy tracking-tighter leading-none">{stat.value}</span>
                    </div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 bg-white border border-slate-100 shadow-sm p-8">
                    <h3 className="text-sm font-black uppercase tracking-widest text-wepp-navy mb-8">Actividad Reciente</h3>
                    <div className="space-y-6">
                      {orders.slice(0, 5).map(o => (
                        <div key={o.id} className="flex items-center justify-between p-4 bg-slate-50/50 border-l-4 border-wepp-red">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-wepp-navy uppercase">Venta a {o.customerName}</span>
                            <span className="text-[10px] text-slate-400">{new Date(o.date).toLocaleDateString()}</span>
                          </div>
                          <span className="text-sm font-black text-wepp-navy">{o.total.toLocaleString()}€</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="lg:col-span-4 bg-wepp-navy text-white p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <DollarSign className="w-24 h-24" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Próxima Liquidación</h3>
                    <p className="text-slate-400 text-xs mb-8">Tu próxima comisión se liquidará el 30 de este mes.</p>
                    <div className="text-4xl font-black tracking-tighter text-wepp-red">{(myRevenue * 0.1).toFixed(2)}€</div>
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-50 mt-2 block">Cálculo estimado (10%)</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'talleres' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center bg-white p-8 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <Wrench className="w-5 h-5 text-wepp-red" />
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-wepp-navy">Gestión de Talleres</h3>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Talleres asignados a tu zona</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowAddTaller(true)}
                    className="bg-wepp-red text-white px-8 py-3 font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-wepp-navy transition-all"
                  >
                    <UserPlus className="w-4 h-4" /> Registrar Taller
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {talleres.map(taller => (
                    <div key={taller.id} className="bg-white border border-slate-100 p-8 hover:border-wepp-red transition-all group relative">
                      <div className="flex items-start justify-between mb-8">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center">
                          <Wrench className="w-5 h-5 text-white" />
                        </div>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">Activo</span>
                      </div>
                      <h4 className="text-lg font-black text-wepp-navy uppercase tracking-tight mb-2">{taller.name}</h4>
                      <div className="space-y-2 mb-8">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          <MapPin className="w-3 h-3 text-wepp-red" /> {taller.city}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          <Phone className="w-3 h-3 text-wepp-red" /> {taller.phone}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          <Mail className="w-3 h-3 text-wepp-red" /> {taller.email}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setSelectedTallerForChat(taller); setActiveTab('chat'); }}
                          className="flex-1 py-3 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest hover:bg-wepp-red transition-all"
                        >
                          Chat
                        </button>
                        <button 
                          onClick={() => { setSelectedTallerForBudget(taller); setShowCreateBudget(true); }}
                          className="flex-1 py-3 border border-slate-200 text-wepp-navy text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                        >
                          Presupuesto
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {showAddTaller && (
                  <div className="fixed inset-0 bg-wepp-navy/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white max-w-lg w-full p-12 relative">
                      <button onClick={() => setShowAddTaller(false)} className="absolute top-8 right-8 text-slate-400 hover:text-wepp-red"><RefreshCw className="w-6 h-6 rotate-45" /></button>
                      <h3 className="text-3xl font-black text-wepp-navy uppercase tracking-tighter mb-8 italic">Registrar Nuevo Taller</h3>
                      <form onSubmit={handleCreateTaller} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Nombre del Taller</label>
                            <input required type="text" value={newTaller.name} onChange={e => setNewTaller({...newTaller, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold outline-none focus:border-wepp-red transition-all" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Ciudad</label>
                            <input required type="text" value={newTaller.city} onChange={e => setNewTaller({...newTaller, city: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold outline-none focus:border-wepp-red transition-all" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Dirección</label>
                          <input type="text" value={newTaller.address} onChange={e => setNewTaller({...newTaller, address: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold outline-none focus:border-wepp-red transition-all" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Teléfono</label>
                            <input type="text" value={newTaller.phone} onChange={e => setNewTaller({...newTaller, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold outline-none focus:border-wepp-red transition-all" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Email</label>
                            <input type="email" value={newTaller.email} onChange={e => setNewTaller({...newTaller, email: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold outline-none focus:border-wepp-red transition-all" />
                          </div>
                        </div>
                        <button type="submit" className="w-full bg-wepp-navy text-white py-5 font-black uppercase tracking-widest text-xs hover:bg-wepp-red transition-all">Crear Credenciales & Registrar</button>
                      </form>
                    </motion.div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'catalog' && (
              <div className="grid lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-8">
                  <div className="relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" placeholder="BUSCAR PRODUCTO POR NOMBRE O ID..." className="w-full bg-white border border-slate-100 px-16 py-6 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-wepp-red shadow-sm" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {products.map(p => (
                      <div key={p.id} className="bg-white border border-slate-100 p-8 group hover:shadow-xl transition-all">
                        <img src={p.image} className="w-full h-48 object-contain mb-8 group-hover:scale-105 transition-transform" />
                        <span className="text-[9px] font-black text-wepp-red uppercase tracking-widest mb-2 block">{p.category}</span>
                        <h4 className="text-lg font-black text-wepp-navy uppercase tracking-tight mb-1">{p.name}</h4>
                        <p className="text-2xl font-black text-wepp-navy mb-8">{p.price.toLocaleString()}€</p>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => addToBudget(p)}
                            className="flex-1 py-4 bg-wepp-navy text-white text-[9px] font-black uppercase tracking-widest hover:bg-wepp-red transition-all"
                          >
                            Añadir a Pedido
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-4">
                  <div className="bg-white border border-slate-100 shadow-xl sticky top-24 p-8">
                    <h3 className="text-sm font-black uppercase tracking-widest text-wepp-navy mb-8 flex items-center justify-between">
                      Pedido Actual
                      <ShoppingCart className="w-5 h-5 text-wepp-red" />
                    </h3>
                    {budgetItems.length === 0 ? (
                      <div className="py-12 text-center">
                        <Package className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                        <p className="text-xs text-slate-400 font-bold uppercase">No hay artículos</p>
                      </div>
                    ) : (
                      <div className="space-y-4 mb-8">
                        {budgetItems.map(item => (
                          <div key={item.productId} className="flex justify-between items-center text-xs font-bold uppercase text-wepp-navy">
                            <span className="flex-1 truncate pr-4">{item.quantity}x {item.productName}</span>
                            <span>{(item.price * item.quantity).toFixed(2)}€</span>
                          </div>
                        ))}
                        <div className="border-t border-slate-100 pt-4 flex justify-between items-end">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Pedido</span>
                          <span className="text-2xl font-black text-wepp-red">{budgetItems.reduce((acc, i) => acc + (i.price * i.quantity), 0).toFixed(2)}€</span>
                        </div>
                      </div>
                    )}
                    <div className="space-y-4">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">Seleccionar Taller</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-100 p-4 text-[10px] font-black uppercase outline-none"
                        onChange={(e) => {
                          const t = talleres.find(tal => tal.id === e.target.value);
                          setSelectedTallerForBudget(t || null);
                        }}
                      >
                        <option value="">-- SELECCIONAR TALLER --</option>
                        {talleres.map(t => <option key={t.id} value={t.id}>{t.name} ({t.city})</option>)}
                      </select>
                      <button 
                        disabled={!selectedTallerForBudget || budgetItems.length === 0}
                        onClick={async () => {
                          if (!selectedTallerForBudget) return;
                          await createWorkshopOrder({
                            customerName: selectedTallerForBudget.name,
                            customerEmail: selectedTallerForBudget.email || 'no-email@taller.es',
                            items: budgetItems,
                            total: budgetItems.reduce((acc, i) => acc + (i.price * i.quantity), 0),
                            shippingAddress: selectedTallerForBudget.address || '',
                            salespersonId: credential.salespersonId
                          });
                          setBudgetItems([]);
                          alert('Pedido realizado con éxito');
                        }}
                        className="w-full bg-wepp-navy text-white py-5 font-black uppercase tracking-widest text-xs hover:bg-wepp-red transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Confirmar Pedido Taller
                      </button>
                      <button 
                        disabled={!selectedTallerForBudget || budgetItems.length === 0}
                        onClick={handleSaveBudget}
                        className="w-full border border-slate-200 text-wepp-navy py-4 font-black uppercase tracking-widest text-[9px] hover:bg-slate-50 transition-all disabled:opacity-30"
                      >
                        Guardar como Presupuesto
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="bg-white border border-slate-100 h-[700px] shadow-xl flex overflow-hidden">
                <div className="w-80 border-r border-slate-50 flex flex-col">
                  <div className="p-8 border-b border-slate-50">
                    <h3 className="text-sm font-black uppercase tracking-widest text-wepp-navy">Tallas & Mensajes</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {talleres.map(t => (
                      <button 
                        key={t.id} 
                        onClick={() => setSelectedTallerForChat(t)}
                        className={`w-full p-6 text-left border-b border-slate-50 transition-all ${selectedTallerForChat?.id === t.id ? 'bg-slate-50 border-r-4 border-r-wepp-red' : 'hover:bg-slate-50/50'}`}
                      >
                        <p className="text-xs font-black text-wepp-navy uppercase truncate">{t.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{t.city}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 flex flex-col bg-slate-50/30">
                  {selectedTallerForChat ? (
                    <>
                      <div className="p-8 bg-white border-b border-slate-50 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-wepp-navy rounded-full flex items-center justify-center font-black text-white">{selectedTallerForChat.name[0]}</div>
                          <div>
                            <h4 className="text-sm font-black text-wepp-navy uppercase">{selectedTallerForChat.name}</h4>
                            <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">En línea</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 p-8 overflow-y-auto space-y-6">
                        {chatMessages.map((m, i) => (
                          <div key={i} className={`flex ${m.senderId === credential.salespersonId ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] p-4 text-xs font-bold leading-relaxed ${m.senderId === credential.salespersonId ? 'bg-wepp-navy text-white rounded-2xl rounded-tr-none' : 'bg-white text-wepp-navy rounded-2xl rounded-tl-none border border-slate-100 shadow-sm'}`}>
                              {m.text}
                              <span className={`block text-[8px] mt-2 opacity-50 ${m.senderId === credential.salespersonId ? 'text-right' : 'text-left'}`}>
                                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-8 bg-white border-t border-slate-50 flex gap-4">
                        <input 
                          value={newMessage}
                          onChange={e => setNewMessage(e.target.value)}
                          onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                          type="text" 
                          placeholder="Escribe un mensaje al taller..." 
                          className="flex-1 bg-slate-50 border border-slate-100 px-6 py-4 text-xs font-bold outline-none focus:border-wepp-red transition-all" 
                        />
                        <button 
                          onClick={handleSendMessage}
                          className="w-14 h-14 bg-wepp-navy text-white flex items-center justify-center hover:bg-wepp-red transition-all shadow-xl"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                      <MessageSquare className="w-16 h-16 mb-6 opacity-20" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Selecciona un taller para chatear</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'budgets' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center bg-white p-8 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <FileText className="w-5 h-5 text-wepp-red" />
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-wepp-navy">Historial de Presupuestos</h3>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Documentos generados para clientes</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-slate-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">ID</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Taller</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Items</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Total</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Válido Hasta</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {budgets.map(b => (
                        <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-8 py-5 text-xs font-black text-wepp-navy">{b.id}</td>
                          <td className="px-8 py-5 text-xs font-bold text-wepp-navy uppercase">{b.tallerName}</td>
                          <td className="px-8 py-5">
                            <span className="text-[9px] font-black bg-slate-100 px-2 py-1 rounded text-slate-600">
                              {b.items.length} PRODUCTOS
                            </span>
                          </td>
                          <td className="px-8 py-5 text-sm font-black text-wepp-navy">{b.total.toLocaleString()}€</td>
                          <td className="px-8 py-5 text-[10px] text-slate-400 font-black uppercase">{new Date(b.validUntil).toLocaleDateString()}</td>
                          <td className="px-8 py-5">
                            <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[8px] font-black uppercase tracking-widest">{b.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center gap-4">
                  <ShoppingCart className="w-5 h-5 text-wepp-red" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-wepp-navy">Registro Histórico de Ventas</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">ID</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Cliente</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Total</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Estado</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Fecha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-8 py-5 text-xs font-black text-wepp-navy">{order.id}</td>
                          <td className="px-8 py-5 text-xs font-bold text-wepp-navy uppercase">{order.customerName}</td>
                          <td className="px-8 py-5 text-sm font-black text-wepp-navy">{order.total.toLocaleString()}€</td>
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest ${
                              order.status === 'Entregado' ? 'bg-emerald-50 text-emerald-600' : 
                              order.status === 'Pendiente' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                            }`}>{order.status}</span>
                          </td>
                          <td className="px-8 py-5 text-[10px] text-slate-400 font-bold uppercase">{new Date(order.date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
