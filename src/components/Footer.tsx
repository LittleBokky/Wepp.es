import React from 'react';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  setView: (view: 'home' | 'products' | 'about') => void;
}

export const Footer: React.FC<FooterProps> = ({ setView }) => {
  return (
    <footer id="contacto" className="bg-wepp-dark text-white pt-32 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="lg:col-span-1">
            <Logo className="h-20 mb-10 inline-block" onClick={() => { setView('home'); window.scrollTo(0, 0); }} />
            <p className="text-slate-400 text-sm leading-relaxed mb-10 font-medium max-w-xs">
              Líderes mundiales en tecnología química para automoción. Ingeniería alemana aplicada al mantenimiento profesional.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-4 bg-white/5 hover:bg-wepp-red rounded-2xl transition-all group"><Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" /></a>
              <a href="#" className="p-4 bg-white/5 hover:bg-wepp-red rounded-2xl transition-all group"><Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" /></a>
              <a href="#" className="p-4 bg-white/5 hover:bg-wepp-red rounded-2xl transition-all group"><Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-black mb-10 uppercase tracking-[0.3em] text-[10px] text-wepp-red">Sistemas DCT</h4>
            <ul className="space-y-5 text-slate-400 text-xs font-black uppercase tracking-widest">
              <li><button onClick={() => setView('products')} className="hover:text-white transition-colors flex items-center gap-2 group text-left">Catálogo Completo <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /></button></li>
              <li><button onClick={() => setView('products')} className="hover:text-white transition-colors flex items-center gap-2 group text-left">Inyección Diésel <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /></button></li>
              <li><button onClick={() => setView('products')} className="hover:text-white transition-colors flex items-center gap-2 group text-left">Sistemas Gasolina <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /></button></li>
              <li><button onClick={() => setView('products')} className="hover:text-white transition-colors flex items-center gap-2 group text-left">Lubricación Motor <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /></button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black mb-10 uppercase tracking-[0.3em] text-[10px] text-wepp-red">Corporativo</h4>
            <ul className="space-y-5 text-slate-400 text-xs font-black uppercase tracking-widest">
              <li><button onClick={() => setView('about')} className="hover:text-white transition-colors">Nuestra Historia</button></li>
              <li><button onClick={() => { setView('home'); setTimeout(() => document.getElementById('talleres')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-white transition-colors">Red de Talleres</button></li>
              <li><button onClick={() => setView('about')} className="hover:text-white transition-colors">Filosofía WEPP</button></li>
              <li><button onClick={() => setView('about')} className="hover:text-white transition-colors">Garantía Alemana</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black mb-10 uppercase tracking-[0.3em] text-[10px] text-wepp-red">Contacto Directo</h4>
            <ul className="space-y-8 text-slate-400 text-sm font-bold">
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-wepp-red flex-shrink-0" />
                <span className="leading-tight text-xs uppercase tracking-widest">Sede Central España <br />Madrid, 28001</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-wepp-red flex-shrink-0" />
                <span className="text-xs uppercase tracking-widest">+34 912 345 678</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-wepp-red flex-shrink-0" />
                <span className="text-xs uppercase tracking-widest">tecnico@wepp.es</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">
          <p>© 2024 WEPP ESPAÑA - GERMAN PRECISION TECHNOLOGY</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-white transition-colors">Aviso Legal</a>
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
