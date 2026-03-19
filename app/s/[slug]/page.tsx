'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useI18n } from '@/hooks/use-i18n';
import { Shield, ArrowRight, Clock, MapPin, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function QrLandingPage() {
  const { slug } = useParams();
  const { t } = useI18n();
  const [clinicName, setClinicName] = useState("Laden...");

  useEffect(() => {
    if (slug) {
      supabase
        .from('clinics')
        .select('name')
        .eq('slug', slug)
        .single()
        .then(({ data }) => {
          if (data) setClinicName(data.name);
        });
    }
  }, [slug]);

  return (
    <div className="min-h-screen bg-brand-warm-white flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="mb-12">
          <div className="w-24 h-24 bg-white rounded-full border border-brand-border flex items-center justify-center mx-auto mb-6 shadow-brand">
            <Shield className="w-12 h-12 text-brand-beige" />
          </div>
          <h1 className="text-sm font-bold text-brand-beige uppercase tracking-[0.2em] mb-2">Willkommen bei</h1>
          <h2 className="text-4xl font-display font-bold text-brand-dark">{clinicName}</h2>
        </div>

        <div className="medical-card bg-white p-8 mb-8 space-y-6">
          <p className="text-brand-secondary leading-relaxed">
            Um Ihre Behandlung heute rechtssicher dokumentieren zu können, benötigen wir einige Angaben von Ihnen.
          </p>
          
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3 text-sm text-brand-secondary">
              <div className="w-8 h-8 rounded-full bg-brand-warm-white flex items-center justify-center text-brand-beige font-bold">1</div>
              <span>Gesundheitsfragen beantworten</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-brand-secondary">
              <div className="w-8 h-8 rounded-full bg-brand-warm-white flex items-center justify-center text-brand-beige font-bold">2</div>
              <span>Behandlung auswählen</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-brand-secondary">
              <div className="w-8 h-8 rounded-full bg-brand-warm-white flex items-center justify-center text-brand-beige font-bold">3</div>
              <span>Digital unterschreiben</span>
            </div>
          </div>

          <Link 
            href={`/s/${slug}/auth`}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
          >
            Jetzt starten <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="space-y-4 text-brand-muted text-xs">
          <div className="flex items-center justify-center gap-4">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Kurfürstendamm 12, Berlin</span>
            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> +49 30 123456</span>
          </div>
          <p>© 2026 VERA NiSV-AUDIT Compliance System</p>
        </div>
      </motion.div>
    </div>
  );
}
