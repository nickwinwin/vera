'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useI18n } from '@/hooks/use-i18n';
import { supabase } from '@/lib/supabase';
import { Building, User, CreditCard, Check } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    clinicName: '',
    ownerName: '',
    email: '',
    password: '',
    plan: 'pro'
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (signUpError || !data.user) {
      setError(signUpError?.message || 'Registrierung fehlgeschlagen');
      setLoading(false);
      return;
    }

    const defaultSlug = formData.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-');
    await supabase.from('clinics').insert({
      name: formData.clinicName || 'Meine Klinik',
      slug: `${defaultSlug}-${Math.random().toString(36).substring(2, 5)}`,
      owner_id: data.user.id,
      email: formData.email,
    });

    router.push('/dashboard');
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
              <div>
                <label className="block text-sm font-medium mb-2">Passwort</label>
                <input 
                  type="password" 
                  className="input-field" 
                  placeholder="Mindestens 6 Zeichen"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
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
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              <div className="flex gap-4">
                <button onClick={prevStep} className="btn-outline flex-1 py-3">Zurück</button>
                <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 py-3">
                  {loading ? 'Wird erstellt...' : 'Registrierung abschließen'}
                </button>
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
