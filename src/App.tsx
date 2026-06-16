import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';

import { Footer } from './components/Footer';
import { AboutPage } from './components/AboutPage';
import { ContactSection } from './components/ContactSection';
import { PRODUCTS, Taller } from './types';
import { ChevronRight, ShieldCheck, Zap, Gauge, Award, Cpu, MapPin, Phone, Mail, Wrench } from 'lucide-react';
import { motion } from 'motion/react';
import { AdminPortal } from './components/AdminPortal';
import { LoginModal } from './components/LoginModal';
import { VendorPortal } from './components/VendorPortal';
import { WorkshopPortal } from './components/WorkshopPortal';
import { UserSession } from './types';

import { LanguageProvider, useLanguage } from './services/LanguageContext';
import { supabase } from './services/supabase';
import { getTalleres } from './services/adminService';
import { WorkshopSignupModal } from './components/WorkshopSignupModal';

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

function AppContent() {
  const { t } = useLanguage();
  const [view, setView] = useState<'home' | 'products' | 'about' | 'contact' | 'admin'>('home');
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [storeProducts, setStoreProducts] = useState<any[]>(PRODUCTS);
  const [showLogin, setShowLogin] = useState(false);
  const [session, setSession] = useState<UserSession | null>(null);
  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [showWorkshopSignup, setShowWorkshopSignup] = useState(false);

  const categories = ['Todos', 'Motor y Transmisión', 'Refrigeración', 'Aire Acondicionado', 'Combustible', 'Frenos', 'Mantenimiento y Cuidado', 'Carrocería'];

  useEffect(() => {
    // Cargar productos desde Supabase
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (data && data.length > 0) {
        setStoreProducts(data);
      } else {
        // Fallback a estáticos si la DB está vacía
        setStoreProducts(PRODUCTS);
      }
    };
    fetchProducts();

    // Cargar talleres
    getTalleres().then(setTalleres);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() !== '') {
      setView('products');
      setActiveCategory('Todos');
    }
  };

  const handleLoginSuccess = (s: UserSession) => {
    setSession(s);
    setShowLogin(false);
    if (s.type === 'admin') {
      setView('admin');
    }
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setSession(null);
    setView('home');
  };

  const filteredProducts = storeProducts.filter(p => {
    const matchesCategory = activeCategory === 'Todos' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Portal overrides everything
  if (session?.type === 'vendor') {
    return <VendorPortal credential={session.credential!} onClose={handleLogout} />;
  }

  if (session?.type === 'workshop') {
    return <WorkshopPortal credential={session.workshopCredential!} onClose={handleLogout} />;
  }

  // Sitio en mantenimiento para el público — admin puede entrar y probar todo el sitio
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wepp-navy text-white p-6 relative overflow-hidden">
        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            onSuccess={handleLoginSuccess}
            adminOnly
          />
        )}
        <div className="absolute top-0 right-0 w-96 h-96 bg-wepp-red/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-wepp-red/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="relative z-10 text-center max-w-lg">
          <img src="/Wepp_logo.png" alt="WEPP" className="h-12 mx-auto mb-8 opacity-90" />
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-wepp-red animate-pulse" />
            <span className="text-wepp-red text-[10px] font-black uppercase tracking-[0.4em]">
              Sitio en construcción
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">
            Próximamente
          </h1>
          <p className="text-white/60 text-sm font-medium mb-10">
            Estamos preparando la nueva web de WEPP. Vuelve pronto.
          </p>
          <button
            onClick={() => setShowLogin(true)}
            className="bg-white/10 hover:bg-wepp-red text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
          >
            Acceder
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-wepp-silver">
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
      {showWorkshopSignup && (
        <WorkshopSignupModal onClose={() => setShowWorkshopSignup(false)} />
      )}

      <Navbar setView={setView} currentView={view} onSearch={handleSearch} />

      <main className="flex-grow pt-16 md:pt-20">
        {view === 'home' ? (
          <>
            <div id="hero">
              <Hero setView={setView} />
            </div>


            {/* Technology Section - Bento Grid */}
            <section id="tecnologia" className="py-32 bg-wepp-silver overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="mb-20"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-[2px] w-8 bg-wepp-red"></div>
                    <span className="text-wepp-red text-[10px] font-black uppercase tracking-[0.3em]">{t('tech.badge')}</span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black text-wepp-navy uppercase tracking-tighter leading-none mb-8">
                    {t('tech.title')} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-wepp-red to-orange-500">{t('tech.title_alt')}</span>
                  </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="md:col-span-2 md:row-span-2 bg-wepp-navy rounded-3xl overflow-hidden relative group shadow-2xl"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=1000"
                      className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700"
                      alt="DCT Technology"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-wepp-navy via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-12">
                      <Cpu className="w-12 h-12 text-wepp-red mb-6" />
                      <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">{t('tech.dct_title')}</h3>
                      <p className="text-slate-300 max-w-md">{t('tech.dct_desc')}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-white p-10 rounded-3xl border border-slate-200 hover:border-wepp-red transition-colors group shadow-xl"
                  >
                    <Zap className="w-10 h-10 text-wepp-red mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-black text-wepp-navy mb-2 uppercase tracking-tighter">{t('tech.power_title')}</h3>
                    <p className="text-slate-500 text-sm">{t('tech.power_desc')}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="bg-wepp-red p-10 rounded-3xl group shadow-xl shadow-wepp-red/20"
                  >
                    <ShieldCheck className="w-10 h-10 text-white mb-6 group-hover:rotate-12 transition-transform" />
                    <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">{t('tech.shield_title')}</h3>
                    <p className="text-red-100 text-sm">{t('tech.shield_desc')}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="md:col-span-2 bg-slate-900 p-10 rounded-3xl relative overflow-hidden group shadow-2xl"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg"
                        alt="BMW Official Approval"
                        className="w-24 h-24 grayscale brightness-200"
                      />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">{t('tech.gold_title')}</h3>
                      <p className="text-slate-400 max-w-md mb-6">{t('tech.gold_desc')}</p>
                      <button
                        onClick={() => document.getElementById('sobre-nosotros')?.scrollIntoView({ behavior: 'smooth' })}
                        className="text-wepp-red font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all"
                      >
                        {t('tech.more')} <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* About Us Section */}
            <section id="sobre-nosotros" className="pt-24 lg:pt-32 pb-16 bg-white relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="lg:col-span-5 relative"
                  >
                    <div className="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[400px] overflow-hidden rounded-[32px] shadow-2xl group relative">
                      <img
                        src="/about-main.jpg"
                        alt="WEPP Quality Control"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-wepp-navy/20 to-transparent"></div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                      className="absolute -bottom-6 -right-6 lg:-bottom-8 lg:-right-8 bg-wepp-red p-8 lg:p-10 rounded-[24px] shadow-2xl shadow-wepp-red/20 hidden md:block z-10"
                    >
                      <h3 className="text-white font-black text-4xl lg:text-5xl tracking-tighter mb-1">25+</h3>
                      <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em]">{t('about.badge')}</p>
                    </motion.div>
                  </motion.div>

                  <div className="lg:col-span-7">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                    >
                      <div className="flex items-center gap-3 mb-8">
                        <div className="h-[1px] w-12 bg-wepp-red"></div>
                        <span className="text-wepp-red text-[10px] font-black uppercase tracking-[0.4em]">{t('about.badge')}</span>
                      </div>

                      <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-wepp-navy leading-[0.9] uppercase tracking-tighter mb-8 lg:mb-10">
                        {t('about.title')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-wepp-red to-orange-500 italic font-serif normal-case tracking-normal">{t('about.title_alt')}</span>
                      </h2>

                      <p className="text-lg lg:text-xl text-slate-500 leading-relaxed mb-10 lg:mb-12 font-light">
                        {t('about.desc')}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 mb-12 lg:mb-16">
                        {[
                          { title: t('about.cat1'), items: ["Protección corrosión", "Limpieza FAP"] },
                          { title: t('about.cat2'), items: ["Sellado radiador", "Aire acondicionado"] },
                          { title: t('about.cat3'), items: ["Protección frenos", "Caja dirección"] },
                          { title: t('about.cat4'), items: ["Fórmulas DCT", "Larga duración"] }
                        ].map((cat, idx) => (
                          <div key={idx} className="space-y-3">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-wepp-navy border-b border-slate-100 pb-2">{cat.title}</h4>
                            <div className="space-y-2">
                              {cat.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 group">
                                  <div className="w-1.5 h-1.5 bg-wepp-red/30 group-hover:bg-wepp-red transition-colors"></div>
                                  <span className="text-sm text-slate-400 group-hover:text-wepp-navy transition-colors">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-slate-50 p-8 lg:p-10 rounded-[24px] border border-slate-100">
                        <p className="text-slate-500 text-sm leading-relaxed mb-6 lg:mb-8 font-medium">
                          {t('about.quote')}
                        </p>
                        <div className="flex flex-wrap gap-6 items-center justify-between">
                          <button
                            onClick={() => setView('about')}
                            className="bg-wepp-navy hover:bg-wepp-red text-white px-8 lg:px-10 py-4 lg:py-5 font-black uppercase tracking-widest text-[10px] transition-all shadow-xl active:scale-95"
                          >
                            {t('about.cta')}
                          </button>
                          <div className="flex gap-4 opacity-30 grayscale items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest">Europe</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">East Asia</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">North Africa</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </section>


            {/* Workshop Section */}
            <section id="talleres" className="py-32 bg-wepp-silver overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="bg-wepp-navy rounded-3xl overflow-hidden relative shadow-2xl"
                >
                  <div className="absolute inset-0 technical-grid opacity-10"></div>
                  <div className="relative z-10 grid lg:grid-cols-2 items-center">
                    <div className="p-8 sm:p-16 lg:p-24 relative z-20">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="h-[2px] w-8 bg-wepp-red"></div>
                        <span className="text-wepp-red text-[10px] font-black uppercase tracking-[0.3em]">{t('workshop.badge')}</span>
                      </div>
                      <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 md:mb-8 uppercase tracking-tighter leading-none">
                        {t('workshop.title')}
                      </h2>
                      <p className="text-slate-400 text-sm sm:text-lg mb-8 md:mb-12 font-medium leading-relaxed">
                        {t('workshop.desc')}
                      </p>
                      <div className="flex flex-wrap gap-6">
                        <button
                          onClick={() => setShowWorkshopSignup(true)}
                          className="bg-wepp-red text-white px-10 py-5 rounded-none font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-xl shadow-wepp-red/20 active:scale-95"
                        >
                          {t('workshop.cta1')}
                        </button>
                        <button
                          onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
                          className="border border-white/20 text-white px-10 py-5 rounded-none font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all active:scale-95"
                        >
                          {t('workshop.cta2')}
                        </button>
                      </div>
                    </div>
                    <div className="h-72 sm:h-96 lg:h-full lg:min-h-[600px] relative overflow-hidden group">
                      <img
                        src="/workshop-real.png"
                        alt="Professional Workshop with WEPP Products"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-l from-transparent to-wepp-navy lg:block hidden"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-wepp-navy via-transparent to-transparent lg:hidden block"></div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Talleres Partners Section */}
            {talleres.length > 0 && (
              <section id="talleres-partners" className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-16"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-[2px] w-8 bg-wepp-red"></div>
                      <span className="text-wepp-red text-[10px] font-black uppercase tracking-[0.3em]">Red de Distribución</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-wepp-navy uppercase tracking-tighter leading-none">
                      Talleres <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-wepp-red to-orange-500">Autorizados</span>
                    </h2>
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {talleres.filter(t => t.status === 'Activo').map((taller, i) => (
                      <motion.div
                        key={taller.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="bg-slate-50 border border-slate-100 p-8 hover:border-wepp-red hover:shadow-xl transition-all group"
                      >
                        <div className="flex items-start justify-between mb-6">
                          <div className="w-12 h-12 bg-wepp-navy rounded-2xl flex items-center justify-center group-hover:bg-wepp-red transition-colors">
                            <Wrench className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1">
                            Activo
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-wepp-navy uppercase tracking-tight mb-1">
                          {taller.name}
                        </h3>
                        <div className="flex items-center gap-2 text-slate-400 mb-4">
                          <MapPin className="w-3 h-3 text-wepp-red flex-shrink-0" />
                          <span className="text-xs font-medium">{taller.city}</span>
                        </div>
                        {(taller.phone || taller.email) && (
                          <div className="border-t border-slate-100 pt-4 space-y-2">
                            {taller.phone && (
                              <a href={`tel:${taller.phone}`} className="flex items-center gap-2 text-xs text-slate-400 hover:text-wepp-navy transition-colors">
                                <Phone className="w-3 h-3 text-wepp-red" /> {taller.phone}
                              </a>
                            )}
                            {taller.email && (
                              <a href={`mailto:${taller.email}`} className="flex items-center gap-2 text-xs text-slate-400 hover:text-wepp-navy transition-colors">
                                <Mail className="w-3 h-3 text-wepp-red" /> {taller.email}
                              </a>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        ) : view === 'products' ? (
          <section className="py-20 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-20"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-[2px] w-8 bg-wepp-red"></div>
                      <span className="text-wepp-red text-[10px] font-black uppercase tracking-[0.3em]">{t('products.badge')}</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black text-wepp-navy uppercase tracking-tighter leading-none">
                      {t('products.title')} <br />
                      <span className="text-wepp-red italic font-serif lowercase tracking-normal">{t('products.title_alt')}</span>
                    </h2>
                  </div>
                  <a
                    href="https://mdpmqndnbwohkddwbiff.supabase.co/storage/v1/object/public/documentos/catalogo.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-2 bg-wepp-navy text-white text-[10px] font-black uppercase tracking-widest px-6 py-4 hover:bg-wepp-red transition-colors duration-300 shrink-0 self-end"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Descargar Catálogo
                  </a>
                </div>
              </motion.div>

              <div className="flex items-center gap-3 overflow-x-auto pb-8 mb-12 no-scrollbar">
                {categories.map((cat, idx) => (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-8 py-4 rounded-none text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeCategory === cat
                      ? 'bg-wepp-navy text-white border-wepp-navy'
                      : 'bg-white text-wepp-navy border-slate-200 hover:border-wepp-red'
                      }`}
                  >
                    {cat === 'Todos' ? t('products.cat_all') : cat}
                  </motion.button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        ) : view === 'about' ? (
          <AboutPage setView={setView} />
        ) : view === 'contact' ? (
          <ContactSection />
        ) : (
          <AdminPortal
            products={storeProducts}
            setProducts={setStoreProducts}
            onClose={handleLogout}
            adminEmail={session?.type === 'admin' ? session.email : ''}
          />
        )}

      </main>

      <Footer setView={setView} onOpenLogin={() => setShowLogin(true)} />
    </div>
  );
}
