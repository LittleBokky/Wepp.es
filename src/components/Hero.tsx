import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronRight, Play } from 'lucide-react';
import { useLanguage } from '../services/LanguageContext';

interface HeroProps {
  setView: (view: 'home' | 'products' | 'contact') => void;
}

export const Hero: React.FC<HeroProps> = ({ setView }) => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <div ref={containerRef} className="relative overflow-hidden bg-wepp-dark min-h-[105vh] flex items-center">
      {/* Background Pattern & Gradients */}
      <div className="absolute inset-0 technical-grid opacity-20 z-10"></div>

      {/* Parallax Background Image */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          transition: { duration: 20, repeat: Infinity, ease: "linear" }
        }}
        style={{ y: y1 }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-wepp-dark/60 via-wepp-dark/20 to-wepp-dark z-10"></div>
        <img
          src="/hero-main.jpg"
          alt="Premium Car Repair Service"
          className="w-full h-full object-cover brightness-75"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      {/* Animated Glows */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [-20, 20, -20]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-wepp-red/20 blur-[120px] rounded-full z-10"
      />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-12">


            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 mb-6 md:mb-12 pt-10 md:pt-0"
            >
              <h1 className="text-[2.75rem] leading-[0.95] sm:text-6xl md:text-[110px] font-black text-white tracking-tighter uppercase mb-6 md:mb-12">
                {t('hero.title1')} <span className="text-transparent bg-clip-text bg-gradient-to-tr from-white to-white/30 italic font-serif normal-case tracking-normal text-[3rem] sm:text-7xl md:text-[120px]">{t('hero.title1_alt')}</span><br />
                {t('hero.title2')} <span className="text-wepp-red italic font-serif normal-case tracking-normal relative text-[3rem] sm:text-7xl md:text-[120px] inline-block">
                  {t('hero.title2_alt')}
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 1, duration: 1.5 }}
                    className="absolute bottom-1 md:bottom-4 left-0 h-[2px] md:h-[3px] bg-wepp-red/40 block"
                  />
                </span>
              </h1>

              <p className="text-sm sm:text-lg md:text-xl text-slate-300 max-w-xl leading-relaxed font-light border-l-2 border-wepp-red/30 pl-4 md:pl-8 drop-shadow-lg">
                {t('hero.desc')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-8"
            >
              <button
                onClick={() => setView('products')}
                className="group relative px-6 md:px-12 py-4 md:py-7 overflow-hidden transition-all hover:scale-105 active:scale-95 w-full sm:w-auto rounded-lg md:rounded-none"
              >
                <div className="absolute inset-0 bg-wepp-red transition-all group-hover:bg-red-700"></div>
                <div className="relative flex items-center justify-center gap-3 text-white font-black uppercase tracking-widest text-[11px] md:text-sm">
                  {t('hero.cta_products')}
                  <ChevronRight className="w-4 md:w-5 h-4 md:h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button
                onClick={() => document.getElementById('tecnologia')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-6 md:px-12 py-4 md:py-7 overflow-hidden border border-white/20 backdrop-blur-xl transition-all hover:bg-white/10 w-full sm:w-auto rounded-lg md:rounded-none"
              >
                <div className="relative flex items-center justify-center gap-3 text-white font-black uppercase tracking-widest text-[11px] md:text-sm">
                  <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-wepp-red/20 flex items-center justify-center group-hover:bg-wepp-red/40 transition-colors">
                    <Play className="w-3 h-3 fill-wepp-red text-wepp-red" />
                  </div>
                  {t('hero.cta_tech')}
                </div>
              </button>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ opacity }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer z-30"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-wepp-red to-transparent"></div>
      </motion.div>

      {/* Floating Vertical Label */}
      <div className="absolute right-8 bottom-24 hidden xl:block pointer-events-none overflow-hidden h-[400px]">
        <motion.p
          style={{ y: y1 }}
          className="writing-mode-vertical text-white/5 text-[150px] font-black uppercase tracking-tighter leading-none select-none"
        >
          GERMAN PRECISION
        </motion.p>
      </div>
    </div>
  );
};
