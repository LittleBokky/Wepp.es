import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { AIAdvisor } from './components/AIAdvisor';
import { Footer } from './components/Footer';
import { PRODUCTS } from './types';
import { ChevronRight, ShieldCheck, Zap, Gauge, Award, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [view, setView] = useState<'home' | 'products'>('home');
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const categories = ['Todos', 'Motor y Transmisión', 'Refrigeración', 'Aire Acondicionado', 'Combustible', 'Frenos', 'Mantenimiento y Cuidado', 'Carrocería'];

  const filteredProducts = activeCategory === 'Todos' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-wepp-silver">
      <Navbar setView={setView} currentView={view} />
      
      <main className="flex-grow pt-24">
        {view === 'home' ? (
          <>
            <div id="hero">
              <Hero setView={setView} />
            </div>

            {/* Trust Bar */}
            <div className="bg-white border-b border-slate-100 py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap justify-between items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                  <span className="text-2xl font-black tracking-tighter">MERCEDES-BENZ</span>
                  <span className="text-2xl font-black tracking-tighter">BMW GROUP</span>
                  <span className="text-2xl font-black tracking-tighter">AUDI AG</span>
                  <span className="text-2xl font-black tracking-tighter">PORSCHE</span>
                  <span className="text-2xl font-black tracking-tighter">VOLKSWAGEN</span>
                </div>
              </div>
            </div>

            {/* Technology Section - Bento Grid */}
            <section className="py-32 bg-wepp-silver overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-[2px] w-8 bg-wepp-red"></div>
                    <span className="text-wepp-red text-[10px] font-black uppercase tracking-[0.3em]">Innovación Alemana</span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black text-wepp-navy uppercase tracking-tighter leading-none mb-8">
                    TECNOLOGÍA <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-wepp-red to-orange-500">DE VANGUARDIA.</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-2 md:row-span-2 bg-wepp-navy rounded-3xl overflow-hidden relative group">
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
                  </div>

                  <div className="bg-white p-10 rounded-3xl border border-slate-200 hover:border-wepp-red transition-colors group">
                    <Zap className="w-10 h-10 text-wepp-red mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-black text-wepp-navy mb-2 uppercase tracking-tighter">Potencia Inmediata</h3>
                    <p className="text-slate-500 text-sm">Resultados perceptibles desde los primeros kilómetros de uso.</p>
                  </div>

                  <div className="bg-wepp-red p-10 rounded-3xl group">
                    <ShieldCheck className="w-10 h-10 text-white mb-6 group-hover:rotate-12 transition-transform" />
                    <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">Protección Total</h3>
                    <p className="text-red-100 text-sm">Certificación TUV que garantiza la seguridad de su motor.</p>
                  </div>

                  <div className="md:col-span-2 bg-slate-900 p-10 rounded-3xl relative overflow-hidden group">
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
                  </div>
                </div>
              </div>
            </section>

            {/* About Us Section */}
            <section id="sobre-nosotros" className="py-32 bg-white relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-24 items-center">
                  <div className="relative">
                    <div className="absolute -top-12 -left-12 w-48 h-48 bg-wepp-red/5 rounded-full blur-3xl"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000" 
                      alt="WEPP Laboratory" 
                      className="rounded-[32px] shadow-2xl relative z-10"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-10 -right-10 bg-wepp-navy p-10 rounded-3xl shadow-2xl z-20 hidden md:block">
                      <p className="text-white font-black text-4xl tracking-tighter mb-2">25+</p>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Años de Innovación</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-[2px] w-8 bg-wepp-red"></div>
                      <span className="text-wepp-red text-[10px] font-black uppercase tracking-[0.3em]">Nuestra Misión</span>
                    </div>
                    <h2 className="text-5xl font-black text-wepp-navy mb-10 uppercase tracking-tighter leading-none">
                      SOBRE <br />
                      <span className="text-wepp-red italic font-serif lowercase tracking-normal">nosotros.</span>
                    </h2>
                    <div className="space-y-8">
                      <div className="flex gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-wepp-silver flex items-center justify-center flex-shrink-0">
                          <ShieldCheck className="w-6 h-6 text-wepp-navy" />
                        </div>
                        <div>
                          <h4 className="font-black text-wepp-navy uppercase tracking-widest text-sm mb-2">Calidad Profesional</h4>
                          <p className="text-slate-500 text-sm leading-relaxed">Productos químico-técnicos innovadores y de alta calidad diseñados exclusivamente para el mecánico profesional.</p>
                        </div>
                      </div>
                      <div className="flex gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-wepp-silver flex items-center justify-center flex-shrink-0">
                          <Zap className="w-6 h-6 text-wepp-navy" />
                        </div>
                        <div>
                          <h4 className="font-black text-wepp-navy uppercase tracking-widest text-sm mb-2">Valor Óptimo</h4>
                          <p className="text-slate-500 text-sm leading-relaxed">Ofrecemos una relación calidad-precio líder en el mercado, optimizando la rentabilidad de su taller.</p>
                        </div>
                      </div>
                      <div className="flex gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-wepp-silver flex items-center justify-center flex-shrink-0">
                          <Cpu className="w-6 h-6 text-wepp-navy" />
                        </div>
                        <div>
                          <h4 className="font-black text-wepp-navy uppercase tracking-widest text-sm mb-2">Compromiso de Salud</h4>
                          <p className="text-slate-500 text-sm leading-relaxed">Renunciamos al uso de materias primas tóxicas y cancerígenas para proteger la salud de los mecánicos.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* AI Advisor Section */}
            <AIAdvisor />

            {/* Workshop Section */}
            <section id="talleres" className="py-32 bg-wepp-silver overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-wepp-navy rounded-3xl overflow-hidden relative shadow-2xl">
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
                        <button className="bg-wepp-red text-white px-10 py-5 rounded-none font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-xl shadow-wepp-red/20">
                          Registrar Taller
                        </button>
                        <button className="border border-white/20 text-white px-10 py-5 rounded-none font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">
                          Soporte Técnico
                        </button>
                      </div>
                    </div>
                    <div className="h-full min-h-[500px] relative">
                      <img 
                        src="https://images.unsplash.com/photo-1632823471565-1ec2c63db7f5?auto=format&fit=crop&q=80&w=1000" 
                        alt="Professional Workshop" 
                        className="absolute inset-0 w-full h-full object-cover grayscale opacity-50"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-l from-transparent to-wepp-navy lg:block hidden"></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="py-20 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[2px] w-8 bg-wepp-red"></div>
                  <span className="text-wepp-red text-[10px] font-black uppercase tracking-[0.3em]">Catálogo Oficial</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-wepp-navy uppercase tracking-tighter leading-none">
                  NUESTROS <br />
                  <span className="text-wepp-red italic font-serif lowercase tracking-normal">productos.</span>
                </h2>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-8 mb-12 no-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-8 py-4 rounded-none text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                      activeCategory === cat 
                        ? 'bg-wepp-navy text-white border-wepp-navy' 
                        : 'bg-white text-wepp-navy border-slate-200 hover:border-wepp-red'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
