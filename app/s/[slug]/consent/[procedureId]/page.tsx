'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useI18n } from '@/hooks/use-i18n';
import { Shield, Check, Eraser, Download, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion } from 'motion/react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

export default function ClientConsentPage() {
  const { slug, procedureId } = useParams();
  const router = useRouter();
  const { t } = useI18n();
  
  const [template, setTemplate] = useState<any>(null);
  const [clinic, setClinic] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplateAndClinic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, procedureId]);

  const fetchTemplateAndClinic = async () => {
    try {
      // 1. Fetch Clinic
      const { data: clinicData, error: clinicError } = await supabase
        .from('clinics')
        .select('id, name')
        .eq('slug', slug)
        .single();
      
      if (clinicError) throw clinicError;
      setClinic(clinicData);

      // 2. Fetch Template
      const { data: templateData, error: templateError } = await supabase
        .from('consent_templates')
        .select('*')
        .eq('clinic_id', clinicData.id)
        .eq('category', procedureId)
        .single();
      
      if (templateError) {
        // Fallback to first template if category doesn't match
        const { data: allTemplates } = await supabase
          .from('consent_templates')
          .select('*')
          .eq('clinic_id', clinicData.id)
          .limit(1);
        
        if (allTemplates && allTemplates.length > 0) {
          setTemplate(allTemplates[0]);
        } else {
          throw new Error('Kein Formular gefunden.');
        }
      } else {
        setTemplate(templateData);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error(error.message || 'Fehler beim Laden des Formulars.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#1A1A1A';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
      }
    }
  }, []);

  const startDrawing = (e: any) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSigned(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignatureData(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSigned(false);
        setSignatureData(null);
      }
    }
  };

  const generatePDF = async () => {
    const element = pdfRef.current;
    if (!element) return;

    try {
      toast.loading('PDF wird generiert...');
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Einwilligung_${template.name.replace(/\s+/g, '_')}.pdf`);
      toast.dismiss();
      toast.success('PDF erfolgreich heruntergeladen');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.dismiss();
      toast.error('Fehler bei der PDF-Generierung');
    }
  };

  const handleSubmit = async () => {
    if (!hasSigned || !clinic || !template) return;
    
    setIsSubmitting(true);
    try {
      // 1. Create/Find Client
      let clientId;
      
      // Check if we have a client ID in session storage from a previous step
      const sessionClientId = sessionStorage.getItem(`vera_client_id_${slug}`);
      
      if (template.category === 'anamnese') {
        const { data: newClient, error: clientError } = await supabase
          .from('clients')
          .insert({
            clinic_id: clinic.id,
            first_name: formData.first_name || 'Unbekannt',
            last_name: formData.last_name || 'Kunde',
            email: formData.email,
            phone: formData.phone,
            date_of_birth: formData.dob
          })
          .select('id')
          .single();
        
        if (clientError) throw clientError;
        clientId = newClient.id;
        
        // Store the client ID for the next steps in this session
        sessionStorage.setItem(`vera_client_id_${slug}`, clientId);
      } else if (sessionClientId) {
        // Use the client ID from the previous step (e.g., Anamnese)
        clientId = sessionClientId;
      } else {
        // Fallback: Use the first client found for this clinic as a shortcut for demo
        const { data: existingClients } = await supabase
          .from('clients')
          .select('id')
          .eq('clinic_id', clinic.id)
          .limit(1);
        
        clientId = existingClients?.[0]?.id;
        
        if (!clientId) {
          // Create a dummy client if none exists
          const { data: dummyClient } = await supabase
            .from('clients')
            .insert({
              clinic_id: clinic.id,
              first_name: 'Demo',
              last_name: 'Kunde'
            })
            .select('id')
            .single();
          clientId = dummyClient?.id;
        }
      }

      // 2. Save Document
      const { error: docError } = await supabase
        .from('consent_documents')
        .insert({
          clinic_id: clinic.id,
          client_id: clientId,
          template_id: template.id,
          procedure_name: template.name,
          signature_data: signatureData,
          metadata: formData,
          treatment_details: {
            treatment: template.name,
            iop: '',
            frequency: '',
            cooling: '',
            zone: '',
            energy: '',
            notes: ''
          }
        });

      if (docError) throw docError;

      setIsCompleted(true);
      toast.success('Einwilligung erfolgreich übermittelt');

      // If this was the anamnese, redirect to procedure selection after a short delay
      if (template.category === 'anamnese') {
        setTimeout(() => {
          router.push(`/s/${slug}/procedures`);
        }, 2000);
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error('Fehler beim Speichern der Einwilligung.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-warm-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-brand-warm-white flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-brand-error mb-4" />
        <h1 className="text-2xl font-bold mb-2">Formular nicht gefunden</h1>
        <p className="text-brand-secondary mb-6">Das angeforderte Formular konnte nicht geladen werden.</p>
        <button onClick={() => router.push(`/s/${slug}`)} className="btn-primary px-6 py-2">Zurück zum Start</button>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-brand-warm-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full medical-card bg-white p-12"
        >
          <div className="w-20 h-20 bg-brand-success/10 rounded-full flex items-center justify-center text-brand-success mx-auto mb-6">
            <Check className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-4">Vielen Dank!</h1>
          <p className="text-brand-secondary mb-8">
            Ihre Einwilligungserklärung wurde erfolgreich übermittelt. Sie können nun mit der Behandlung beginnen.
          </p>
          <div className="space-y-4">
            <button 
              onClick={() => router.push(`/s/${slug}`)}
              className="btn-primary w-full py-3"
            >
              Zurück zum Start
            </button>
          </div>
        </motion.div>
        
        {/* Hidden element for PDF generation */}
        <div className="hidden">
          <div ref={pdfRef} className="p-10 bg-white text-black w-[210mm]">
             <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold uppercase">Einwilligungserklärung</h1>
                  <p className="text-sm">VERA NiSV-Compliance System</p>
                </div>
                <div className="text-right text-sm">
                  <p>Datum: {new Date().toLocaleDateString('de-DE')}</p>
                  <p>Klinik: {clinic?.name}</p>
                </div>
             </div>
             
             <div className="space-y-6 text-sm">
                <div className="bg-gray-100 p-4 rounded">
                  <p className="font-bold">Behandlung: {template.name}</p>
                  <p className="mt-1">Kunde: {formData.first_name} {formData.last_name}</p>
                </div>
                
                <div className="space-y-4">
                  {template.content.sections.map((section: any, idx: number) => (
                    <div key={idx} className="space-y-2">
                      <p className="font-bold border-b border-gray-200 pb-1">{section.title}</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {section.fields.map((field: any) => {
                          if (field.type === 'info' || field.type === 'signature') return null;
                          const val = formData[field.id];
                          return (
                            <div key={field.id} className="text-xs">
                              <span className="font-medium">{field.label}:</span> {
                                Array.isArray(val) ? val.join(', ') : 
                                typeof val === 'boolean' ? (val ? 'Ja' : 'Nein') : 
                                val || 'N/A'
                              }
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-10">
                  <p className="font-bold mb-2">Digitale Unterschrift:</p>
                  <div className="border border-black h-32 w-64 flex items-center justify-center">
                    {signatureData && (
                      <img 
                        src={signatureData} 
                        alt="Signature" 
                        className="max-h-full max-w-full"
                      />
                    )}
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-warm-white flex flex-col p-6">
      <div className="max-w-3xl w-full mx-auto">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-brand-secondary mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Zurück
        </button>

        <div className="medical-card bg-white overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-brand-dark text-white p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-display font-bold">Einwilligungserklärung</h1>
                <p className="text-brand-muted text-sm mt-1">VERA NiSV-Compliance Dokumentation</p>
              </div>
              <Shield className="w-10 h-10 text-brand-beige" />
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8 text-sm leading-relaxed text-brand-secondary">
            <div className="p-4 bg-brand-warm-white rounded-brand border border-brand-border">
              <p className="font-bold text-brand-dark">Behandlung: {template.name}</p>
              <p className="mt-1">Datum: {new Date().toLocaleDateString('de-DE')}</p>
            </div>

            {template.content.sections.map((section: any, sIdx: number) => (
              <div key={sIdx} className="space-y-4">
                <h3 className="text-lg font-bold text-brand-dark border-b border-brand-border pb-2">{section.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.fields.map((field: any) => {
                    if (field.type === 'info') {
                      return (
                        <div key={field.id} className="col-span-full p-4 bg-blue-50 text-blue-800 rounded-brand text-xs">
                          {field.text}
                        </div>
                      );
                    }
                    if (field.type === 'signature') return null;

                    return (
                      <div key={field.id} className={field.type === 'checkbox-group' ? 'col-span-full' : ''}>
                        <label className="block text-xs font-bold text-brand-muted uppercase mb-1">
                          {field.label} {field.required && <span className="text-brand-error">*</span>}
                        </label>
                        
                        {field.type === 'checkbox-group' ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                            {field.options.map((opt: string) => (
                              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="w-4 h-4 accent-brand-beige"
                                  onChange={(e) => {
                                    const current = formData[field.id] || [];
                                    const next = e.target.checked 
                                      ? [...current, opt] 
                                      : current.filter((i: string) => i !== opt);
                                    setFormData({ ...formData, [field.id]: next });
                                  }}
                                />
                                <span className="text-sm">{opt}</span>
                              </label>
                            ))}
                          </div>
                        ) : field.type === 'boolean' ? (
                          <div className="flex gap-4 mt-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="radio" 
                                name={field.id} 
                                className="w-4 h-4 accent-brand-beige"
                                onChange={() => setFormData({ ...formData, [field.id]: true })}
                              />
                              <span>Ja</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="radio" 
                                name={field.id} 
                                className="w-4 h-4 accent-brand-beige"
                                onChange={() => setFormData({ ...formData, [field.id]: false })}
                              />
                              <span>Nein</span>
                            </label>
                          </div>
                        ) : (
                          <input 
                            type={field.type}
                            required={field.required}
                            className="w-full px-4 py-2 bg-brand-warm-white border border-brand-border rounded-brand focus:outline-none focus:border-brand-beige"
                            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Signature Area */}
            <div className="pt-8 border-t border-brand-border">
              <p className="font-bold text-brand-dark mb-4">Digitale Unterschrift</p>
              <div className="relative">
                <canvas 
                  ref={canvasRef}
                  width={600}
                  height={200}
                  className="w-full h-48 bg-brand-warm-white border-2 border-dashed border-brand-border rounded-brand cursor-crosshair touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                <button 
                  onClick={clearSignature}
                  className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm text-brand-muted hover:text-brand-error transition-colors"
                  title="Löschen"
                >
                  <Eraser className="w-4 h-4" />
                </button>
                {!hasSigned && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-brand-muted/40 font-serif italic">
                    Hier unterschreiben
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-8 bg-brand-warm-white border-t border-brand-border flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleSubmit}
              disabled={!hasSigned || isSubmitting}
              className="btn-primary flex-1 py-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Wird verarbeitet...</>
              ) : (
                <><Check className="w-5 h-5" /> Dokument signieren</>
              )}
            </button>
            <button className="btn-outline flex-1 py-4 flex items-center justify-center gap-2">
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
