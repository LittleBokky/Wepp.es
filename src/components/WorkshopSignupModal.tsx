import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Wrench, CheckCircle, Building2, MapPin, User, Phone, Mail, FileText, ShieldCheck, Truck, ArrowRight, ArrowLeft } from 'lucide-react';
import { addTaller } from '../services/adminService';
import { Taller } from '../types';

interface WorkshopSignupModalProps {
  onClose: () => void;
}

export const WorkshopSignupModal: React.FC<WorkshopSignupModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sameAddress, setSameAddress] = useState(true);
  const [sameContact, setSameContact] = useState(true);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [form, setForm] = useState({
    name: '',
    cif: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    shippingAddress: '',
    orderContactName: '',
    orderContactPhone: '',
    orderContactEmail: '',
    notes: '',
  });

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const totalSteps = 3;

  const validateStep = (s: number): boolean => {
    setError('');
    if (s === 1) {
      if (!form.name.trim()) { setError('El nombre del taller es obligatorio'); return false; }
      if (!form.cif.trim()) { setError('El CIF/NIF es obligatorio'); return false; }
      if (!form.email.trim()) { setError('El email es obligatorio'); return false; }
      if (!form.phone.trim()) { setError('El teléfono es obligatorio'); return false; }
    }
    if (s === 2) {
      if (!form.city.trim()) { setError('La ciudad es obligatoria'); return false; }
      if (!form.address.trim()) { setError('La dirección es obligatoria'); return false; }
      if (!sameAddress && !form.shippingAddress.trim()) { setError('La dirección de envío es obligatoria'); return false; }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep(s => Math.min(s + 1, totalSteps));
  };

  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!gdprAccepted) {
      setError('Debes aceptar la política de protección de datos');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await addTaller({
        name: form.name,
        cif: form.cif,
        email: form.email,
        phone: form.phone,
        city: form.city,
        address: form.address,
        shippingAddress: sameAddress ? form.address : form.shippingAddress,
        orderContactName: sameContact ? '' : form.orderContactName,
        orderContactPhone: sameContact ? '' : form.orderContactPhone,
        orderContactEmail: sameContact ? '' : form.orderContactEmail,
        notes: form.notes,
        gdprAccepted: true,
        gdprAcceptedAt: new Date().toISOString(),
        status: 'Pendiente' as Taller['status'],
      });
      setIsSuccess(true);
    } catch (err) {
      setError('Error al enviar la solicitud. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full bg-white border border-slate-200 px-4 py-3.5 text-sm font-medium text-wepp-navy outline-none focus:border-wepp-red focus:ring-1 focus:ring-wepp-red/20 transition-all placeholder:text-slate-300";
  const labelClass = "text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-wepp-navy/90 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="bg-white w-full max-w-2xl relative overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-wepp-navy p-6 sm:p-8 relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 technical-grid opacity-10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-wepp-red rounded-xl flex items-center justify-center shadow-lg shadow-wepp-red/30">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter">
                  {isSuccess ? 'Solicitud Enviada' : 'Alta de Taller'}
                </h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                  {isSuccess ? 'Te contactaremos pronto' : `Paso ${step} de ${totalSteps}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress bar */}
          {!isSuccess && (
            <div className="relative z-10 mt-6 flex gap-2">
              {[1, 2, 3].map(s => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                    s <= step ? 'bg-wepp-red' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 sm:p-12 text-center"
              >
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black text-wepp-navy uppercase tracking-tighter mb-4">
                  ¡Solicitud Recibida!
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto mb-4">
                  Hemos recibido tu solicitud de alta correctamente. Nuestro equipo la revisará y te asignará un <strong className="text-wepp-navy">número de cliente</strong> y un <strong className="text-wepp-navy">comercial</strong> a la mayor brevedad.
                </p>
                <p className="text-slate-400 text-xs mb-8">
                  Recibirás un email de confirmación en <strong>{form.email}</strong> una vez aprobada tu solicitud.
                </p>
                <button
                  onClick={onClose}
                  className="bg-wepp-navy text-white px-10 py-4 font-black uppercase tracking-widest text-[10px] hover:bg-wepp-red transition-all shadow-xl active:scale-95"
                >
                  Entendido
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="p-6 sm:p-8"
              >
                {/* Step 1: Datos del Taller */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Building2 className="w-5 h-5 text-wepp-red" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-wepp-navy">Datos del Taller</h3>
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>Nombre del Taller *</label>
                      <input
                        value={form.name}
                        onChange={e => updateField('name', e.target.value)}
                        placeholder="Ej: Taller AutoService Madrid"
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>CIF / NIF *</label>
                      <input
                        value={form.cif}
                        onChange={e => updateField('cif', e.target.value.toUpperCase())}
                        placeholder="Ej: B12345678"
                        className={inputClass}
                        maxLength={10}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className={labelClass}>Email *</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => updateField('email', e.target.value)}
                          placeholder="taller@ejemplo.com"
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Teléfono *</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={e => updateField('phone', e.target.value)}
                          placeholder="+34 600 000 000"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Direcciones */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <MapPin className="w-5 h-5 text-wepp-red" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-wepp-navy">Direcciones</h3>
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>Ciudad *</label>
                      <input
                        value={form.city}
                        onChange={e => updateField('city', e.target.value)}
                        placeholder="Ej: Madrid"
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>Dirección Fiscal *</label>
                      <input
                        value={form.address}
                        onChange={e => updateField('address', e.target.value)}
                        placeholder="Calle, número, CP..."
                        className={inputClass}
                      />
                    </div>

                    <div className="bg-slate-50 p-4 border border-slate-100 relative">
                      <label className="flex items-center gap-3 cursor-pointer group" onClick={() => setSameAddress(!sameAddress)}>
                        <div className={`w-5 h-5 border-2 flex items-center justify-center transition-all flex-shrink-0 ${sameAddress ? 'bg-wepp-red border-wepp-red' : 'border-slate-300 group-hover:border-wepp-red'}`}>
                          {sameAddress && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-xs font-bold text-wepp-navy">La dirección de envío es la misma que la fiscal</span>
                      </label>
                    </div>

                    <AnimatePresence>
                      {!sameAddress && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-1">
                            <label className={labelClass}>
                              <Truck className="w-3 h-3 inline mr-1.5 text-wepp-red" />
                              Dirección de Envío *
                            </label>
                            <input
                              value={form.shippingAddress}
                              onChange={e => updateField('shippingAddress', e.target.value)}
                              placeholder="Dirección donde recibir los pedidos..."
                              className={inputClass}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Contact person for orders */}
                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-3 mb-4">
                        <User className="w-4 h-4 text-wepp-red" />
                        <h4 className="text-xs font-black uppercase tracking-widest text-wepp-navy">Persona de contacto para pedidos</h4>
                      </div>

                      <div className="bg-slate-50 p-4 border border-slate-100 mb-4 relative">
                        <label className="flex items-center gap-3 cursor-pointer group" onClick={() => setSameContact(!sameContact)}>
                          <div className={`w-5 h-5 border-2 flex items-center justify-center transition-all flex-shrink-0 ${sameContact ? 'bg-wepp-red border-wepp-red' : 'border-slate-300 group-hover:border-wepp-red'}`}>
                            {sameContact && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="text-xs font-bold text-wepp-navy">Es la misma persona / datos del taller</span>
                        </label>
                      </div>

                      <AnimatePresence>
                        {!sameContact && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden space-y-4"
                          >
                            <div className="space-y-1">
                              <label className={labelClass}>Nombre del Responsable de Pedidos</label>
                              <input
                                value={form.orderContactName}
                                onChange={e => updateField('orderContactName', e.target.value)}
                                placeholder="Nombre y apellidos"
                                className={inputClass}
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className={labelClass}>Teléfono de contacto</label>
                                <input
                                  type="tel"
                                  value={form.orderContactPhone}
                                  onChange={e => updateField('orderContactPhone', e.target.value)}
                                  placeholder="+34 600 000 000"
                                  className={inputClass}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className={labelClass}>Email de contacto</label>
                                <input
                                  type="email"
                                  value={form.orderContactEmail}
                                  onChange={e => updateField('orderContactEmail', e.target.value)}
                                  placeholder="pedidos@taller.com"
                                  className={inputClass}
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* Step 3: Notas + GDPR */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <FileText className="w-5 h-5 text-wepp-red" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-wepp-navy">Confirmación y notas</h3>
                    </div>

                    {/* Summary */}
                    <div className="bg-slate-50 border border-slate-100 p-6 space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Resumen de datos</h4>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Taller</span>
                          <span className="text-sm font-bold text-wepp-navy">{form.name || '—'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">CIF</span>
                          <span className="text-sm font-bold text-wepp-navy">{form.cif || '—'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Email</span>
                          <span className="text-sm font-bold text-wepp-navy">{form.email || '—'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Teléfono</span>
                          <span className="text-sm font-bold text-wepp-navy">{form.phone || '—'}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Dirección</span>
                          <span className="text-sm font-bold text-wepp-navy">{form.address}, {form.city}</span>
                        </div>
                        {!sameAddress && (
                          <div className="col-span-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Dirección de Envío</span>
                            <span className="text-sm font-bold text-wepp-navy">{form.shippingAddress || '—'}</span>
                          </div>
                        )}
                        {!sameContact && form.orderContactName && (
                          <div className="col-span-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Contacto Pedidos</span>
                            <span className="text-sm font-bold text-wepp-navy">{form.orderContactName} · {form.orderContactPhone} · {form.orderContactEmail}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>Notas adicionales (opcional)</label>
                      <textarea
                        value={form.notes}
                        onChange={e => updateField('notes', e.target.value)}
                        placeholder="Información adicional, horarios, marcas con las que trabajas, etc."
                        rows={3}
                        className={inputClass + ' resize-none'}
                      />
                    </div>

                    {/* GDPR Consent */}
                    <div className="bg-wepp-navy/5 border border-wepp-navy/10 p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-wepp-red" />
                        <h4 className="text-xs font-black uppercase tracking-widest text-wepp-navy">Protección de Datos</h4>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        De conformidad con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales (LOPDGDD), 
                        le informamos de que los datos personales que nos proporciona serán tratados por <strong>WEPP GmbH & Co. KG</strong> con la finalidad de 
                        gestionar su alta como taller autorizado, la gestión de pedidos y comunicaciones comerciales relacionadas. Los datos serán conservados 
                        durante la vigencia de la relación comercial y los plazos legales aplicables. Puede ejercer sus derechos de acceso, rectificación, 
                        supresión, portabilidad, limitación y oposición enviando un email a <strong>info@wepp.es</strong>.
                      </p>
                      <div
                        className="relative cursor-pointer"
                        onClick={() => setGdprAccepted(!gdprAccepted)}
                      >
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <div className={`w-5 h-5 border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${gdprAccepted ? 'bg-wepp-red border-wepp-red' : 'border-slate-300 group-hover:border-wepp-red'}`}>
                            {gdprAccepted && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="text-xs font-bold text-wepp-navy leading-relaxed">
                            He leído y acepto la política de protección de datos y consiento el tratamiento de mis datos personales para los fines descritos. *
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-6 sm:px-8 flex-shrink-0"
            >
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold px-4 py-3">
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Actions */}
        {!isSuccess && (
          <div className="border-t border-slate-100 p-6 sm:p-8 flex items-center justify-between gap-4 bg-slate-50/50 flex-shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-wepp-navy transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Anterior
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3.5 border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-white transition-all"
              >
                Cancelar
              </button>
            )}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 bg-wepp-navy text-white px-8 py-3.5 font-black text-[10px] uppercase tracking-widest hover:bg-wepp-red transition-all shadow-lg active:scale-95"
              >
                Siguiente <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-wepp-red text-white px-8 py-3.5 font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-wepp-red/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                    Enviando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" /> Enviar Solicitud
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
