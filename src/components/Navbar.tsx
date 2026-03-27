import React, { useState, useEffect } from 'react';
import { Menu, X, Search, Globe, ArrowUpRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { useLanguage, Language } from '../services/LanguageContext';

interface NavbarProps {
  setView: (view: 'home' | 'products' | 'about' | 'contact') => void;
  currentView: 'home' | 'products' | 'about' | 'contact';
  onSearch: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setView, currentView, onSearch }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
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

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

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

    if (sectionId === 'contacto') {
      setView('contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

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

    if (id === 'contacto') {
      return `${baseClass} ${currentView === 'contact' ? 'text-wepp-red' : 'text-slate-400 hover:text-white'}`;
    }

    const isActive = currentView === 'home' && activeSection === id;
    return `${baseClass} ${isActive ? 'text-wepp-red' : 'text-slate-400 hover:text-white'}`;
  };

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${isScrolled
        ? 'bg-wepp-dark py-2 shadow-2xl border-white/10'
        : 'bg-wepp-dark/95 backdrop-blur-md py-4 border-white/5'
        } ${isMenuOpen ? 'invisible opacity-0 pointer-events-none' : 'visible opacity-100 pointer-events-auto'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-12">
              <Logo className="h-12 md:h-16" onClick={() => scrollToSection('hero')} />
              <div className="hidden lg:flex items-center gap-10">
                <button
                  onClick={() => scrollToSection('hero')}
                  className={getLinkClass('hero')}
                >
                  {t('nav.home')}
                  {currentView === 'home' && activeSection === 'hero' && (
                    <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-wepp-red" />
                  )}
                </button>
                <button
                  onClick={() => setView('about')}
                  className={getLinkClass('about-page')}
                >
                  {t('nav.about')}
                  {currentView === 'about' && (
                    <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-wepp-red" />
                  )}
                </button>
                <button
                  onClick={() => setView('products')}
                  className={getLinkClass('products', true)}
                >
                  {t('nav.products')}
                  {currentView === 'products' && (
                    <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-wepp-red" />
                  )}
                </button>
                <button
                  onClick={() => scrollToSection('talleres')}
                  className={getLinkClass('talleres')}
                >
                  {t('workshop.badge')}
                  {currentView === 'home' && activeSection === 'talleres' && (
                    <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-wepp-red" />
                  )}
                </button>
                <button
                  onClick={() => scrollToSection('contacto')}
                  className={getLinkClass('contacto')}
                >
                  {t('nav.contact')}
                  {currentView === 'home' && activeSection === 'contacto' && (
                    <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-wepp-red" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-8">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="hidden md:flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{language}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-4 bg-wepp-navy border border-white/10 p-2 shadow-2xl min-w-[120px]"
                    >
                      {(['es', 'en', 'de'] as Language[]).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            setLanguage(lang);
                            setIsLangOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-colors ${language === lang ? 'text-wepp-red' : 'text-slate-400'
                            }`}
                        >
                          {lang === 'es' ? 'Español' : lang === 'en' ? 'English' : 'Deutsch'}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
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
            <div className="bg-transparent border-b border-white/5">
              <div className="h-20 sm:h-24 px-6 flex items-center justify-between">
                <Logo className="h-10 sm:h-12" onClick={() => { setView('home'); setIsMenuOpen(false); }} />
                <button
                  className="p-3 text-white hover:text-wepp-red transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="w-8 h-8" />
                </button>
              </div>
            </div>

            {/* Mobile Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-8 flex flex-col">
              {/* Mobile Search */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-10"
              >
                <div className="relative flex items-center group">
                  <input
                    type="text"
                    placeholder={t('nav.search')}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      onSearch(e.target.value);
                    }}
                    className="bg-white/5 rounded-xl border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.2em] px-5 py-4 w-full focus:outline-none focus:border-wepp-red transition-all"
                  />
                  <Search className={`absolute right-5 w-4 h-4 transition-colors ${searchQuery ? 'text-wepp-red' : 'text-slate-500'}`} />
                </div>
              </motion.div>

              {/* Nav Links */}
              <nav className="space-y-4">
                {[
                  { label: t('nav.home'), action: () => scrollToSection('hero'), id: 'hero' },
                  { label: t('nav.about'), action: () => setView('about'), id: 'about' },
                  { label: t('nav.products'), action: () => setView('products'), id: 'products' },
                  { label: t('workshop.badge'), action: () => scrollToSection('talleres'), id: 'talleres' },
                  { label: t('nav.contact'), action: () => scrollToSection('contacto'), id: 'contacto' }
                ].map((link, idx) => (
                  <motion.button
                    key={link.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + (idx * 0.08), type: "spring", stiffness: 100 }}
                    onClick={() => {
                      link.action();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left py-2 flex items-center justify-between group active:scale-[0.98] transition-all border-b border-white/5 pb-4"
                  >
                    <span className={`text-2xl sm:text-3xl font-black uppercase tracking-widest transition-colors ${(currentView === link.id || (currentView === 'home' && activeSection === link.id))
                      ? 'text-wepp-red'
                      : 'text-white/80 group-hover:text-white'
                      }`}>
                      {link.label}
                    </span>
                    <ArrowUpRight className={`w-5 h-5 transition-all ${(currentView === link.id || (currentView === 'home' && activeSection === link.id))
                      ? 'text-wepp-red opacity-100'
                      : 'text-wepp-red opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0'
                      }`} />
                  </motion.button>
                ))}
              </nav>

              {/* Bottom Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-auto pt-10 flex flex-col gap-6"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 text-slate-400 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                    <Globe className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                      {language === 'es' ? 'ESP' : language === 'en' ? 'ENG' : 'DEU'}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:border-wepp-red hover:bg-wepp-red/10 transition-colors cursor-pointer">
                      <span className="text-[9px] font-black">IG</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:border-wepp-red hover:bg-wepp-red/10 transition-colors cursor-pointer">
                      <span className="text-[9px] font-black">LI</span>
                    </div>
                  </div>
                </div>
                <div className="text-center text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">
                  WEPP GERMANY © {(new Date()).getFullYear()}.
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
