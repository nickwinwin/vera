'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useI18n } from '@/hooks/use-i18n';
import { Shield, Sparkles, Zap, Droplets, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';

export default function ClientProceduresPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const [procedures, setProcedures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProcedures = useCallback(async () => {
    try {
      // 1. Get Clinic ID (Case-insensitive search)
      let { data: clinicData, error: clinicError } = await supabase
        .from('clinics')
        .select('id')
        .eq('slug', slug)
        .single();
      
      if (clinicError || !clinicData) {
        // Try case-insensitive if exact match fails
        const { data: retryData } = await (supabase
          .from('clinics')
          .select('id')
          .ilike('slug', slug as string)
          .single() as any);
        
        if (!retryData) {
          console.error('Clinic not found for slug:', slug, clinicError);
          setLoading(false);
          return;
        }
        clinicData = retryData;
      }

      // 2. Get Procedures
      const { data: procData, error: procError } = await supabase
        .from('procedures')
        .select('*')
        .eq('clinic_id', clinicData.id)
        .order('name');
      
      if (procError) {
        console.error('Error fetching procedures:', procError);
        return;
      }
      
      if (procData) setProcedures(procData);
    } catch (error) {
      console.error('Error fetching procedures:', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchProcedures();
    }
  }, [slug, fetchProcedures]);

  const getIcon = (iconName: string, procName: string) => {
    if (iconName === 'Zap' || procName.includes('IPL')) return Zap;
    if (iconName === 'Sparkles' || procName.includes('Laser')) return Sparkles;
    return Droplets;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-warm-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-beige animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-warm-white flex flex-col p-6">
      <div className="max-w-2xl w-full mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-display font-bold">Behandlung wählen</h1>
          <p className="text-brand-secondary mt-2">Welche Behandlung führen wir heute bei Ihnen durch?</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {procedures.map((proc, i) => {
            const Icon = getIcon(proc.icon, proc.name);
            return (
              <motion.button 
                key={proc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => router.push(`/s/${slug}/consent/${proc.category}`)}
                type="button"
                className="medical-card bg-white p-6 flex items-center justify-between text-left hover:border-brand-beige group transition-all cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-brand-warm-white rounded-full flex items-center justify-center text-brand-beige group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{proc.name}</h3>
                    <p className="text-sm text-brand-muted line-clamp-1">{proc.description}</p>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-brand-muted group-hover:text-brand-beige transition-colors" />
              </motion.button>
            );
          })}
        </div>

        <div className="mt-12 p-6 bg-white rounded-brand border border-brand-border text-center">
          <p className="text-sm text-brand-secondary mb-4">
            Ihre Behandlung ist nicht dabei?
          </p>
          <button 
            onClick={() => router.push(`/s/${slug}/consent/sign/other`)}
            className="btn-outline w-full py-3"
          >
            Andere Behandlung wählen
          </button>
        </div>

        <div className="mt-8 p-6 medical-card bg-white border-l-4 border-l-brand-beige">
          <div className="flex gap-4">
            <Shield className="w-6 h-6 text-brand-beige flex-shrink-0" />
            <div>
              <p className="text-sm font-bold">Sicherheitshinweis</p>
              <p className="text-xs text-brand-secondary leading-relaxed mt-1">
                Alle unsere Behandlungen werden nach den strengen NiSV-Richtlinien durchgeführt. Unsere Behandler sind entsprechend zertifiziert.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
