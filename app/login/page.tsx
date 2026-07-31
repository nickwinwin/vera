'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/hooks/use-auth';
import { useI18n } from '@/hooks/use-i18n';
import { supabase } from '@/lib/supabase';
import { Shield, Mail, Lock, ArrowRight, Building, Check, User, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'login' | 'register';

export default function LoginPage() {
  const { login, user, isLoading: authLoading } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('login');

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Register state
  const [regStep, setRegStep] = useState(1);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');
  const [registered, setRegistered] = useState(false);
  const [regData, setRegData] = useState({
    clinicName: '',
    ownerName: '',
    email: '',
    password: '',
    plan: 'pro'
  });

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'admin') router.push('/admin');
      else router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Bitte füllen Sie alle Felder aus.');
      return;
    }
    if (password.length < 6) {
      setError('Das Passwort muss mindestens 6 Zeichen lang sein.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { error } = await login(email, password);
      if (error) setError(error.message || 'Anmeldung fehlgeschlagen.');
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('Der Server antwortet nicht. Bitte versuchen Sie es später erneut.');
      } else {
        setError('Ein unerwarteter Fehler ist aufgetreten.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError('');

    if (regData.password.length < 6) {
      setRegError('Das Passwort muss mindestens 6 Zeichen lang sein.');
      setRegLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: regData.email,
        password: regData.password,
      });

      if (signUpError) {
        setRegError(signUpError.message);
        setRegLoading(false);
        return;
      }

      if (!data.user) {
        setRegError('Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.');
        setRegLoading(false);
        return;
      }

      const defaultSlug = regData.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-');
      await supabase.from('clinics').insert({
        name: regData.clinicName || 'Meine Klinik',
        slug: `${defaultSlug}-${Math.random().toString(36).substring(2, 5)}`,
        owner_id: data.user.id,
        email: regData.email,
      });

      setRegistered(true);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setRegError('Der Server antwortet nicht. Bitte versuchen Sie es später erneut.');
      } else {
        setRegError('Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.');
      }
    } finally {
      setRegLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="min-h-screen bg-brand-warm-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-brand p-8 medical-card text-center">
          <Mail className="w-16 h-16 text-brand-beige mx-auto mb-6" />
          <h1 className="text-2xl font-display font-bold mb-4">Registrierung erfolgreich!</h1>
          <p className="text-brand-secondary mb-6">
            Wir haben eine Bestätigungs-E-Mail an <strong>{regData.email}</strong> gesendet.
            Bitte klicken Sie auf den Link in der E-Mail, um Ihr Konto zu aktivieren.
          </p>
          <button onClick={() => { setTab('login'); setRegistered(false); }} className="btn-primary inline-block py-3 px-8">
            Zum Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-warm-white flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full medical-card p-8 bg-white"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-beige/10 rounded-full mb-4">
            <Shield className="w-8 h-8 text-brand-beige" />
          </div>
          <h1 className="text-3xl font-display font-bold">NiSV-AUDIT</h1>
          <p className="text-brand-secondary mt-1">VERA Software</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-brand-warm-white rounded-brand p-1 mb-6">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-brand transition-all ${tab === 'login' ? 'bg-white shadow-sm text-brand-text' : 'text-brand-secondary hover:text-brand-text'}`}
          >
            {t('common.login')}
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-brand transition-all ${tab === 'register' ? 'bg-white shadow-sm text-brand-text' : 'text-brand-secondary hover:text-brand-text'}`}
          >
            Registrieren
          </button>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'login' ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onSubmit={handleLogin}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-brand-secondary mb-2">{t('auth.email')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
                  <input type="email" className="input-field pl-10" placeholder="name@beispiel.de" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-secondary mb-2">{t('auth.password')}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
                  <input type="password" className="input-field pl-10" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
              </div>
              {error && <p className="text-brand-error text-sm text-center">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? 'Anmeldung...' : <>{t('common.login')} <ArrowRight className="w-5 h-5" /></>}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              {/* Progress */}
              <div className="flex justify-between mb-6 px-2">
                {[1, 2, 3].map(s => (
                  <div key={s} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${regStep >= s ? 'bg-brand-beige text-white' : 'bg-white text-brand-muted border border-brand-border'}`}>
                      {regStep > s ? <Check className="w-4 h-4" /> : s}
                    </div>
                    {s < 3 && <div className={`w-8 sm:w-16 h-0.5 mx-1.5 rounded ${regStep > s ? 'bg-brand-beige' : 'bg-brand-border'}`} />}
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {regStep === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                    <div className="text-center mb-4">
                      <Building className="w-10 h-10 text-brand-beige mx-auto mb-3" />
                      <h2 className="text-lg font-display font-bold">Klinik-Details</h2>
                      <p className="text-xs text-brand-secondary">Geben Sie die Basisdaten Ihres Studios ein.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Name des Studios</label>
                      <input type="text" className="input-field" placeholder="z.B. Beauty Lounge Berlin" value={regData.clinicName} onChange={e => setRegData({...regData, clinicName: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">E-Mail-Adresse</label>
                      <input type="email" className="input-field" placeholder="kontakt@studio.de" value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Passwort</label>
                      <input type="password" className="input-field" placeholder="Mindestens 6 Zeichen" value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} />
                    </div>
                    <button onClick={() => setRegStep(2)} className="btn-primary w-full py-3">Weiter</button>
                  </motion.div>
                )}

                {regStep === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                    <div className="text-center mb-4">
                      <User className="w-10 h-10 text-brand-beige mx-auto mb-3" />
                      <h2 className="text-lg font-display font-bold">Inhaber-Informationen</h2>
                      <p className="text-xs text-brand-secondary">Wer ist für die NiSV-Compliance verantwortlich?</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Vollständiger Name</label>
                      <input type="text" className="input-field" placeholder="Max Mustermann" value={regData.ownerName} onChange={e => setRegData({...regData, ownerName: e.target.value})} />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setRegStep(1)} className="btn-outline flex-1 py-3">Zurück</button>
                      <button onClick={() => setRegStep(3)} className="btn-primary flex-1 py-3">Weiter</button>
                    </div>
                  </motion.div>
                )}

                {regStep === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                    <div className="text-center mb-4">
                      <CreditCard className="w-10 h-10 text-brand-beige mx-auto mb-3" />
                      <h2 className="text-lg font-display font-bold">Wählen Sie Ihren Plan</h2>
                      <p className="text-xs text-brand-secondary">Alle Pläne beinhalten die NiSV-Grundausstattung.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { id: 'basic', name: 'Basic', price: '49€', desc: 'Bis zu 5 Geräte' },
                        { id: 'pro', name: 'Professional', price: '99€', desc: 'Unbegrenzte Geräte + QR' },
                        { id: 'enterprise', name: 'Enterprise', price: '199€', desc: 'Multi-Standort Support' }
                      ].map(plan => (
                        <label key={plan.id} className={`flex items-center justify-between p-3 border rounded-brand cursor-pointer transition-all ${regData.plan === plan.id ? 'border-brand-beige bg-brand-beige/5 ring-1 ring-brand-beige' : 'border-brand-border hover:border-brand-beige'}`}>
                          <div className="flex items-center gap-3">
                            <input type="radio" name="plan" className="accent-brand-beige" checked={regData.plan === plan.id} onChange={() => setRegData({...regData, plan: plan.id})} />
                            <div>
                              <p className="font-bold text-sm">{plan.name}</p>
                              <p className="text-xs text-brand-secondary">{plan.desc}</p>
                            </div>
                          </div>
                          <p className="font-display font-bold text-brand-beige">{plan.price}<span className="text-xs font-normal text-brand-muted">/Monat</span></p>
                        </label>
                      ))}
                    </div>
                    {regError && <p className="text-sm text-red-500 text-center">{regError}</p>}
                    <div className="flex gap-3">
                      <button onClick={() => setRegStep(2)} className="btn-outline flex-1 py-3">Zurück</button>
                      <button onClick={handleRegister} disabled={regLoading} className="btn-primary flex-1 py-3">
                        {regLoading ? 'Wird erstellt...' : 'Registrierung abschließen'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}