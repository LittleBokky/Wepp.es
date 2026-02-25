import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, Loader2, RotateCcw, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { getProductRecommendation } from '../services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIAdvisor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Bienvenido al Centro de Diagnóstico WEPP! Soy su asesor técnico inteligente. Por favor, describa los síntomas de su vehículo o el mantenimiento que desea realizar.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await getProductRecommendation(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, ha ocurrido un error en la conexión con el servidor de diagnóstico. Por favor, inténtelo de nuevo.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-32 bg-wepp-dark relative overflow-hidden">
      <div className="absolute inset-0 technical-grid opacity-10"></div>
      <div className="absolute -right-1/4 -bottom-1/4 w-1/2 h-1/2 bg-wepp-red/5 blur-[120px] rounded-full"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-wepp-red/20 rounded-lg border border-wepp-red/30">
                <Sparkles className="text-wepp-red w-5 h-5" />
              </div>
              <span className="text-wepp-red font-black uppercase tracking-[0.3em] text-[10px]">Diagnóstico Inteligente DCT</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-[0.9] text-white uppercase tracking-tighter">
              SOPORTE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-wepp-red to-orange-500">EN TIEMPO REAL.</span>
            </h2>
            <p className="text-slate-400 text-lg mb-12 leading-relaxed font-light max-w-xl">
              Nuestra IA ha sido entrenada con décadas de experiencia en ingeniería química alemana para ofrecerle la solución exacta a cualquier problema de rendimiento.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-6 glass-panel rounded-2xl border-white/5">
                <ShieldCheck className="w-8 h-8 text-wepp-red" />
                <div>
                  <p className="font-black text-xs uppercase tracking-widest text-white">Precisión Certificada</p>
                  <p className="text-slate-500 text-xs">Recomendaciones basadas en protocolos oficiales.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-6 glass-panel rounded-2xl border-white/5">
                <RotateCcw className="w-8 h-8 text-wepp-red" />
                <div>
                  <p className="font-black text-xs uppercase tracking-widest text-white">Base de Datos Global</p>
                  <p className="text-slate-500 text-xs">Acceso a miles de casos de éxito en talleres.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[32px] overflow-hidden border-white/10 flex flex-col h-[700px] shadow-2xl relative">
            {/* Chat Header */}
            <div className="p-10 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-wepp-red flex items-center justify-center shadow-xl shadow-wepp-red/20">
                    <Bot className="text-white w-8 h-8" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-wepp-dark rounded-full"></div>
                </div>
                <div>
                  <p className="text-white font-black text-sm uppercase tracking-[0.2em]">WEPP AI ADVISOR</p>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <p className="text-emerald-500 text-[9px] uppercase font-black tracking-[0.2em]">SISTEMA OPERATIVO</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar"
            >
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                        msg.role === 'user' ? 'bg-white/10' : 'bg-wepp-red/20 border border-wepp-red/30'
                      }`}>
                        {msg.role === 'user' ? <User className="text-white w-5 h-5" /> : <Bot className="text-wepp-red w-5 h-5" />}
                      </div>
                      <div className={`p-6 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-wepp-red text-white shadow-xl shadow-wepp-red/20' 
                          : 'bg-white/5 text-slate-300 border border-white/5'
                      }`}>
                        <div className="markdown-body prose prose-invert prose-sm max-w-none font-medium">
                          <Markdown>{msg.content}</Markdown>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <Loader2 className="text-wepp-red w-5 h-5 animate-spin" />
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-slate-500 text-[10px] uppercase tracking-widest font-black">
                      Analizando parámetros técnicos...
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-10 bg-white/5 border-t border-white/5">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Describa el síntoma o mantenimiento..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-8 pr-20 text-white placeholder-slate-600 focus:outline-none focus:border-wepp-red transition-all font-bold text-sm"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-3 top-3 bottom-3 px-6 bg-wepp-red hover:bg-red-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-lg shadow-wepp-red/20"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
