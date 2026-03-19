'use client';

import Link from 'next/link';
import { useI18n } from '@/hooks/use-i18n';
import { useAuth } from '@/hooks/use-auth';
import { motion } from 'motion/react';
import { Shield, CheckCircle, ArrowRight, Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function LandingPage() {
  const { t, language, setLanguage } = useI18n();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-brand-border bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-brand-beige" />
              <span className="text-2xl font-display font-bold tracking-tight">VERA</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium hover:text-brand-beige transition-colors">Features</Link>
              <Link href="#pricing" className="text-sm font-medium hover:text-brand-beige transition-colors">Preise</Link>
              <button 
                onClick={() => setLanguage(language === 'de' ? 'en' : 'de')}
                className="flex items-center gap-1 text-sm font-medium hover:text-brand-beige transition-colors"
              >
                <Globe className="w-4 h-4" />
                {language.toUpperCase()}
              </button>
              {user ? (
                <Link href={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn-primary">
                  Dashboard
                </Link>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/login" className="text-sm font-medium hover:text-brand-beige transition-colors">Login</Link>
                  <Link href="/register" className="btn-primary">Starten</Link>
                </div>
              )}
            </div>

            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-brand-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6"
            >
              {t('landing.hero_title')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-brand-secondary mb-10 font-serif italic"
            >
              {t('landing.hero_subtitle')}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link href="/register" className="btn-primary text-lg px-10 py-4 flex items-center justify-center gap-2">
                {t('landing.cta_start')} <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="btn-outline text-lg px-10 py-4">
                {t('landing.cta_demo')}
              </button>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-brand-beige/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-beige/5 rounded-full blur-3xl" />
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Alles für Ihre NiSV-Compliance</h2>
            <p className="text-brand-secondary max-w-2xl mx-auto">Vollständig digitalisiert, rechtssicher nach deutschem Gesetz und intuitiv bedienbar.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Digitale Geräteakte",
                desc: "Verwalten Sie alle Zertifikate, Wartungsprotokolle und Gefährdungsbeurteilungen an einem Ort.",
                icon: Shield
              },
              {
                title: "Smart Consent",
                desc: "Rechtssichere Einwilligungserklärungen mit digitaler Unterschrift direkt auf dem Tablet oder Smartphone.",
                icon: CheckCircle
              },
              {
                title: "QR-Check-in",
                desc: "Kunden scannen den QR-Code im Studio und füllen Anamnesebögen kontaktlos aus.",
                icon: Globe
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="medical-card p-8 flex flex-col items-start"
              >
                <div className="w-12 h-12 bg-brand-beige/10 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-brand-beige" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-brand-secondary leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-warm-white border-t border-brand-border py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-brand-beige" />
              <span className="text-xl font-display font-bold">VERA</span>
            </div>
            <div className="flex gap-8 text-sm text-brand-secondary">
              <Link href="#" className="hover:text-brand-beige">Impressum</Link>
              <Link href="#" className="hover:text-brand-beige">Datenschutz</Link>
              <Link href="#" className="hover:text-brand-beige">AGB</Link>
            </div>
            <p className="text-sm text-brand-muted">© 2026 VERA NiSV-AUDIT. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
