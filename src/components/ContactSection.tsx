import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, User, Mail, MessageSquare, ChevronDown, Phone } from 'lucide-react';
import { Logo } from './Logo';
import { useLanguage } from '../services/LanguageContext';

export const ContactSection: React.FC = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        salutation: 'mr',
        name: '',
        email: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSent(true);
            setFormData({ salutation: 'mr', name: '', email: '', message: '' });
            setTimeout(() => setIsSent(false), 5000);
        }, 1500);
    };

    return (
        <section id="contacto" className="py-32 md:py-48 bg-white overflow-hidden relative min-h-screen flex items-center">
            {/* Meta tags for SEO */}
            <title>Contacto | WEPP España - Ingeniería Química Automotriz</title>
            <meta name="description" content="Contacte con la delegación oficial de WEPP en España. Soporte técnico para talleres profesionales y consultas sobre productos DCT." />

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full technical-grid opacity-[0.03] pointer-events-none"></div>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-wepp-red/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-12 gap-20 items-start">

                    {/* Left Column: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-5"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-[1px] w-12 bg-wepp-red"></div>
                            <span className="text-wepp-red text-[10px] font-black uppercase tracking-[0.4em]">{t('contact.badge')}</span>
                        </div>

                        <h2 className="text-5xl md:text-7xl font-black text-wepp-navy uppercase tracking-tighter leading-[0.9] mb-10">
                            {t('contact.title')} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-wepp-red to-orange-500 italic font-serif normal-case tracking-normal">{t('contact.title_alt')}</span>
                        </h2>

                        <p className="text-xl text-slate-500 leading-relaxed mb-12 font-light">
                            {t('contact.desc')}
                        </p>

                        <div className="grid gap-6">
                            {/* Official Provider Badge In-Section */}
                            <div className="bg-slate-900 p-8 rounded-3xl border border-white/5 relative overflow-hidden group mb-4">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-wepp-red/10 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-wepp-red/20 transition-colors"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-wepp-red animate-pulse"></div>
                                        <span className="text-wepp-red text-[8px] font-black uppercase tracking-[0.4em]">{t('footer.official_provider')}</span>
                                    </div>
                                    <h4 className="text-white font-black text-xl uppercase tracking-tighter mb-4">Michael Leffler</h4>

                                    <div className="space-y-4">
                                        <a href="mailto:tecnico@wepp.es" className="flex items-center gap-4 group/link">
                                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover/link:bg-wepp-red transition-all">
                                                <Mail className="w-4 h-4 text-wepp-red group-hover/link:text-white" />
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 mb-0.5">{t('contact.email_label')}</p>
                                                <p className="text-white font-bold text-sm tracking-tight transition-colors group-hover/link:text-wepp-red">tecnico@wepp.es</p>
                                            </div>
                                        </a>

                                        <a href="tel:+34640074441" className="flex items-center gap-4 group/link">
                                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover/link:bg-wepp-red transition-all">
                                                <Phone className="w-4 h-4 text-wepp-red group-hover/link:text-white" />
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 mb-0.5">{t('contact.phone_label')}</p>
                                                <p className="text-white font-bold text-sm tracking-tight transition-colors group-hover/link:text-wepp-red">+34 640 074 441</p>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-12 border-t border-slate-100">
                            <Logo className="h-12 opacity-40 grayscale" />
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mt-4 text-center lg:text-left">
                                {t('contact.footer_note')}
                            </p>
                        </div>
                    </motion.div>

                    {/* Right Column: Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:col-span-7"
                    >
                        <div className="bg-white p-8 md:p-16 rounded-[48px] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                            <div className="mb-10 text-center">
                                <h3 className="text-2xl font-black text-wepp-navy uppercase tracking-tighter mb-2">{t('contact.form_title')}</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('contact.form_required')}</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-wepp-navy uppercase tracking-widest ml-1">{t('contact.label_salutation')}</label>
                                        <div className="relative">
                                            <select
                                                value={formData.salutation}
                                                onChange={(e) => setFormData({ ...formData, salutation: e.target.value })}
                                                className="w-full bg-white border-b-2 border-slate-200 px-4 py-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-wepp-red transition-colors appearance-none cursor-pointer"
                                                required
                                            >
                                                <option value="mr">{t('contact.salutation_mr')}</option>
                                                <option value="ms">{t('contact.salutation_ms')}</option>
                                                <option value="company">{t('contact.salutation_company')}</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[9px] font-black text-wepp-navy uppercase tracking-widest ml-1">{t('contact.label_name')}</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder={t('contact.placeholder_name')}
                                                className="w-full bg-white border-b-2 border-slate-200 px-4 py-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-wepp-red transition-colors placeholder:text-slate-300"
                                                required
                                            />
                                            <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-200" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-wepp-navy uppercase tracking-widest ml-1">{t('contact.label_email')}</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder={t('contact.placeholder_email')}
                                            className="w-full bg-white border-b-2 border-slate-200 px-4 py-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-wepp-red transition-colors placeholder:text-slate-300"
                                            required
                                        />
                                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-200" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-wepp-navy uppercase tracking-widest ml-1">{t('contact.label_message')}</label>
                                    <div className="relative">
                                        <textarea
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder={t('contact.placeholder_message')}
                                            rows={4}
                                            className="w-full bg-white border-b-2 border-slate-200 px-4 py-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-wepp-red transition-colors placeholder:text-slate-300 resize-none"
                                            required
                                        ></textarea>
                                        <MessageSquare className="absolute right-4 top-8 w-4 h-4 text-slate-200" />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || isSent}
                                    className={`w-full py-6 flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-xs transition-all ${isSent
                                        ? 'bg-green-600 text-white'
                                        : 'bg-wepp-navy text-white hover:bg-wepp-red'
                                        } relative overflow-hidden group`}
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : isSent ? (
                                        <>{t('contact.sent')}</>
                                    ) : (
                                        <>
                                            {t('contact.submit')}
                                            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                                    {t('contact.privacy')}
                                </p>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
