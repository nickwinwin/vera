'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Shield, ArrowLeft, Loader2, AlertCircle, Printer, Download } from 'lucide-react';
import { motion } from 'motion/react';

export default function ViewConsentPage() {
  const { slug, docId } = useParams();
  const router = useRouter();
  
  const [doc, setDoc] = useState<any>(null);
  const [clinic, setClinic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (docId) {
      fetchDocument();
    }
  }, [docId]);

  const fetchDocument = async () => {
    try {
      // 1. Fetch Document with Template and Client info
      const { data: docData, error: docError } = await supabase
        .from('consent_documents')
        .select(`
          *,
          clients (*),
          consent_templates (*)
        `)
        .eq('id', docId)
        .single();
      
      if (docError) throw docError;
      setDoc(docData);

      // 2. Fetch Clinic
      const { data: clinicData } = await supabase
        .from('clinics')
        .select('*')
        .eq('id', docData.clinic_id)
        .single();
      
      setClinic(clinicData);
    } catch (error) {
      console.error('Error fetching document:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-warm-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="min-h-screen bg-brand-warm-white flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-brand-error mb-4" />
        <h1 className="text-2xl font-bold mb-2">Dokument nicht gefunden</h1>
        <p className="text-brand-secondary mb-6">Das angeforderte Dokument konnte nicht geladen werden.</p>
        <button onClick={() => router.back()} className="btn-primary px-6 py-2">Zurück</button>
      </div>
    );
  }

  const template = doc.consent_templates;
  const formData = doc.metadata || {};

  return (
    <div className="min-h-screen bg-brand-warm-white p-6 md:p-12 print:p-0 print:bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Actions - Hidden on Print */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          <button 
            onClick={() => router.push('/dashboard/procedures/logs')}
            className="flex items-center gap-2 text-brand-secondary hover:text-brand-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Zurück zum Log
          </button>
          <div className="flex gap-3">
            <button 
              onClick={() => window.print()}
              className="btn-outline py-2 px-4 flex items-center gap-2 text-sm"
            >
              <Printer className="w-4 h-4" /> Drucken
            </button>
          </div>
        </div>

        {/* The Document */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-brand border border-brand-border rounded-2xl overflow-hidden print:shadow-none print:border-none print:rounded-none"
        >
          {/* Header */}
          <div className="bg-brand-dark text-white p-8 md:p-12">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-display font-bold uppercase tracking-tight">Einwilligungserklärung</h1>
                <p className="text-brand-muted mt-2">VERA NiSV-Compliance Dokumentation</p>
              </div>
              <Shield className="w-12 h-12 text-brand-beige" />
            </div>
            
            <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t border-white/10 text-sm">
              <div>
                <p className="text-brand-muted uppercase font-bold text-[10px] tracking-widest mb-1">Klinik / Studio</p>
                <p className="font-bold text-lg">{clinic?.name}</p>
                <p className="text-brand-muted">{clinic?.address}</p>
              </div>
              <div className="text-right">
                <p className="text-brand-muted uppercase font-bold text-[10px] tracking-widest mb-1">Dokumenten-ID</p>
                <p className="font-mono text-xs opacity-60">{doc.id}</p>
                <p className="mt-2 font-bold">Datum: {new Date(doc.signed_at).toLocaleDateString('de-DE')}</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 md:p-12 space-y-12">
            {/* Client Info */}
            <section>
              <h2 className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-4 border-b border-brand-border pb-2">Kunden-Informationen</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-[10px] text-brand-muted uppercase font-bold">Name</p>
                  <p className="font-bold">{doc.clients?.first_name} {doc.clients?.last_name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-brand-muted uppercase font-bold">E-Mail</p>
                  <p className="font-medium">{doc.clients?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-brand-muted uppercase font-bold">Geburtsdatum</p>
                  <p className="font-medium">{doc.clients?.date_of_birth ? new Date(doc.clients.date_of_birth).toLocaleDateString('de-DE') : 'N/A'}</p>
                </div>
              </div>
            </section>

            {/* Form Content - Dynamic based on Template */}
            <section className="space-y-8">
              <h2 className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-4 border-b border-brand-border pb-2">Behandlungs-Details & Aufklärung</h2>
              <div className="p-4 bg-brand-warm-white rounded-brand border border-brand-border mb-6">
                <p className="font-bold text-brand-dark">Behandlungstyp: {doc.procedure_name}</p>
              </div>

              {template?.content?.sections?.map((section: any, sIdx: number) => (
                <div key={sIdx} className="space-y-4">
                  <h3 className="text-sm font-bold text-brand-dark bg-brand-warm-white/50 px-3 py-1 rounded">{section.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 px-3">
                    {section.fields.map((field: any) => {
                      if (field.type === 'info' || field.type === 'signature') return null;
                      const val = formData[field.id];
                      return (
                        <div key={field.id} className="border-b border-brand-border/50 pb-2">
                          <p className="text-[10px] text-brand-muted uppercase font-bold mb-1">{field.label}</p>
                          <p className="text-sm font-medium">
                            {Array.isArray(val) ? val.join(', ') : 
                             typeof val === 'boolean' ? (val ? 'Ja' : 'Nein') : 
                             val || '—'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </section>

            {/* Signature */}
            <section className="pt-12 border-t border-brand-border">
              <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                <div className="flex-1 w-full">
                  <p className="text-[10px] text-brand-muted uppercase font-bold mb-4">Rechtsverbindliche Unterschrift</p>
                  <div className="border border-brand-border rounded-brand p-4 bg-brand-warm-white/30 h-40 flex items-center justify-center">
                    {doc.signature_data ? (
                      <img 
                        src={doc.signature_data} 
                        alt="Signature" 
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <p className="text-brand-muted italic text-xs">Keine Unterschrift vorhanden</p>
                    )}
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] text-brand-muted">
                    <span>Digital signiert am {new Date(doc.signed_at).toLocaleString('de-DE')}</span>
                    <span>IP-Adresse: Protokolliert</span>
                  </div>
                </div>
                <div className="w-full md:w-64 text-center border-t border-brand-dark pt-2">
                  <p className="text-xs font-bold">{doc.clients?.first_name} {doc.clients?.last_name}</p>
                  <p className="text-[10px] text-brand-muted uppercase">Kunde</p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="bg-brand-warm-white p-6 text-center border-t border-brand-border">
            <p className="text-[10px] text-brand-muted uppercase tracking-widest">
              Dieses Dokument wurde elektronisch erstellt und ist ohne handschriftliche Unterschrift gültig.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
