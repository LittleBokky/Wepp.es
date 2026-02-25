import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Play, ShieldCheck, Zap, Gauge } from 'lucide-react';

interface HeroProps {
  setView: (view: 'home' | 'products') => void;
}

export const Hero: React.FC<HeroProps> = ({ setView }) => {
  return (
    <div className="relative overflow-hidden bg-wepp-dark min-h-screen flex items-center">
      {/* Background Pattern & Gradients */}
      <div className="absolute inset-0 technical-grid opacity-20"></div>
      
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.3 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <motion.img 
          animate={{ 
            scale: [1, 1.05, 1],
            x: [0, 15, 0],
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000" 
          alt="Luxury Car Engine" 
          className="w-full h-full object-cover mix-blend-luminosity"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-wepp-dark via-transparent to-wepp-dark/50 z-10"></div>
      
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, 50, 0]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 bg-wepp-red/10 blur-[120px] rounded-full z-0"
      ></motion.div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wepp-red/10 border border-wepp-red/20 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wepp-red opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-wepp-red"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wepp-red">
                  German Engineering Excellence
                </span>
              </div>
              
              <h1 className="text-7xl md:text-[120px] font-black text-white leading-[0.85] mb-8 tracking-tighter uppercase">
                INGENIERÍA <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-wepp-red via-red-500 to-orange-500">
                  SIN LÍMITES.
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-400 mb-12 leading-relaxed max-w-2xl font-light">
                Hacemos que los coches funcionen mejor y que los talleres tengan más éxito.
                Tecnología <span className="text-white font-bold">DCT (Deposit Control Technology)</span> de precisión alemana.
              </p>
              
              <div className="flex flex-wrap gap-6">
                <button 
                  onClick={() => setView('products')}
                  className="group relative bg-wepp-red hover:bg-red-700 text-white px-12 py-6 rounded-none font-black uppercase tracking-widest text-sm flex items-center gap-3 transition-all red-glow"
                >
                  Explorar Catálogo
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="group bg-white/5 hover:bg-white/10 backdrop-blur-md text-white border border-white/10 px-12 py-6 rounded-none font-black uppercase tracking-widest text-sm flex items-center gap-3 transition-all">
                  <Play className="w-5 h-5 fill-wepp-red text-wepp-red group-hover:scale-110 transition-transform" /> 
                  Ver Tecnología
                </button>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-4 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="glass-panel p-8 rounded-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck className="w-32 h-32 text-white" />
              </div>
              
              <div className="space-y-8 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-wepp-red/20 rounded-lg">
                    <Zap className="w-6 h-6 text-wepp-red" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Potencia Máxima</h4>
                    <p className="text-slate-400 text-sm">Recupera el rendimiento original de fábrica.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-wepp-red/20 rounded-lg">
                    <Gauge className="w-6 h-6 text-wepp-red" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Eficiencia DCT</h4>
                    <p className="text-slate-400 text-sm">Reducción drástica de emisiones y consumo.</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pureza de Inyección</span>
                    <span className="text-wepp-red font-black text-xl">99.8%</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "99.8%" }}
                      transition={{ duration: 2, delay: 1 }}
                      className="h-full bg-wepp-red"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Vertical Label */}
      <div className="absolute right-12 bottom-24 hidden xl:block pointer-events-none">
        <motion.p 
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.05, 0.08, 0.05]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="writing-mode-vertical text-white/5 text-[180px] font-black uppercase tracking-tighter leading-none"
        >
          GERMAN TECH
        </motion.p>
      </div>
    </div>
  );
};
