'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useI18n } from '@/hooks/use-i18n';
import { Shield, Building, User, CreditCard, Check } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

export default function RegisterPage() {
  const { login } = useAuth();
  const { t } = useI18n();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clinicName: '',
    ownerName: '',
    email: '',
    plan: 'pro'
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(formData.email, 'clinic');
  };

  return (
    <div className="min-h-screen bg-brand-warm-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress Indicator */}
        <div className="flex justify-between mb-8 px-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s ? 'bg-brand-beige text-white' : 'bg-white text-brand-muted border border-brand-border'}`}>
                {step > s ? <Check className="w-6 h-6" /> : s}
              </div>
              {s < 3 && <div className={`w-12 sm:w-24 h-1 mx-2 rounded ${step > s ? 'bg-brand-beige' : 'bg-brand-border'}`} />}
            </div>
          ))}
        </div>

        <motion.div 
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="medical-card p-8 bg-white"
        >
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Building className="w-12 h-12 text-brand-beige mx-auto mb-4" />
                <h1 className="text-2xl font-display font-bold">Klinik-Details</h1>
                <p className="text-brand-secondary">Geben Sie die Basisdaten Ihres Studios ein.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Name des Studios</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="z.B. Beauty Lounge Berlin"
                  value={formData.clinicName}
                  onChange={e => setFormData({...formData, clinicName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">E-Mail-Adresse</label>
                <input 
                  type="email" 
                  className="input-field" 
                  placeholder="kontakt@studio.de"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <button onClick={nextStep} className="btn-primary w-full py-3">Weiter</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <User className="w-12 h-12 text-brand-beige mx-auto mb-4" />
                <h1 className="text-2xl font-display font-bold">Inhaber-Informationen</h1>
                <p className="text-brand-secondary">Wer ist für die NiSV-Compliance verantwortlich?</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Vollständiger Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Max Mustermann"
                  value={formData.ownerName}
                  onChange={e => setFormData({...formData, ownerName: e.target.value})}
                />
              </div>
              <div className="flex gap-4">
                <button onClick={prevStep} className="btn-outline flex-1 py-3">Zurück</button>
                <button onClick={nextStep} className="btn-primary flex-1 py-3">Weiter</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <CreditCard className="w-12 h-12 text-brand-beige mx-auto mb-4" />
                <h1 className="text-2xl font-display font-bold">Wählen Sie Ihren Plan</h1>
                <p className="text-brand-secondary">Alle Pläne beinhalten die NiSV-Grundausstattung.</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: 'basic', name: 'Basic', price: '49€', desc: 'Bis zu 5 Geräte' },
                  { id: 'pro', name: 'Professional', price: '99€', desc: 'Unbegrenzte Geräte + QR' },
                  { id: 'enterprise', name: 'Enterprise', price: '199€', desc: 'Multi-Standort Support' }
                ].map((plan) => (
                  <label 
                    key={plan.id}
                    className={`flex items-center justify-between p-4 border rounded-brand cursor-pointer transition-all ${formData.plan === plan.id ? 'border-brand-beige bg-brand-beige/5 ring-1 ring-brand-beige' : 'border-brand-border hover:border-brand-beige'}`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="plan" 
                        className="accent-brand-beige"
                        checked={formData.plan === plan.id}
                        onChange={() => setFormData({...formData, plan: plan.id})}
                      />
                      <div>
                        <p className="font-bold">{plan.name}</p>
                        <p className="text-xs text-brand-secondary">{plan.desc}</p>
                      </div>
                    </div>
                    <p className="font-display font-bold text-brand-beige">{plan.price}<span className="text-xs font-normal text-brand-muted">/Monat</span></p>
                  </label>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={prevStep} className="btn-outline flex-1 py-3">Zurück</button>
                <button onClick={handleSubmit} className="btn-primary flex-1 py-3">Registrierung abschließen</button>
              </div>
            </div>
          )}
        </motion.div>

        <div className="mt-8 text-center">
          <p className="text-sm text-brand-secondary">
            {t('auth.have_account')}{' '}
            <Link href="/login" className="text-brand-beige font-bold hover:underline">
              {t('common.login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
