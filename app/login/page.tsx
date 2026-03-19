'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/hooks/use-auth';
import { useI18n } from '@/hooks/use-i18n';
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Bitte füllen Sie alle Felder aus.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await login(email, password);
      if (error) {
        setError('Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Daten.');
      } else {
        // Redirection is handled by the AuthProvider's state change listener or manually here
        // Since we want specific redirects based on role, we can wait for the user to be set
      }
    } catch (err) {
      setError('Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-warm-white flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full medical-card p-8 bg-white"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-beige/10 rounded-full mb-4">
            <Shield className="w-8 h-8 text-brand-beige" />
          </div>
          <h1 className="text-3xl font-display font-bold">{t('auth.welcome_back')}</h1>
          <p className="text-brand-secondary mt-2">Melden Sie sich an, um fortzufahren.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-brand-secondary mb-2">
              {t('auth.email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
              <input 
                type="email" 
                className="input-field pl-10"
                placeholder="name@beispiel.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-secondary mb-2">
              {t('auth.password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
              <input 
                type="password" 
                className="input-field pl-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="text-brand-error text-sm text-center">{error}</p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Anmeldung...' : <>{t('common.login')} <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-brand-border text-center">
          <p className="text-sm text-brand-secondary">
            {t('auth.no_account')}{' '}
            <Link href="/register" className="text-brand-beige font-bold hover:underline">
              {t('auth.create_account')}
            </Link>
          </p>
          <div className="mt-4 flex flex-col gap-2 text-xs text-brand-muted">
            <p>Admin Demo: admin@vera.de</p>
            <p>Clinic Demo: clinic@studio.de</p>
            <p>Client Demo: client@user.de</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
