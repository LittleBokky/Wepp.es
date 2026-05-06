import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Package, 
  LogOut, 
  RefreshCw, 
  Wrench, 
  Search, 
  ChevronRight, 
  LayoutDashboard,
  MessageSquare,
  FileText,
  MapPin,
  Phone,
  Mail,
  Send,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WorkshopCredential, Order, Taller, Product, Budget, ChatMessage } from '../types';
import { supabase } from '../services/supabase';
import { 
  getWorkshopData, 
  getWorkshopOrders, 
  getWorkshopBudgets 
} from '../services/workshopService';
import { sendMessage, listenToMessages, createWorkshopOrder } from '../services/sellerService';

interface WorkshopPortalProps {
  credential: WorkshopCredential;
  onClose: () => void;
}

export const WorkshopPortal: React.FC<WorkshopPortalProps> = ({ credential, onClose }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'catalog' | 'budgets' | 'chat' | 'profile'>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [taller, setTaller] = useState<Taller | null>(null);
  const [salesperson, setSalesperson] = useState<any>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Cart logic (reusing seller order logic but for themselves)
  const [cartItems, setCartItems] = useState<{productId: string, productName: string, quantity: number, price: number}[]>([]);

  // Chat logic (Workshop chats with their salesperson)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const { taller: tallerData, orders: ordersData, budgets: budgetsData } = await getWorkshopData(credential.tallerId);
      
      const { data: productsRes } = await supabase.from('products').select('*');

      setTaller(tallerData);
      setOrders(ordersData);
      setBudgets(budgetsData);
      if (productsRes) setProducts(productsRes as Product[]);
      
      if (tallerData?.salespersonId) {
        const { data: sp } = await supabase.from('salespeople').select('name').eq('id', tallerData.salespersonId).single();
        if (sp) setSalesperson(sp);
      }
      
      setLoading(false);
    };
    loadData();
  }, [credential.tallerId]);

  useEffect(() => {
    if (taller?.salespersonId) {
      const unsubscribe = listenToMessages(credential.tallerId, taller.salespersonId, setChatMessages);
      return () => unsubscribe();
    }
  }, [taller, credential.tallerId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !taller?.salespersonId) return;
    await sendMessage({
      senderId: credential.tallerId,
      receiverId: taller.salespersonId,
      text: newMessage
    });
    setNewMessage('');
  };

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) {
        return prev.map(i => i.productId === product.id ? {...i, quantity: i.quantity + 1} : i);
      }
      return [...prev, { productId: product.id, productName: product.name, quantity: 1, price: product.price }];
    });
  };

  const handleConfirmOrder = async () => {
    if (!taller || cartItems.length === 0) return;
    try {
      await createWorkshopOrder({
        customerName: taller.name,
        customerEmail: taller.email || 'no-email@taller.es',
        items: cartItems,
        total: cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0),
        shippingAddress: taller.address || '',
        salespersonId: taller.salespersonId
      });
      setCartItems([]);
      alert('¡Pedido enviado con éxito! Tu comercial lo procesará en breve.');
      // Reload orders
      const ords = await getWorkshopOrders(taller.name);
      setOrders(ords);
    } catch (error) {
      alert('Error al procesar el pedido');
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Mi Panel', icon: LayoutDashboard },
    { id: 'catalog', label: 'Catálogo WEPP', icon: Package },
    { id: 'orders', label: 'Mis Pedidos', icon: ShoppingCart },
    { id: 'budgets', label: 'Presupuestos', icon: FileText },
    { id: 'chat', label: 'Mi Comercial', icon: MessageSquare },
    { id: 'profile', label: 'Mi Taller', icon: Wrench },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-wepp-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-wepp-navy text-white flex flex-col h-screen overflow-hidden sticky top-0 z-40">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-wepp-red font-black text-xs tracking-widest uppercase">Portal Taller</span>
            <span className="text-xl font-black uppercase tracking-tighter">WEPP PARTNER</span>
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
              <span className="text-xs font-black uppercase truncate">{credential.name}</span>
              <span className="text-[9px] text-slate-500 tracking-widest uppercase">{taller?.city}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full py-2 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-3 h-3" /> Salir del Portal
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-wepp-red animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado: Socio Autorizado</span>
          </div>
          <h1 className="text-4xl font-black text-wepp-navy uppercase tracking-tighter mb-2">
            {tabs.find(t => t.id === activeTab)?.label}
          </h1>
          <p className="text-slate-400 text-sm font-medium">Bienvenido al ecosistema WEPP para profesionales.</p>
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
                    { label: 'Pedidos Realizados', value: orders.length, icon: ShoppingCart, color: 'wepp-red' },
                    { label: 'Presupuestos Recibidos', value: budgets.length, icon: FileText, color: 'blue' },
                    { label: 'Ahorro Acumulado', value: `${(orders.reduce((acc, o) => acc + o.total, 0) * 0.15).toFixed(2)}€`, icon: Zap, color: 'amber' },
                    { label: 'Estado de Cuenta', value: 'Activa', icon: ShieldCheck, color: 'emerald' }
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
                    <h3 className="text-sm font-black uppercase tracking-widest text-wepp-navy mb-8">Mis Últimas Adquisiciones</h3>
                    <div className="space-y-6">
                      {orders.length === 0 ? (
                        <p className="text-xs text-slate-400 font-bold uppercase py-8 text-center">No hay pedidos registrados aún</p>
                      ) : (
                        orders.slice(0, 5).map(o => (
                          <div key={o.id} className="flex items-center justify-between p-4 bg-slate-50/50 border-l-4 border-wepp-red">
                            <div className="flex flex-col">
                              <span className="text-xs font-black text-wepp-navy uppercase">Pedido {o.id}</span>
                              <span className="text-[10px] text-slate-400">{new Date(o.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest ${o.status === 'Entregado' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                {o.status}
                              </span>
                              <span className="text-sm font-black text-wepp-navy">{o.total.toLocaleString()}€</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-wepp-navy text-white p-8 relative overflow-hidden group">
                      <h3 className="text-xl font-black uppercase tracking-tighter mb-4 italic">Asistencia Directa</h3>
                      <p className="text-slate-400 text-xs mb-8">¿Necesitas soporte técnico o reponer stock urgente? Contacta con tu comercial asignado.</p>
                      <button 
                        onClick={() => setActiveTab('chat')}
                        className="bg-wepp-red text-white px-6 py-3 font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-wepp-navy transition-all"
                      >
                        Hablar con WEPP
                      </button>
                    </div>
                    <div className="bg-white border border-slate-100 p-8">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Promoción Profesional</h4>
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                          <Zap className="w-6 h-6 text-amber-500" />
                        </div>
                        <p className="text-xs font-bold text-wepp-navy">15% de descuento en la gama WEPP 2000 este mes.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'catalog' && (
              <div className="grid lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-8">
                  <div className="relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" placeholder="BUSCAR PRODUCTOS PROFESIONALES..." className="w-full bg-white border border-slate-100 px-16 py-6 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-wepp-red shadow-sm" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {products.map(p => (
                      <div key={p.id} className="bg-white border border-slate-100 p-8 group hover:shadow-xl transition-all">
                        <div className="h-48 overflow-hidden mb-8">
                          <img src={p.image} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <span className="text-[9px] font-black text-wepp-red uppercase tracking-widest mb-2 block">{p.category}</span>
                        <h4 className="text-lg font-black text-wepp-navy uppercase tracking-tight mb-1">{p.name}</h4>
                        <div className="flex items-center justify-between mt-8">
                          <p className="text-2xl font-black text-wepp-navy">{p.price.toLocaleString()}€</p>
                          <button 
                            onClick={() => addToCart(p)}
                            className="bg-wepp-navy text-white px-4 py-3 text-[9px] font-black uppercase tracking-widest hover:bg-wepp-red transition-all"
                          >
                            Solicitar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-4">
                  <div className="bg-white border border-slate-100 shadow-xl sticky top-24 p-8">
                    <h3 className="text-sm font-black uppercase tracking-widest text-wepp-navy mb-8 flex items-center justify-between">
                      Resumen de Pedido
                      <ShoppingCart className="w-5 h-5 text-wepp-red" />
                    </h3>
                    {cartItems.length === 0 ? (
                      <div className="py-12 text-center">
                        <Package className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Pedido vacío</p>
                      </div>
                    ) : (
                      <div className="space-y-4 mb-8">
                        {cartItems.map(item => (
                          <div key={item.productId} className="flex justify-between items-center text-xs font-bold uppercase text-wepp-navy">
                            <div className="flex flex-col">
                              <span className="truncate w-32">{item.productName}</span>
                              <span className="text-[8px] text-slate-400">{item.quantity} unidades</span>
                            </div>
                            <span>{(item.price * item.quantity).toFixed(2)}€</span>
                          </div>
                        ))}
                        <div className="border-t border-slate-100 pt-4 mt-6 flex justify-between items-end">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Base Imponible</span>
                          <span className="text-2xl font-black text-wepp-red">{cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0).toFixed(2)}€</span>
                        </div>
                      </div>
                    )}
                    <button 
                      disabled={cartItems.length === 0}
                      onClick={handleConfirmOrder}
                      className="w-full bg-wepp-navy text-white py-5 font-black uppercase tracking-widest text-xs hover:bg-wepp-red transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Enviar Pedido al Comercial
                    </button>
                    <p className="text-[8px] text-slate-400 uppercase font-black text-center mt-4 tracking-widest">
                      * Al confirmar, tu comercial recibirá la solicitud para generar la factura.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="bg-white border border-slate-100 h-[700px] shadow-xl flex flex-col overflow-hidden">
                <div className="p-8 bg-wepp-navy text-white flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-black">
                      <MessageSquare className="w-6 h-6 text-wepp-red" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest">{salesperson?.name || 'Soporte WEPP Directo'}</h4>
                      <span className="text-[10px] text-wepp-red font-black uppercase tracking-widest">Mi Comercial Asignado</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-slate-50/50">
                  {chatMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300">
                      <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-[9px] font-black uppercase tracking-widest">Inicia una conversación con tu asesor</p>
                    </div>
                  ) : (
                    chatMessages.map((m, i) => (
                      <div key={i} className={`flex ${m.senderId === credential.tallerId ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-5 text-xs font-bold leading-relaxed shadow-sm ${m.senderId === credential.tallerId ? 'bg-wepp-navy text-white rounded-2xl rounded-tr-none' : 'bg-white text-wepp-navy rounded-2xl rounded-tl-none border border-slate-100'}`}>
                          {m.text}
                          <span className={`block text-[8px] mt-2 opacity-50 ${m.senderId === credential.tallerId ? 'text-right' : 'text-left'}`}>
                            {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-8 bg-white border-t border-slate-50 flex gap-4">
                  <input 
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                    type="text" 
                    placeholder="Escribe tu consulta aquí..." 
                    className="flex-1 bg-slate-50 border border-slate-100 px-6 py-4 text-xs font-bold outline-none focus:border-wepp-red transition-all" 
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="w-14 h-14 bg-wepp-navy text-white flex items-center justify-center hover:bg-wepp-red transition-all shadow-xl"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'budgets' && (
              <div className="space-y-8">
                <div className="bg-white border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-50 flex items-center gap-4">
                    <FileText className="w-5 h-5 text-wepp-red" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-wepp-navy">Presupuestos Enviados por el Comercial</h3>
                  </div>
                  {budgets.length === 0 ? (
                    <div className="py-20 text-center">
                      <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">No has recibido presupuestos recientemente</p>
                    </div>
                  ) : (
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">ID</th>
                          <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Items</th>
                          <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Total</th>
                          <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Válido Hasta</th>
                          <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Estado</th>
                          <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {budgets.map(b => (
                          <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-5 text-xs font-black text-wepp-navy">{b.id}</td>
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
                            <td className="px-8 py-5">
                              <button className="text-wepp-red font-black text-[9px] uppercase tracking-widest hover:underline">Ver PDF</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center gap-4">
                  <ShoppingCart className="w-5 h-5 text-wepp-red" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-wepp-navy">Mi Historial de Compras</h3>
                </div>
                <div className="overflow-x-auto">
                  {orders.length === 0 ? (
                    <div className="py-20 text-center">
                      <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">Aún no has realizado ningún pedido</p>
                    </div>
                  ) : (
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">ID</th>
                          <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Total</th>
                          <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Estado</th>
                          <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Fecha</th>
                          <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Artículos</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {orders.map(order => (
                          <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-5 text-xs font-black text-wepp-navy">{order.id}</td>
                            <td className="px-8 py-5 text-sm font-black text-wepp-navy">{order.total.toLocaleString()}€</td>
                            <td className="px-8 py-5">
                              <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest ${
                                order.status === 'Entregado' ? 'bg-emerald-50 text-emerald-600' : 
                                order.status === 'Pendiente' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                              }`}>{order.status}</span>
                            </td>
                            <td className="px-8 py-5 text-[10px] text-slate-400 font-bold uppercase">{new Date(order.date).toLocaleDateString()}</td>
                            <td className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase">{order.items.length} Refs.</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'profile' && taller && (
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white border border-slate-100 p-12">
                  <h3 className="text-xl font-black text-wepp-navy uppercase tracking-tighter mb-8 italic">Datos Profesionales</h3>
                  <div className="space-y-8">
                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Razón Social</label>
                      <p className="text-lg font-black text-wepp-navy uppercase">{taller.name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Ciudad</label>
                        <p className="text-sm font-bold text-wepp-navy uppercase">{taller.city}</p>
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Teléfono</label>
                        <p className="text-sm font-bold text-wepp-navy">{taller.phone || 'No registrado'}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Dirección Fiscal</label>
                      <p className="text-sm font-bold text-wepp-navy uppercase">{taller.address || 'No registrado'}</p>
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Correo de Contacto</label>
                      <p className="text-sm font-bold text-wepp-navy">{taller.email || 'No registrado'}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="bg-wepp-navy text-white p-12">
                    <ShieldCheck className="w-12 h-12 text-wepp-red mb-6" />
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Garantía WEPP Partner</h3>
                    <p className="text-slate-400 text-xs leading-relaxed mb-8">
                      Como taller asociado, tienes acceso prioritario a formación técnica, soporte en diagnósticos complejos y precios preferenciales en toda la gama de productos de mantenimiento y cuidado.
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="h-[1px] flex-1 bg-white/10"></div>
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Since 2024</span>
                      <div className="h-[1px] flex-1 bg-white/10"></div>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-100 p-8 flex items-start gap-4">
                    <Info className="w-6 h-6 text-wepp-red shrink-0" />
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-wepp-navy mb-2">Actualización de Datos</h4>
                      <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                        Para modificar tus datos fiscales o de contacto, por favor envía un mensaje a tu comercial a través de la sección de chat.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
