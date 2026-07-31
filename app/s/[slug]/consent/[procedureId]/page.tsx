'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useI18n } from '@/hooks/use-i18n';
import { Shield, Check, Eraser, Download, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion } from 'motion/react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';
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
  const [savedDocId, setSavedDocId] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplateAndClinic();

    // Merge health data from the forms page into formData
    const healthData = sessionStorage.getItem(`health_${slug}`);
    if (healthData) {
      try {
        const parsed = JSON.parse(healthData);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch {}
    }

    // Pre-fill client info from auth page
    const clientData = sessionStorage.getItem(`client_${slug}`);
    if (clientData) {
      try {
        const parsed = JSON.parse(clientData);
        setFormData(prev => ({ ...prev, first_name: parsed.first_name, last_name: parsed.last_name, email: parsed.email }));
      } catch {}
    }
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
      if (error instanceof DOMException && error.name === 'AbortError') {
        toast.error('Der Server antwortet nicht. Bitte versuchen Sie es später erneut.');
      } else {
        toast.error(error.message || 'Fehler beim Laden des Formulars.');
      }
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
    const element = document.getElementById('pdf-content');
    if (!element) return;

    try {
      toast.loading('PDF wird generiert...');
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
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
    let consentDocId: string | undefined;
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
      const { error: docError, data: docData } = await supabase
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
        })
        .select('id')
        .single();

      if (docError) throw docError;

      consentDocId = docData?.id;

      // 3. Generate and upload PDF
      try {
        const element = document.getElementById('pdf-content');
        if (element) {
          const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' });
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          const pdfBlob = pdf.output('blob');
          const filePath = `${clinic.id}/${consentDocId}_${Date.now()}.pdf`;
          const { error: uploadError } = await supabase.storage
            .from('consent-pdfs')
            .upload(filePath, pdfBlob, { contentType: 'application/pdf' });
          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('consent-pdfs')
              .getPublicUrl(filePath);
            await supabase.from('consent_documents').update({ pdf_url: publicUrl }).eq('id', consentDocId);
          }
        }
      } catch (pdfError) {
        console.error('PDF generation/upload error:', pdfError);
      }

      setIsCompleted(true);
      if (consentDocId) setSavedDocId(consentDocId);
      toast.success('Einwilligung erfolgreich übermittelt');

      // If this was the anamnese, redirect to procedure selection after a short delay
      if (template.category === 'anamnese') {
        setTimeout(() => {
          router.push(`/s/${slug}/procedures`);
        }, 2000);
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      if (error instanceof DOMException && error.name === 'AbortError') {
        toast.error('Der Server antwortet nicht. Bitte versuchen Sie es später erneut.');
      } else {
        toast.error('Fehler beim Speichern der Einwilligung.');
      }
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
    const qrValue = typeof window !== 'undefined' ? `${window.location.origin}/s/${slug}/consent/view/${savedDocId}` : '';

    return (
      <div className="min-h-screen bg-brand-warm-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full medical-card bg-white p-12"
        >
          <div className="w-20 h-20 bg-[#4A9B6F]/10 rounded-full flex items-center justify-center text-[#4A9B6F] mx-auto mb-6">
            <Check className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-4">Vielen Dank!</h1>
          <p className="text-brand-secondary mb-8">
            Ihre Einwilligungserklärung wurde erfolgreich übermittelt. Sie können nun mit der Behandlung beginnen.
          </p>
          <div className="space-y-4">
            {template.category === 'anamnese' ? (
              <div className="space-y-4">
                {savedDocId && (
                  <div className="bg-[#F8F6F2] border border-[#E8E2D9] rounded-[8px] p-6 flex flex-col items-center gap-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#555555]">Ihr Anamnesen-QR-Code</p>
                    <QRCodeSVG value={qrValue} size={140} level="H" />
                    <p className="text-[10px] text-[#999999]">Diesen Code beim nächsten Besuch vorzeigen</p>
                  </div>
                )}
                <p className="text-brand-secondary text-sm animate-pulse">
                  Sie werden automatisch weitergeleitet...
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <button 
                  onClick={() => router.push(`/s/${slug}`)}
                  className="bg-[#C9A84C] text-white px-6 py-2 rounded-[8px] hover:opacity-90 transition-all font-medium w-full py-3"
                >
                  Zurück zum Start
                </button>
                <button 
                  onClick={generatePDF}
                  className="border border-[#C9A84C] text-[#C9A84C] px-6 py-2 rounded-[8px] hover:bg-[#C9A84C] hover:text-white transition-all font-medium w-full py-3 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> PDF herunterladen
                </button>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Hidden element for PDF generation */}
        <div style={{ display: 'none' }}>
          <div id="pdf-content" style={{ padding: '40px', background: '#ffffff', color: '#000000', width: '210mm' }}>
            <div style={{ borderBottom: '2px solid #000000', paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase' }}>Einwilligungserklärung</h1>
                <p style={{ fontSize: '14px' }}>VERA NiSV-Compliance System</p>
              </div>
              <div style={{ textAlign: 'right', fontSize: '14px' }}>
                <p>Datum: {new Date().toLocaleDateString('de-DE')}</p>
                <p>Klinik: {clinic?.name}</p>
              </div>
            </div>
            
            <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
              <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
                <p style={{ fontWeight: 'bold' }}>Behandlung: {template.name}</p>
                <p style={{ marginTop: '4px' }}>Kunde: {formData.first_name} {formData.last_name}</p>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                {template.content.sections.map((section: any, idx: number) => (
                  <div key={idx} style={{ marginBottom: '16px' }}>
                    <p style={{ fontWeight: 'bold', borderBottom: '1px solid #e0e0e0', paddingBottom: '4px', marginBottom: '8px' }}>{section.title}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
                      {section.fields.map((field: any) => {
                        if (field.type === 'info' || field.type === 'signature') return null;
                        const val = formData[field.id];
                        return (
                          <div key={field.id} style={{ fontSize: '12px' }}>
                            <span style={{ fontWeight: '500' }}>{field.label}:</span>{' '}
                            {Array.isArray(val) ? val.join(', ') : typeof val === 'boolean' ? (val ? 'Ja' : 'Nein') : val || 'N/A'}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{ paddingTop: '40px' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Digitale Unterschrift:</p>
                <div style={{ border: '1px solid #000000', height: '128px', width: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {signatureData && (
                    <img src={signatureData} alt="Signature" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                  )}
                </div>
                {savedDocId && (
                  <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e0e0e0' }}>
                    <p style={{ fontSize: '12px', color: '#666666' }}>QR-Code-ID: {savedDocId}</p>
                  </div>
                )}
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
                            {field.options.map((opt: string) => {
                              const checked = (formData[field.id] || []).includes(opt);
                              return (
                                <label
                                  key={opt}
                                  className={`flex items-center gap-3 p-3 border rounded-brand cursor-pointer transition-all select-none ${
                                    checked
                                      ? 'border-brand-beige bg-brand-beige/5 ring-1 ring-brand-beige'
                                      : 'border-brand-border hover:border-brand-beige hover:bg-brand-warm-white'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    className="w-4 h-4 accent-brand-beige pointer-events-none"
                                    checked={checked}
                                    onChange={(e) => {
                                      const current = formData[field.id] || [];
                                      const next = e.target.checked
                                        ? [...current, opt]
                                        : current.filter((i: string) => i !== opt);
                                      setFormData({ ...formData, [field.id]: next });
                                    }}
                                  />
                                  <span className="text-sm font-medium">{opt}</span>
                                </label>
                              );
                            })}
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
            <button
              onClick={() => {
                sessionStorage.removeItem('vera_client_session');
                router.push(`/s/${slug}/procedures`);
              }}
              className="btn-outline flex-1 py-4 flex items-center justify-center gap-2"
            >
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
