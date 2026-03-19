'use client';

import { useI18n } from '@/hooks/use-i18n';
import { Check, CreditCard, Shield, Zap, Building } from 'lucide-react';
import { motion } from 'motion/react';

export default function SubscriptionPage() {
  const { t } = useI18n();

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '49€',
      features: [
        'Bis zu 5 Geräte',
        'Digitale Anamnese',
        'Standard-Support',
        '1 Admin-User'
      ],
      current: false
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '99€',
      features: [
        'Unbegrenzte Geräte',
        'QR-Code Check-in',
        'Eigene Formular-Templates',
        'Prioritäts-Support',
        'Bis zu 5 Admin-User'
      ],
      current: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '199€',
      features: [
        'Multi-Standort Support',
        'API-Zugriff',
        'Eigener Account Manager',
        'Individuelle Schulungen',
        'Unbegrenzte Admin-User'
      ],
      current: false
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">{t('dashboard.subscription')}</h1>
        <p className="text-brand-secondary">Verwalten Sie Ihren Plan und Ihre Zahlungsmethoden.</p>
      </div>

      {/* Current Plan Banner */}
      <div className="medical-card bg-brand-dark text-white p-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-brand-beige rounded-full flex items-center justify-center text-white">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <p className="text-brand-muted text-sm uppercase font-bold tracking-widest">Aktueller Plan</p>
            <h2 className="text-3xl font-display font-bold text-white">Professional Plan</h2>
            <p className="text-brand-muted mt-1">Nächste Abrechnung am 01.04.2026</p>
          </div>
        </div>
        <div className="text-center md:text-right">
          <p className="text-3xl font-display font-bold text-brand-beige">99,00 € <span className="text-sm font-normal text-brand-muted">/ Monat</span></p>
          <button className="mt-4 text-sm font-bold text-brand-beige hover:underline">Rechnungshistorie ansehen</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <motion.div 
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`medical-card p-8 flex flex-col ${plan.current ? 'bg-white border-2 border-brand-beige ring-4 ring-brand-beige/5' : 'bg-white'}`}
          >
            {plan.current && (
              <span className="self-start bg-brand-beige text-white text-[10px] font-bold uppercase px-2 py-1 rounded mb-4">
                Aktueller Plan
              </span>
            )}
            <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-display font-bold">{plan.price}</span>
              <span className="text-brand-muted text-sm">/ Monat</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-brand-secondary">
                  <Check className="w-4 h-4 text-brand-success mt-0.5 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              disabled={plan.current}
              className={`w-full py-3 rounded-brand font-bold transition-all ${plan.current ? 'bg-brand-warm-white text-brand-muted cursor-default' : 'btn-primary'}`}
            >
              {plan.current ? 'Aktiv' : 'Upgrade wählen'}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="medical-card bg-white p-8">
        <div className="flex items-center gap-4 mb-8">
          <CreditCard className="w-6 h-6 text-brand-beige" />
          <h2 className="text-xl font-bold">Zahlungsmethode</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 border border-brand-border rounded-brand bg-brand-warm-white/30">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="w-12 h-8 bg-brand-dark rounded flex items-center justify-center text-white font-bold text-[10px]">VISA</div>
            <div>
              <p className="text-sm font-bold">Visa endend auf 4242</p>
              <p className="text-xs text-brand-muted">Ablaufdatum 12/2028</p>
            </div>
          </div>
          <button className="text-sm font-bold text-brand-beige hover:underline">Bearbeiten</button>
        </div>

        <div className="mt-8 pt-8 border-t border-brand-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-brand-muted">
            <Shield className="w-4 h-4" />
            <span className="text-xs">Sichere Zahlungsabwicklung via Stripe</span>
          </div>
          <button className="text-sm font-bold text-brand-error hover:underline">Abonnement kündigen</button>
        </div>
      </div>
    </div>
  );
}
