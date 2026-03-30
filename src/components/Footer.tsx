import React from 'react';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, ArrowUpRight, ShieldCheck } from 'lucide-react';

import { Logo } from './Logo';
import { useLanguage } from '../services/LanguageContext';

interface FooterProps {
  setView: (view: 'home' | 'products' | 'about' | 'contact' | 'admin') => void;
}


export const Footer: React.FC<FooterProps> = ({ setView }) => {
  const { t } = useLanguage();
  return (
    <footer className="bg-wepp-dark text-white pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-wepp-red/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">

          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col justify-between items-center md:items-start text-center md:text-left">
            <div>
              <Logo className="h-10 mb-8 inline-block" onClick={() => { setView('home'); window.scrollTo(0, 0); }} />
              <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium max-w-xs mx-auto md:mx-0">
                {t('footer.brand_desc')}
              </p>
            </div>
            <div className="flex gap-4 justify-center md:justify-start">
              {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-wepp-red rounded-xl transition-all group">
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2 text-center md:text-left">
            <h4 className="text-wepp-red text-[10px] font-black uppercase tracking-[0.3em] mb-8">{t('nav.products')}</h4>
            <ul className="space-y-4 flex flex-col items-center md:items-start">
              {['Catálogo', 'Inyección', 'Gasolina', 'Lubricación'].map((item) => (
                <li key={item}>
                  <button onClick={() => setView('products')} className="text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2 group">
                    {item} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 text-center md:text-left">
            <h4 className="text-wepp-red text-[10px] font-black uppercase tracking-[0.3em] mb-8">{t('nav.about')}</h4>
            <ul className="space-y-4 flex flex-col items-center md:items-start">
              {['Historia', 'Talleres', 'Filosofía', 'Garantía'].map((item) => (
                <li key={item}>
                  <button onClick={() => setView('about')} className="text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Provider Column - Compact & Elegant */}
          <div className="lg:col-span-4">
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-sm relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-wepp-red/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-wepp-red/20 transition-colors"></div>

              <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left gap-6">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-wepp-red animate-pulse"></div>
                    <span className="text-wepp-red text-[9px] font-black uppercase tracking-[0.4em]">{t('footer.official_provider')}</span>
                  </div>
                  <h5 className="text-xl font-black text-white uppercase tracking-tight mb-2">Michael Leffler</h5>
                </div>

                <div className="space-y-3 pt-6 border-t border-white/5 w-full flex flex-col items-center md:items-start">
                  <a href="tel:+34640074441" className="flex items-center gap-3 group/link">
                    <div className="w-8 h-8 rounded-lg bg-wepp-red/10 flex items-center justify-center group-hover/link:bg-wepp-red transition-colors">
                      <Phone className="w-3.5 h-3.5 text-wepp-red group-hover/link:text-white" />
                    </div>
                    <span className="text-xs font-black tracking-widest text-slate-300 group-hover/link:text-white transition-colors">+34 640 074 441</span>
                  </a>
                  <a href="mailto:tecnico@wepp.es" className="flex items-center gap-3 group/link">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover/link:bg-wepp-red transition-colors">
                      <Mail className="w-3.5 h-3.5 text-wepp-red group-hover/link:text-white" />
                    </div>
                    <span className="text-xs font-black tracking-widest text-slate-300 group-hover/link:text-white transition-colors">TECNICO@WEPP.ES</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.4em]">
            © {new Date().getFullYear()} WEPP ESPAÑA · GERMAN TECHNOLOGY
          </p>
          <div className="flex gap-10">
            {[
              { label: t('footer.legal'), href: '#' },
              { label: t('footer.privacy'), href: '#' },
              { label: t('footer.cookies'), href: '#' }
            ].map(link => (
              <a key={link.label} href={link.href} className="text-slate-600 hover:text-white transition-colors text-[9px] font-black uppercase tracking-[0.4em]">
                {link.label}
              </a>
            ))}
            <button 
              onClick={() => { setView('admin'); window.scrollTo(0, 0); }}
              className="text-wepp-red/40 hover:text-wepp-red transition-all text-[9px] font-black uppercase tracking-[0.4em] flex items-center gap-2"
            >
              <ShieldCheck className="w-3 h-3" /> Acceso Admin
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
