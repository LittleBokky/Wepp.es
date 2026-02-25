import React, { useState, useEffect } from 'react';
import { Menu, X, Search, Globe, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';

interface NavbarProps {
  setView: (view: 'home' | 'products' | 'about') => void;
  currentView: 'home' | 'products' | 'about';
  onSearch: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setView, currentView, onSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (currentView !== 'home') return;

    const sections = ['hero', 'sobre-nosotros', 'talleres', 'contacto'];
    const observers: IntersectionObserver[] = [];

    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px', // Trigger when section is roughly in the middle
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [currentView]);

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);

    if (currentView !== 'home') {
      setView('home');
      // Wait for view to change before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogoClick = () => {
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getLinkClass = (id: string, isProductLink = false) => {
    const baseClass = "text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative py-2";

    if (isProductLink) {
      return `${baseClass} ${currentView === 'products' ? 'text-wepp-red' : 'text-slate-400 hover:text-white'}`;
    }

    if (id === 'about-page') {
      return `${baseClass} ${currentView === 'about' ? 'text-wepp-red' : 'text-slate-400 hover:text-white'}`;
    }

    const isActive = currentView === 'home' && activeSection === id;
    return `${baseClass} ${isActive ? 'text-wepp-red' : 'text-slate-400 hover:text-white'}`;
  };

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${isScrolled
          ? 'bg-[#0F172A] py-2 shadow-2xl border-white/10'
          : 'bg-[#0F172A]/90 backdrop-blur-md py-4 border-white/5'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-12">
              <Logo className="h-20 md:h-25" onClick={() => scrollToSection('hero')} />
              <div className="hidden lg:flex items-center gap-10">
                <button
                  onClick={() => scrollToSection('hero')}
                  className={getLinkClass('hero')}
                >
                  Inicio
                  {currentView === 'home' && activeSection === 'hero' && (
                    <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-wepp-red" />
                  )}
                </button>
                <button
                  onClick={() => setView('about')}
                  className={getLinkClass('about-page')}
                >
                  Sobre Nosotros
                  {currentView === 'about' && (
                    <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-wepp-red" />
                  )}
                </button>
                <button
                  onClick={() => setView('products')}
                  className={getLinkClass('products', true)}
                >
                  Productos
                  {currentView === 'products' && (
                    <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-wepp-red" />
                  )}
                </button>
                <button
                  onClick={() => scrollToSection('talleres')}
                  className={getLinkClass('talleres')}
                >
                  Talleres
                  {currentView === 'home' && activeSection === 'talleres' && (
                    <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-wepp-red" />
                  )}
                </button>
                <button
                  onClick={() => scrollToSection('contacto')}
                  className={getLinkClass('contacto')}
                >
                  Contacto
                  {currentView === 'home' && activeSection === 'contacto' && (
                    <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-wepp-red" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="hidden md:flex items-center gap-2 text-slate-400">
                <Globe className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">ES</span>
              </div>

              <div className="h-4 w-[1px] bg-white/10 hidden md:block"></div>

              <div className="flex items-center relative gap-4">
                <motion.div
                  initial={false}
                  animate={{ width: isSearchOpen ? '250px' : '0px', opacity: isSearchOpen ? 1 : 0 }}
                  className="overflow-hidden relative flex items-center"
                >
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      onSearch(e.target.value);
                    }}
                    className="bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 w-full focus:outline-none focus:border-wepp-red transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => { setSearchQuery(''); onSearch(''); }}
                      className="absolute right-2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </motion.div>
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className={`${isSearchOpen ? 'text-wepp-red' : 'text-slate-400'} hover:text-white transition-colors`}
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
              <button
                className="lg:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menu"
              >
                {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Moved outside <nav> for absolute stacking */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 z-[60] bg-wepp-dark flex flex-col overflow-hidden"
          >
            {/* Mobile Header - Larger Logo */}
            <div className="bg-wepp-dark border-b border-white/5">
              <div className="h-32 px-6 flex items-center justify-between pt-4">
                <Logo className="h-20" onClick={() => { setView('home'); setIsMenuOpen(false); }} />
                <button
                  className="p-3 text-white hover:text-wepp-red transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="w-8 h-8" />
                </button>
              </div>
            </div>

            {/* Mobile Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 flex flex-col">
              {/* Mobile Search */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <div className="relative flex items-center group">
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      onSearch(e.target.value);
                    }}
                    className="bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-[0.2em] px-5 py-4 w-full focus:outline-none focus:border-wepp-red transition-all"
                  />
                  <Search className={`absolute right-5 w-4 h-4 transition-colors ${searchQuery ? 'text-wepp-red' : 'text-slate-500'}`} />
                </div>
              </motion.div>

              {/* Nav Links */}
              <nav className="space-y-2">
                {[
                  { label: 'Inicio', action: () => scrollToSection('hero'), id: 'hero' },
                  { label: 'Sobre Nosotros', action: () => setView('about'), id: 'about' },
                  { label: 'Productos', action: () => setView('products'), id: 'products' },
                  { label: 'Talleres', action: () => scrollToSection('talleres'), id: 'talleres' },
                  { label: 'Contacto', action: () => scrollToSection('contacto'), id: 'contacto' }
                ].map((link, idx) => (
                  <motion.button
                    key={link.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (idx * 0.05) }}
                    onClick={() => {
                      link.action();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left py-3 flex items-center justify-between group active:scale-[0.98] transition-transform"
                  >
                    <span className={`text-3xl font-black uppercase tracking-tighter ${(currentView === link.id || (currentView === 'home' && activeSection === link.id))
                      ? 'text-wepp-red'
                      : 'text-white'
                      }`}>
                      {link.label}
                    </span>
                    <ArrowUpRight className="w-5 h-5 text-wepp-red opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                  </motion.button>
                ))}
              </nav>

              {/* Bottom Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-6"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 text-slate-400">
                    <Globe className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">España / ES</span>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-wepp-red transition-colors">
                      <span className="text-[8px] font-black">IG</span>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-wepp-red transition-colors">
                      <span className="text-[8px] font-black">LI</span>
                    </div>
                  </div>
                </div>
                <div className="text-[7px] font-black text-slate-600 uppercase tracking-[0.4em]">
                  WEPP GERMANY © 2026. ALL RIGHTS RESERVED.
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
