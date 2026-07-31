'use client';

import Link from 'next/link';
import { useI18n } from '@/hooks/use-i18n';
import { useAuth } from '@/hooks/use-auth';
import { motion } from 'motion/react';
import { Shield, CheckCircle, ArrowRight, Globe, Menu, X, Star, FileText, QrCode, ChevronRight, MessageCircle, BookOpen } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import PublicChat from '@/components/public-chat';

const photos = {
  hero: '/img/digitalization.png',
  ceo: '/img/studio_ceo.png',
  qrScan: '/img/qr_scanning.png',
  form: '/img/Vera_Photoshooting client fills out form.png',
};

export default function LandingPage() {
  const { t, language, setLanguage } = useI18n();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-brand-border/30">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex justify-between h-20 items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-28 h-10 relative">
                <Image src="/img/vera-logo-full.svg" alt="VERA" fill className="object-contain object-left" />
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-10">
              <Link href="#features" className="text-sm text-brand-secondary hover:text-brand-dark transition-colors tracking-wide">Features</Link>
              <Link href="#pricing" className="text-sm text-brand-secondary hover:text-brand-dark transition-colors tracking-wide">Preise</Link>
              <Link href="/faq" className="text-sm text-brand-secondary hover:text-brand-dark transition-colors tracking-wide">FAQ</Link>
              <Link href="/blog" className="text-sm text-brand-secondary hover:text-brand-dark transition-colors tracking-wide">Blog</Link>
              <button
                onClick={() => setLanguage(language === 'de' ? 'en' : 'de')}
                className="flex items-center gap-1.5 text-sm text-brand-secondary hover:text-brand-dark transition-colors tracking-wide"
              >
                <Globe className="w-4 h-4" />
                {language.toUpperCase()}
              </button>
              {user ? (
                <Link href={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn-primary shadow-sm shadow-brand-beige/20">
                  Dashboard
                </Link>
              ) : (
                <div className="flex items-center gap-6">
                  <Link href="/login" className="text-sm text-brand-secondary hover:text-brand-dark transition-colors tracking-wide">Login</Link>
                  <Link href="/register" className="btn-primary shadow-sm shadow-brand-beige/20">Starten</Link>
                </div>
              )}
            </div>

            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 hover:bg-brand-warm-white rounded-lg transition-colors">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={photos.hero}
            alt="Digitalisierung"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-black/30" />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10 w-full pt-28 pb-32">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8"
            >
              <Star className="w-4 h-4 text-brand-beige" />
              <span className="text-sm font-medium text-white/90">NiSV-konform seit 2024</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display italic leading-[1.05] tracking-tight mb-8 text-white"
            >
              <span>Ihre Praxis,</span>
              <br />
              <span className="text-brand-beige">rechtssicher digital.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="text-lg md:text-xl text-white/70 max-w-2xl mb-12 leading-relaxed"
            >
              Die NiSV-Compliance-Plattform für Kosmetik Institute.
              Geräteakte, Smart Consent und QR-Check-in – vollständig digital, jederzeit prüfungssicher.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/register" className="group bg-brand-beige text-white px-10 py-4 rounded-full font-medium text-lg inline-flex items-center justify-center gap-2 hover:bg-brand-beige/90 transition-all shadow-lg shadow-brand-beige/25 hover:shadow-xl hover:shadow-brand-beige/30">
                Kostenlos starten <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <button className="group border-2 border-white/30 text-white px-10 py-4 rounded-full font-medium text-lg inline-flex items-center justify-center gap-2 hover:border-white/50 hover:bg-white/5 transition-all">
                Demo ansehen <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust + CEO Section */}
      <section className="py-32 bg-brand-warm-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block text-xs font-bold text-brand-beige uppercase tracking-[0.25em] mb-4">Vertrauen</span>
              <h2 className="text-4xl md:text-5xl font-display italic leading-tight mb-6">
                <span className="text-brand-beige">Rechtssicherheit,</span><br />die Sie entspannt.
              </h2>
              <p className="text-brand-secondary/80 leading-relaxed mb-8">
                Von der Geräteverwaltung bis zur digitalen Unterschrift – VERA bringt Ordnung
                in Ihre NiSV-Dokumentation. Prüfungssicher, jederzeit, überall.
              </p>
              <div className="grid grid-cols-3 gap-8">
                {[
                  { number: "100%", label: "Digital" },
                  { number: "DSGVO", label: "Konform" },
                  { number: "Sofort", label: "Einsatzbereit" },
                ].map((item, i) => (
                  <div key={i}>
                    <p className="text-3xl font-display italic font-bold text-brand-beige">{item.number}</p>
                    <p className="text-sm text-brand-muted mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={photos.ceo}
                  alt="Studio CEO mit iPad"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl px-6 py-4 max-w-[200px]">
                <p className="text-sm font-display italic font-bold text-brand-dark">&bdquo;Endlich digital.&ldquo;</p>
                <p className="text-xs text-brand-muted mt-1">– Sara M., Studioinhaberin</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="inline-block text-xs font-bold text-brand-beige uppercase tracking-[0.25em] mb-4">Features</span>
            <h2 className="text-4xl md:text-5xl font-display italic mb-6 leading-tight">Alles für Ihre NiSV-Compliance</h2>
            <p className="text-lg text-brand-secondary/80 leading-relaxed">Vollständig digitalisiert, rechtssicher nach deutschem Gesetz und intuitiv bedienbar – für Studios, die Wert auf Exzellenz legen.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: "Digitale Geräteakte",
                desc: "Verwalten Sie alle Zertifikate, Wartungsprotokolle und Gefährdungsbeurteilungen an einem zentralen Ort.",
                icon: FileText,
                accent: "bg-amber-50 text-amber-700 border-amber-200"
              },
              {
                title: "Smart Consent",
                desc: "Rechtssichere Einwilligungserklärungen mit digitaler Unterschrift – direkt auf dem Tablet oder Smartphone.",
                icon: CheckCircle,
                accent: "bg-emerald-50 text-emerald-700 border-emerald-200"
              },
              {
                title: "QR-Check-in",
                desc: "Kunden scannen den QR-Code im Studio und füllen Anamnesebögen kontaktlos aus – hygienisch und effizient.",
                icon: QrCode,
                accent: "bg-sky-50 text-sky-700 border-sky-200"
              }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="group relative bg-white border border-brand-border/60 rounded-2xl p-8 hover:border-brand-beige/30 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.accent} border`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-brand-dark">{feature.title}</h3>
                  <p className="text-brand-secondary leading-relaxed text-sm">{feature.desc}</p>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-brand-beige/0 via-transparent to-brand-beige/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </motion.div>
              );
            })}
          </div>

          {/* QR Scan Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 grid md:grid-cols-2 gap-12 items-center bg-brand-warm-white rounded-3xl p-8 md:p-12"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={photos.qrScan}
                alt="QR-Code Scan"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="inline-block text-xs font-bold text-brand-beige uppercase tracking-[0.25em] mb-3">Kontaktlos</span>
              <h3 className="text-3xl font-display italic font-bold mb-4">Scan & Go</h3>
              <p className="text-brand-secondary/80 leading-relaxed mb-6">
                Kunden scannen den QR-Code an Ihrer Rezeption – innerhalb von Sekunden sind alle
                Einwilligungen und Anamnesebögen digital erfasst. Hygienisch, schnell, rechtskonform.
              </p>
              <ul className="space-y-3">
                {['Kein Papier mehr', 'Automatische Dokumentation', 'DSGVO-konform'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-brand-dark">
                    <CheckCircle className="w-4 h-4 text-brand-beige flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Client Form + App Discovery Section */}
      <section className="py-32 bg-brand-warm-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl"
            >
              <Image
                src={photos.form}
                alt="Client füllt Formular aus"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block text-xs font-bold text-brand-beige uppercase tracking-[0.25em] mb-4">Digitaler Empfang</span>
              <h2 className="text-4xl md:text-5xl font-display italic leading-tight mb-6">
                Vom Formular<br />zur <span className="text-brand-beige">Unterschrift</span>
              </h2>
              <p className="text-brand-secondary/80 leading-relaxed mb-8">
                ob Aufklärungsbogen, Einwilligung oder Anamnese – Ihre Kunden erfassen
                alles direkt auf dem Tablet. Kein Papierkrieg, keine verlorenen Dokumente.
                Ein nahtloser, professioneller Empfang, der Vertrauen schafft.
              </p>
              <Link href="/register" className="inline-flex items-center gap-2 bg-brand-beige text-white px-8 py-3.5 rounded-full font-medium hover:bg-brand-beige/90 transition-all shadow-lg shadow-brand-beige/20">
                Jetzt digital starten <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="inline-block text-xs font-bold text-brand-beige uppercase tracking-[0.25em] mb-4">Preise</span>
            <h2 className="text-4xl md:text-5xl font-display italic mb-6 leading-tight">Einfach und transparent</h2>
            <p className="text-lg text-brand-secondary/80 leading-relaxed">Keine versteckten Kosten. Jeder Plan beinhaltet die NiSV-Grundausstattung.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {[
              { name: "Basic", price: "49", desc: "Bis zu 5 Geräte", features: ["Geräteverwaltung", "Anamnese digital", "QR-Check-in", "E-Mail-Support"] },
              { name: "Professional", price: "99", desc: "Unbegrenzte Geräte + QR", features: ["Alles aus Basic", "Unbegrenzte Geräte", "Smart Consent", "PDF-Export", "Priority Support"], popular: true },
              { name: "Enterprise", price: "199", desc: "Multi-Standort", features: ["Alles aus Professional", "Multi-Standort", "API-Zugriff", "Persönlicher Account Manager", "SLA"] },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-white border-2 rounded-2xl p-8 flex flex-col transition-all duration-300 hover:shadow-xl ${plan.popular ? 'border-brand-beige shadow-lg shadow-brand-beige/10 scale-[1.02] md:scale-105' : 'border-brand-border/60 hover:border-brand-beige/30'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-beige text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    Empfohlen
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-display italic font-bold text-brand-beige">{plan.price}€</span>
                  <span className="text-brand-muted text-sm">/Monat</span>
                </div>
                <p className="text-sm text-brand-secondary mb-8">{plan.desc}</p>
                <ul className="space-y-3 mb-10 flex-1">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-4 h-4 text-brand-beige flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`w-full py-3 rounded-full font-medium text-sm text-center transition-all ${
                    plan.popular
                      ? 'bg-brand-beige text-white hover:bg-brand-beige/90 shadow-md shadow-brand-beige/20'
                      : 'border-2 border-brand-border text-brand-dark hover:border-brand-beige/40 hover:bg-brand-beige/5'
                  }`}
                >
                  {plan.popular ? 'Jetzt starten' : 'Mehr erfahren'}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-brand-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-brand-beige/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-brand-beige/3 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display italic mb-6 leading-tight">Bereit für die digitale Compliance?</h2>
            <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">Starte heute und mache Dein Studio fit für die NiSV-Prüfung – mit der Plattform, die von Tausenden Kosmetikstudios in Deutschland genutzt wird.</p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-brand-beige text-white px-10 py-4 rounded-full font-medium text-lg hover:bg-brand-beige/90 transition-all shadow-lg shadow-brand-beige/20">
              Kostenlos starten <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <PublicChat />

      {/* Footer */}
      <footer className="bg-brand-warm-white py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-28 h-10 relative">
                <Image src="/img/vera-logo-full.svg" alt="VERA" fill className="object-contain object-left" />
              </div>
            </Link>
            <div className="flex gap-8 text-sm text-brand-secondary">
              <Link href="/faq" className="hover:text-brand-beige transition-colors tracking-wide">FAQ</Link>
              <Link href="/blog" className="hover:text-brand-beige transition-colors tracking-wide">Blog</Link>
              <Link href="/impressum" className="hover:text-brand-beige transition-colors tracking-wide">Impressum</Link>
              <Link href="/datenschutz" className="hover:text-brand-beige transition-colors tracking-wide">Datenschutz</Link>
              <Link href="/agb" className="hover:text-brand-beige transition-colors tracking-wide">AGB</Link>
            </div>
          </div>
          <div className="border-t border-brand-border/60 pt-8">
            <p className="text-sm text-brand-muted text-center">© 2026 VERA NiSV-AUDIT. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}