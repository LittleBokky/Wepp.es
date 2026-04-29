import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ShieldCheck, History, Globe, Zap, Heart, Award, Beaker, CheckCircle2, Star, Users } from 'lucide-react';
import { useLanguage } from '../services/LanguageContext';

interface AboutPageProps {
    setView: (view: 'home' | 'products' | 'about' | 'contact') => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setView }) => {
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);

    const timelineData = [
        { year: "1971", title: t('timeline.1971.title'), desc: t('timeline.1971.desc') },
        { year: "1974", title: t('timeline.1974.title'), desc: t('timeline.1974.desc') },
        { year: "1996", title: t('timeline.1996.title'), desc: t('timeline.1996.desc') },
        { year: "1998", title: t('timeline.1998.title'), desc: t('timeline.1998.desc') },
        { year: "1999", title: t('timeline.1999.title'), desc: t('timeline.1999.desc') },
        { year: "2000", title: t('timeline.2000.title'), desc: t('timeline.2000.desc') },
        { year: "2003", title: t('timeline.2003.title'), desc: t('timeline.2003.desc') },
        { year: "2007", title: t('timeline.2007.title'), desc: t('timeline.2007.desc') },
        { year: "2010", title: t('timeline.2010.title'), desc: t('timeline.2010.desc') },
        { year: "2012", title: t('timeline.2012.title'), desc: t('timeline.2012.desc') },
        { year: "2014", title: t('timeline.2014.title'), desc: t('timeline.2014.desc') },
        { year: "2015", title: t('timeline.2015.title'), desc: t('timeline.2015.desc') },
        { year: "2016", title: t('timeline.2016.title'), desc: t('timeline.2016.desc') },
        { year: "2018", title: t('timeline.2018.title'), desc: t('timeline.2018.desc') },
        { year: "2024", title: t('timeline.2024.title'), desc: t('timeline.2024.desc') }
    ];
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.05], [1, 1.1]);

    return (
        <div ref={containerRef} className="bg-white min-h-screen">
            {/* Hero Section - Dark & Impactful */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-wepp-dark text-white">
                <motion.div
                    style={{ opacity, scale }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-wepp-dark/40 via-wepp-dark/60 to-wepp-dark z-10"></div>
                    <img
                        src="https://images.unsplash.com/photo-1504917595217-d4dc5f63a167?auto=format&fit=crop&q=80&w=2000"
                        alt="Ingeniería Alemana"
                        className="w-full h-full object-cover opacity-50 grayscale"
                    />
                </motion.div>

                <div className="relative z-20 text-center max-w-5xl px-4 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-wepp-red/10 border border-wepp-red/20 mb-6 md:mb-8"
                    >
                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-wepp-red italic">{t('about_page.hero_badge')}</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6 md:mb-8"
                    >
                        {t('about_page.hero_title')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-wepp-red to-orange-500 italic pb-2">{t('about_page.hero_title_alt')}</span>
                    </motion.h1>
                    <p className="text-lg md:text-2xl text-slate-400 font-light max-w-3xl mx-auto leading-relaxed">
                        {t('about_page.hero_desc')}
                    </p>
                </div>
            </section>

            {/* Main Mission Section */}
            <section className="py-32 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-24 items-start">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-12"
                        >
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-[2px] w-8 bg-wepp-red"></div>
                                    <span className="text-wepp-red text-[10px] font-black uppercase tracking-[0.3em]">{t('about_page.mission_badge')}</span>
                                </div>
                                <h2 className="text-5xl font-black text-wepp-navy uppercase tracking-tighter leading-none">
                                    {t('about_page.mission_title')} <br /> <span className="text-wepp-red italic">{t('about_page.mission_title_alt')}</span>
                                </h2>
                                <p className="text-slate-600 text-lg leading-relaxed font-medium">
                                    {t('about_page.mission_desc')}
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-8">
                                {[
                                    { icon: Users, title: t('about_page.feature1_title'), desc: t('about_page.feature1_desc') },
                                    { icon: Star, title: t('about_page.feature2_title'), desc: t('about_page.feature2_desc') },
                                    { icon: CheckCircle2, title: t('about_page.feature3_title'), desc: t('about_page.feature3_desc') },
                                    { icon: ShieldCheck, title: t('about_page.feature4_title'), desc: t('about_page.feature4_desc') }
                                ].map((item, idx) => (
                                    <div key={idx} className="space-y-3">
                                        <item.icon className="w-8 h-8 text-wepp-red" />
                                        <h4 className="font-black text-wepp-navy uppercase tracking-tighter text-sm">{item.title}</h4>
                                        <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-wepp-dark rounded-3xl md:rounded-[48px] p-8 md:p-12 text-white relative shadow-2xl overflow-hidden"
                        >
                            <div className="absolute inset-0 technical-grid opacity-10"></div>
                            <div className="relative z-10 space-y-8 md:space-y-10">
                                <div className="flex items-center gap-3">
                                    <Beaker className="text-wepp-red w-5 h-5 md:w-6 md:h-6" />
                                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/60">{t('about_page.goals_badge')}</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic text-wepp-red">{t('about_page.goals_title')}</h3>
                                <ul className="space-y-6 md:space-y-8">
                                    {[
                                        { t: t('about_page.goal1_title'), d: t('about_page.goal1_desc') },
                                        { t: t('about_page.goal2_title'), d: t('about_page.goal2_desc') },
                                        { t: t('about_page.goal3_title'), d: t('about_page.goal3_desc') },
                                        { t: t('about_page.goal4_title'), d: t('about_page.goal4_desc') }
                                    ].map((obj, i) => (
                                        <li key={i} className="flex gap-4 md:gap-6 group">
                                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-wepp-red transition-colors">
                                                <span className="font-black text-wepp-red group-hover:text-white text-[10px] md:text-xs">{i + 1}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-black text-xs md:text-sm uppercase tracking-widest mb-1 group-hover:text-wepp-red transition-colors">{obj.t}</h4>
                                                <p className="text-slate-400 text-[10px] md:text-xs leading-relaxed">{obj.d}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Interactive Timeline */}
            <section className="py-32 bg-wepp-silver relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-24">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <History className="text-wepp-red w-6 h-6" />
                            <span className="text-wepp-navy text-[10px] font-black uppercase tracking-[0.4em]">{t('about_page.history_badge')}</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-wepp-navy uppercase tracking-tighter">{t('about_page.history_title')} <span className="text-wepp-red italic">{t('about_page.history_title_alt')}</span></h2>
                    </div>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-wepp-navy/10 hidden lg:block"></div>

                        <div className="space-y-24 relative">
                            {timelineData.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    className={`flex flex-col lg:flex-row items-center gap-12 ${idx % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}
                                >
                                    <div className={`flex-1 text-center ${idx % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                                        <span className="text-6xl font-black text-wepp-red/10 group-hover:text-wepp-red/20 transition-colors block mb-2">{item.year}</span>
                                        <h4 className="text-2xl font-black text-wepp-navy uppercase tracking-tighter mb-4 italic">{item.title}</h4>
                                        <p className="text-slate-500 text-sm max-w-md mx-auto lg:mx-0 leading-relaxed font-medium">
                                            {item.desc}
                                        </p>
                                    </div>

                                    <div className="relative z-10 flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-wepp-navy flex items-center justify-center border-4 border-white shadow-xl">
                                            <Zap className="w-6 h-6 text-wepp-red" />
                                        </div>
                                    </div>

                                    <div className="flex-1 hidden lg:block"></div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Global & Expertise Section */}
            <section className="py-32 bg-wepp-dark text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
                    <Globe className="w-full h-full text-white rotate-12 -translate-y-1/2" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight mb-12">
                        {t('about_page.presence_title')} <span className="text-wepp-red italic">{t('about_page.presence_title_alt')}</span>
                    </h2>
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { label: t('about_page.stat1_label'), val: "25+", sub: t('about_page.stat1_sub') },
                            { label: t('about_page.stat2_label'), val: "100%", sub: t('about_page.stat2_sub') },
                            { label: t('about_page.stat3_label'), val: "DCT", sub: t('about_page.stat3_sub') }
                        ].map((stat, i) => (
                            <div key={i} className="glass-panel p-10 rounded-3xl border-white/5">
                                <p className="text-5xl font-black italic text-wepp-red mb-2">{stat.val}</p>
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                                <p className="text-white/60 text-[10px] uppercase font-bold">{stat.sub}</p>
                            </div>
                        ))}
                    </div>
                    <p className="mt-20 text-slate-400 max-w-4xl mx-auto text-lg leading-relaxed italic">
                        {t('about_page.final_quote')}
                    </p>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 md:py-32 bg-white text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-4xl md:text-8xl font-black text-wepp-navy uppercase tracking-tighter leading-none mb-10 md:mb-12">
                        {t('about_page.final_title')} <br /> <span className="text-wepp-red italic">{t('about_page.final_title_alt')}</span>
                    </h2>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-8">
                        <button
                            onClick={() => setView('contact')}
                            className="bg-wepp-navy hover:bg-wepp-red text-white px-8 md:px-12 py-5 md:py-6 font-black uppercase tracking-widest text-xs md:text-sm transition-all shadow-xl active:scale-95 w-full sm:w-auto"
                        >
                            {t('about_page.final_cta1')}
                        </button>
                        <button
                            onClick={() => setView('products')}
                            className="border-2 border-wepp-navy text-wepp-navy hover:bg-wepp-navy hover:text-white px-8 md:px-12 py-5 md:py-6 font-black uppercase tracking-widest text-xs md:text-sm transition-all active:scale-95 w-full sm:w-auto"
                        >
                            {t('about_page.final_cta2')}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};
