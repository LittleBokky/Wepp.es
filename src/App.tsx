import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { AIAdvisor } from './components/AIAdvisor';
import { Footer } from './components/Footer';
import { AboutPage } from './components/AboutPage';
import { PRODUCTS } from './types';
import { ChevronRight, ShieldCheck, Zap, Gauge, Award, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [view, setView] = useState<'home' | 'products' | 'about'>('home');
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const categories = ['Todos', 'Motor y Transmisión', 'Refrigeración', 'Aire Acondicionado', 'Combustible', 'Frenos', 'Mantenimiento y Cuidado', 'Carrocería'];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() !== '') {
      setView('products');
      setActiveCategory('Todos');
    }
  };

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = activeCategory === 'Todos' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col font-sans bg-wepp-silver">
      <Navbar setView={setView} currentView={view} onSearch={handleSearch} />

      <main className="flex-grow pt-16 md:pt-20">
        {view === 'home' ? (
          <>
            <div id="hero">
              <Hero setView={setView} />
            </div>

            {/* Trust Bar - Refined Brand Marquee */}
            <div className="bg-white border-y border-slate-50 py-10 relative overflow-hidden group">
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <div className="flex items-center gap-4 opacity-60">
                  <span className="text-[9px] font-black uppercase tracking-[0.5em] text-wepp-navy">Partner Tecnológico</span>
                  <div className="h-[1px] flex-grow bg-slate-100"></div>
                </div>
              </div>

              <div className="flex overflow-hidden">
                <motion.div
                  animate={{ x: [0, -1000] }}
                  transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="flex gap-20 md:gap-40 items-center whitespace-nowrap px-10"
                >
                  {[
                    'MERCEDES-BENZ', 'BMW GROUP', 'AUDI AG', 'PORSCHE', 'VOLKSWAGEN',
                    'MERCEDES-BENZ', 'BMW GROUP', 'AUDI AG', 'PORSCHE', 'VOLKSWAGEN'
                  ].map((brand, i) => (
                    <span
                      key={`${brand}-${i}`}
                      className="text-sm md:text-lg font-black tracking-[0.1em] text-slate-400 hover:text-wepp-red transition-colors duration-500 cursor-default select-none"
                    >
                      {brand}
                    </span>
                  ))}
                </motion.div>

                {/* Second copy for infinite effect */}
                <motion.div
                  animate={{ x: [0, -1000] }}
                  transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="flex gap-20 md:gap-40 items-center whitespace-nowrap px-10"
                >
                  {[
                    'MERCEDES-BENZ', 'BMW GROUP', 'AUDI AG', 'PORSCHE', 'VOLKSWAGEN',
                    'MERCEDES-BENZ', 'BMW GROUP', 'AUDI AG', 'PORSCHE', 'VOLKSWAGEN'
                  ].map((brand, i) => (
                    <span
                      key={`${brand}-copy-${i}`}
                      className="text-sm md:text-lg font-black tracking-[0.1em] text-slate-400 hover:text-wepp-red transition-colors duration-500 cursor-default select-none"
                    >
                      {brand}
                    </span>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Technology Section - Bento Grid */}
            <section className="py-32 bg-wepp-silver overflow-hidden">
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
                    <span className="text-wepp-red text-[10px] font-black uppercase tracking-[0.3em]">Innovación Alemana</span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black text-wepp-navy uppercase tracking-tighter leading-none mb-8">
                    TECNOLOGÍA <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-wepp-red to-orange-500">DE VANGUARDIA.</span>
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
                      <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Deposit Control Technology</h3>
                      <p className="text-slate-300 max-w-md">La base de todos nuestros productos. Una fórmula molecular que desintegra depósitos sin dañar componentes sensibles.</p>
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
                    <h3 className="text-xl font-black text-wepp-navy mb-2 uppercase tracking-tighter">Potencia Inmediata</h3>
                    <p className="text-slate-500 text-sm">Resultados perceptibles desde los primeros kilómetros de uso.</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="bg-wepp-red p-10 rounded-3xl group shadow-xl shadow-wepp-red/20"
                  >
                    <ShieldCheck className="w-10 h-10 text-white mb-6 group-hover:rotate-12 transition-transform" />
                    <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">Protección Total</h3>
                    <p className="text-red-100 text-sm">Certificación TUV que garantiza la seguridad de su motor.</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="md:col-span-2 bg-slate-900 p-10 rounded-3xl relative overflow-hidden group shadow-2xl"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <Award className="w-32 h-32 text-white" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Estándar de Oro en Automoción</h3>
                      <p className="text-slate-400 max-w-md mb-6">Utilizado por los principales fabricantes alemanes en sus programas de mantenimiento oficial.</p>
                      <button
                        onClick={() => document.getElementById('sobre-nosotros')?.scrollIntoView({ behavior: 'smooth' })}
                        className="text-wepp-red font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all"
                      >
                        Saber más <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* About Us Section */}
            <section id="sobre-nosotros" className="py-40 bg-white relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-24 items-start">
                  {/* Left Column: Visual & Legacy */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="lg:col-span-5 relative"
                  >
                    <div className="aspect-[4/5] overflow-hidden rounded-[40px] shadow-2xl group">
                      <img
                        src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000"
                        alt="WEPP Laboratory"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-wepp-navy/40 to-transparent"></div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                      className="absolute -bottom-10 -right-10 bg-wepp-red p-12 rounded-[32px] shadow-2xl shadow-wepp-red/20 hidden md:block"
                    >
                      <h3 className="text-white font-black text-5xl tracking-tighter mb-1">45+</h3>
                      <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em]">Años de Maestría Alemana</p>
                    </motion.div>
                  </motion.div>

                  {/* Right Column: Narrative */}
                  <div className="lg:col-span-7 pt-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                    >
                      <div className="flex items-center gap-3 mb-8">
                        <div className="h-[1px] w-12 bg-wepp-red"></div>
                        <span className="text-wepp-red text-[10px] font-black uppercase tracking-[0.4em]">Nuestro Legado</span>
                      </div>

                      <h2 className="text-4xl md:text-6xl font-black text-wepp-navy leading-[0.9] uppercase tracking-tighter mb-10">
                        Hacemos que los coches <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-wepp-red to-orange-500 italic font-serif normal-case tracking-normal">funcionen mejor.</span>
                      </h2>

                      <p className="text-xl text-slate-500 leading-relaxed mb-12 font-light">
                        Suministramos exclusivamente a talleres especializados desde hace más de 45 años.
                        Basándonos en fórmulas probadas, producimos soluciones de alta calidad que
                        optimizan la rentabilidad de su taller y la vida útil de cada vehículo.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 mb-16">
                        {[
                          { title: "Motores & Transmisión", items: ["Protección corrosión", "Limpieza FAP"] },
                          { title: "Sistemas Térmicos", items: ["Sellado radiador", "Aire acondicionado"] },
                          { title: "Dinámica & Frenado", items: ["Protección frenos", "Caja dirección"] },
                          { title: "Mantenimiento", items: ["Fórmulas DCT", "Larga duración"] }
                        ].map((cat, idx) => (
                          <div key={idx} className="space-y-4">
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

                      <div className="bg-slate-50 p-10 rounded-[32px] border border-slate-100">
                        <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
                          "Nuestros productos impulsan el éxito económico de nuestros clientes.
                          Ofrecemos un concepto integral de consultoría y formación técnica avanzada."
                        </p>
                        <div className="flex flex-wrap gap-8 items-center justify-between">
                          <button
                            onClick={() => setView('about')}
                            className="bg-wepp-navy hover:bg-wepp-red text-white px-10 py-5 font-black uppercase tracking-widest text-[10px] transition-all shadow-xl active:scale-95"
                          >
                            Ver nuestra historia
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

            {/* AI Advisor Section */}
            <div className="relative overflow-hidden">
              <AIAdvisor />
            </div>

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
                    <div className="p-16 lg:p-24">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="h-[2px] w-8 bg-wepp-red"></div>
                        <span className="text-wepp-red text-[10px] font-black uppercase tracking-[0.3em]">Red de Talleres</span>
                      </div>
                      <h2 className="text-5xl font-black text-white mb-8 uppercase tracking-tighter leading-none">
                        ¿ERES UN TALLER <br /> PROFESIONAL?
                      </h2>
                      <p className="text-slate-400 text-lg mb-12 font-medium leading-relaxed">
                        Únete a la red oficial WEPP España. Accede a formación técnica avanzada, herramientas de diagnóstico DCT y precios exclusivos de fábrica.
                      </p>
                      <div className="flex flex-wrap gap-6">
                        <button className="bg-wepp-red text-white px-10 py-5 rounded-none font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-xl shadow-wepp-red/20 active:scale-95">
                          Registrar Taller
                        </button>
                        <button className="border border-white/20 text-white px-10 py-5 rounded-none font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all active:scale-95">
                          Soporte Técnico
                        </button>
                      </div>
                    </div>
                    <div className="h-full min-h-[500px] relative overflow-hidden group">
                      <img
                        src="https://images.unsplash.com/photo-1632823471565-1ec2c63db7f5?auto=format&fit=crop&q=80&w=1000"
                        alt="Professional Workshop"
                        className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:scale-110 transition-transform duration-[2000ms]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-l from-transparent to-wepp-navy lg:block hidden"></div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>
          </>
        ) : view === 'products' ? (
          <section className="py-20 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[2px] w-8 bg-wepp-red"></div>
                  <span className="text-wepp-red text-[10px] font-black uppercase tracking-[0.3em]">Catálogo Oficial</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-wepp-navy uppercase tracking-tighter leading-none">
                  NUESTROS <br />
                  <span className="text-wepp-red italic font-serif lowercase tracking-normal">productos.</span>
                </h2>
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
                    {cat}
                  </motion.button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        ) : (
          <AboutPage />
        )}
      </main>

      <Footer setView={setView} />
    </div>

  );
}
