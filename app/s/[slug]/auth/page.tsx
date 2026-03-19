'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useI18n } from '@/hooks/use-i18n';
import { Shield, Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function ClientAuthPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, authenticate client
    router.push(`/s/${slug}/consent/anamnese`);
  };

  return (
    <div className="min-h-screen bg-brand-warm-white flex flex-col p-6">
      <button 
        onClick={() => router.push(`/s/${slug}`)}
        className="self-start flex items-center gap-2 text-brand-secondary mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Zurück
      </button>

      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <Shield className="w-12 h-12 text-brand-beige mx-auto mb-4" />
          <h1 className="text-3xl font-display font-bold">
            {isLogin ? 'Anmelden' : 'Registrieren'}
          </h1>
          <p className="text-brand-secondary mt-2">
            {isLogin ? 'Schön, dass Sie wieder da sind.' : 'Erstellen Sie ein Konto für Ihre Dokumentation.'}
          </p>
        </div>

        <motion.div 
          key={isLogin ? 'login' : 'register'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="medical-card bg-white p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-brand-secondary mb-2">Vollständiger Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
                  <input type="text" className="input-field pl-11 pr-4" placeholder="Max Mustermann" required />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-brand-secondary mb-2">E-Mail-Adresse</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
                <input type="email" className="input-field pl-11 pr-4" placeholder="name@beispiel.de" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-secondary mb-2">Passwort</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
                <input type="password" className="input-field pl-11 pr-4" placeholder="••••••••" required />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-2">
              {isLogin ? 'Anmelden' : 'Konto erstellen'} <ArrowRight className="w-5 h-5" />
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-brand-muted">Oder</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => router.push(`/s/${slug}/consent/anamnese`)}
              className="btn-outline w-full py-4 flex items-center justify-center gap-2"
            >
              Ohne Konto fortfahren <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="w-full mt-6 text-sm text-brand-beige font-bold hover:underline"
          >
            {isLogin ? 'Noch kein Konto? Hier registrieren' : 'Bereits ein Konto? Hier anmelden'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
