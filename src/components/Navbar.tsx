import React, { useState, useEffect } from 'react';
import { Menu, Search, Globe, X } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  setView: (view: 'home' | 'products') => void;
  currentView: 'home' | 'products';
}

export const Navbar: React.FC<NavbarProps> = ({ setView, currentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

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

    const isActive = currentView === 'home' && activeSection === id;
    return `${baseClass} ${isActive ? 'text-wepp-red' : 'text-slate-400 hover:text-white'}`;
  };

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-500 ${isScrolled ? 'bg-wepp-dark/95 backdrop-blur-xl h-20' : 'bg-wepp-dark/80 backdrop-blur-md h-24'} border-b border-white/5`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between h-full items-center">
          <div className="flex items-center gap-12">
            <div 
              className="relative group cursor-pointer transition-transform hover:scale-105"
              onClick={handleLogoClick}
            >
              {/* Outer Blue Border */}
              <div className="border-[1px] border-[#1B365D] p-[1px] skew-x-[-12deg]">
                {/* Silver/Metallic Gradient Border */}
                <div className="bg-gradient-to-b from-slate-100 via-slate-400 to-slate-600 p-[2px]">
                  {/* Red Background */}
                  <div className="bg-[#D62828] px-6 py-1.5 relative overflow-hidden">
                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
                    
                    {/* WEPP Text */}
                    <span className="text-white font-black italic text-3xl tracking-tighter block skew-x-[12deg] drop-shadow-[0_2px_0_#1B365D]">
                      WEPP
                    </span>
                    
                    {/* Registered Symbol */}
                    <div className="absolute top-1 right-1 w-3 h-3 border border-white rounded-full flex items-center justify-center skew-x-[12deg]">
                      <span className="text-[6px] font-bold text-white">R</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center space-x-8">
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
                onClick={() => scrollToSection('sobre-nosotros')}
                className={getLinkClass('sobre-nosotros')}
              >
                Sobre Nosotros
                {currentView === 'home' && activeSection === 'sobre-nosotros' && (
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

            <button className="text-slate-400 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button 
              className="lg:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 top-[inherit] bg-wepp-dark/95 backdrop-blur-2xl transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col items-center justify-center h-full space-y-12 p-8">
          <button 
            onClick={() => scrollToSection('hero')}
            className="text-2xl font-black uppercase tracking-[0.3em] text-white hover:text-wepp-red transition-colors"
          >
            Inicio
          </button>
          <button 
            onClick={() => scrollToSection('sobre-nosotros')}
            className="text-2xl font-black uppercase tracking-[0.3em] text-white hover:text-wepp-red transition-colors"
          >
            Sobre Nosotros
          </button>
          <button 
            onClick={() => { setView('products'); setIsMenuOpen(false); }}
            className="text-2xl font-black uppercase tracking-[0.3em] text-white hover:text-wepp-red transition-colors"
          >
            Productos
          </button>
          <button 
            onClick={() => scrollToSection('talleres')}
            className="text-2xl font-black uppercase tracking-[0.3em] text-white hover:text-wepp-red transition-colors"
          >
            Talleres
          </button>
          <button 
            onClick={() => scrollToSection('contacto')}
            className="text-2xl font-black uppercase tracking-[0.3em] text-white hover:text-wepp-red transition-colors"
          >
            Contacto
          </button>
          
          <div className="pt-12 border-t border-white/10 w-full flex justify-center gap-8">
            <div className="flex items-center gap-2 text-slate-400">
              <Globe className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">ES</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
