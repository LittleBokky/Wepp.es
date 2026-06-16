import React, { useState } from 'react';
import { X, LogIn, ShieldCheck, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { loginAdmin, loginVendor, loginWorkshop } from '../services/authService';
import { UserSession } from '../types';
import { Wrench } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
  onSuccess: (session: UserSession) => void;
  adminOnly?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSuccess, adminOnly = false }) => {
  const [tab, setTab] = useState<'admin' | 'vendor' | 'workshop'>(adminOnly ? 'admin' : 'workshop');
  const [showAdminTab, setShowAdminTab] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'admin') {
        const result = await loginAdmin(email, password);
        if (result) {
          onSuccess({ type: 'admin', email: result.email });
        } else {
          setError('Credenciales incorrectas');
        }
      } else if (tab === 'vendor') {
        const result = await loginVendor(username, password);
        if (result) {
          onSuccess({ type: 'vendor', credential: result });
        } else {
          setError('Usuario o contraseña incorrectos');
        }
      } else {
        const result = await loginWorkshop(username, password);
        if (result) {
          onSuccess({ type: 'workshop', workshopCredential: result });
        } else {
          setError('Credenciales de taller incorrectas');
        }
      }
    } catch {
      setError('Error al iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.25 }}
          className="bg-white text-slate-900 w-full max-w-md relative overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="bg-wepp-navy p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-wepp-red/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-wepp-red animate-pulse"></div>
                  <span className="text-wepp-red text-[9px] font-black uppercase tracking-[0.4em]">
                    Portal de Acceso
                  </span>
                </div>
                <h2 
                  onClick={() => {
                    const newCount = clickCount + 1;
                    setClickCount(newCount);
                    if (newCount >= 5) setShowAdminTab(true);
                  }}
                  className="text-2xl font-black text-white uppercase tracking-tighter cursor-default select-none"
                >
                  WEPP GLOBAL
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          {!adminOnly && (
            <div className="flex border-b border-slate-100">
              {showAdminTab && (
                <button
                  onClick={() => { setTab('admin'); setError(''); }}
                  className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                    tab === 'admin'
                      ? 'text-wepp-navy border-b-2 border-wepp-red'
                      : 'text-slate-400 hover:text-wepp-navy'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" /> Administrador
                </button>
              )}
              <button
                onClick={() => { setTab('vendor'); setError(''); }}
                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  tab === 'vendor'
                    ? 'text-wepp-navy border-b-2 border-wepp-red'
                    : 'text-slate-400 hover:text-wepp-navy'
                }`}
              >
                <User className="w-4 h-4" /> Comercial
              </button>
              <button
                onClick={() => { setTab('workshop'); setError(''); }}
                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  tab === 'workshop'
                    ? 'text-wepp-navy border-b-2 border-wepp-red'
                    : 'text-slate-400 hover:text-wepp-navy'
                }`}
              >
                <Wrench className="w-4 h-4" /> Taller
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <AnimatePresence mode="wait">
              {tab === 'admin' ? (
                <motion.div
                  key="admin-field"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.15 }}
                >
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="admin@ejemplo.com"
                    className="w-full border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-wepp-navy transition-colors font-medium"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="user-field"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-2">
                    {tab === 'vendor' ? 'Nombre de Usuario' : 'Usuario Taller'}
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    placeholder={tab === 'vendor' ? 'tu_usuario' : 'usuario_taller'}
                    autoComplete="username"
                    className="w-full border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-wepp-navy transition-colors font-medium"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-wepp-navy transition-colors font-medium"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-wepp-red font-black"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-wepp-navy hover:bg-wepp-red text-white py-4 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verificando...
                </span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> Acceder al Portal
                </>
              )}
            </button>
          </form>

          {!adminOnly && (
            <div className="px-8 pb-8 text-center -mt-2">
              <p className="text-[10px] text-slate-400 font-medium">
                ¿Eres taller y quieres acceso?{' '}
                <a
                  href="mailto:tecnico@wepp.es"
                  className="text-wepp-red font-black hover:underline"
                >
                  Contáctanos
                </a>
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
