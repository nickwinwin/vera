'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, ChevronDown, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { faqData } from './content';

function FAQItem({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border border-brand-border/60 rounded-xl overflow-hidden bg-white hover:border-brand-beige/30 transition-colors">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
      >
        <span className="font-semibold text-brand-dark pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-brand-beige flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 pt-0 text-brand-secondary leading-relaxed text-sm border-t border-brand-border/40">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-brand-warm-white">
      {/* Nav */}
      <nav className="border-b border-brand-border/60 bg-white/90 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-beige rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold">VERA</span>
          </Link>
          <Link href="/register" className="btn-primary text-sm">Starten</Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold text-brand-beige uppercase tracking-[0.2em] mb-4">FAQ</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Häufig gestellte Fragen</h1>
          <p className="text-lg text-brand-secondary/80 max-w-xl mx-auto">
            Alles, was Sie über VERA, NiSV-Compliance und digitale Einwilligungen wissen müssen.
          </p>
        </div>

        <div className="space-y-3">
          {faqData.map((item, i) => (
            <FAQItem
              key={i}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        <div className="mt-16 text-center bg-white border border-brand-border/60 rounded-2xl p-10">
          <h2 className="text-2xl font-display font-bold mb-4">Noch Fragen?</h2>
          <p className="text-brand-secondary mb-8 max-w-md mx-auto">Unser Team hilft Ihnen persönlich weiter – innerhalb weniger Stunden.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="group bg-brand-beige text-white px-8 py-3.5 rounded-full font-medium inline-flex items-center justify-center gap-2 hover:bg-brand-beige/90 transition-all shadow-lg shadow-brand-beige/20">
              Kostenlos testen <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a href="mailto:kontakt@vera-docs.de" className="border-2 border-brand-border text-brand-dark px-8 py-3.5 rounded-full font-medium inline-flex items-center justify-center hover:border-brand-beige/40 transition-all">
              E-Mail schreiben
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-brand-border/60 py-12">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-brand-muted">
            <Shield className="w-4 h-4 text-brand-beige" />
            VERA NiSV-AUDIT
          </div>
          <div className="flex gap-6 text-sm text-brand-secondary">
            <Link href="/impressum" className="hover:text-brand-beige">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-brand-beige">Datenschutz</Link>
            <Link href="/agb" className="hover:text-brand-beige">AGB</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}