'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/hooks/use-i18n';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Zap, 
  Activity,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  ChevronRight,
  Save,
  X,
  Eye,
  Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export default function TreatmentLogsPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Treatment details form state
  const [details, setDetails] = useState({
    treatment: '',
    iop: '',
    frequency: '',
    cooling: '',
    zone: '',
    energy: '',
    notes: '',
    performed_by_name: ''
  });

  useEffect(() => {
    if (user?.clinicId) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('consent_documents')
        .select(`
          *,
          clients (first_name, last_name)
        `)
        .eq('clinic_id', user!.clinicId)
        .order('signed_at', { ascending: false });
      
      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Fehler beim Laden der Behandlungen');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = (doc: any) => {
    setSelectedDoc(doc);
    setDetails({
      treatment: doc.treatment_details?.treatment || doc.procedure_name || '',
      iop: doc.treatment_details?.iop || '',
      frequency: doc.treatment_details?.frequency || '',
      cooling: doc.treatment_details?.cooling || '',
      zone: doc.treatment_details?.zone || '',
      energy: doc.treatment_details?.energy || '',
      notes: doc.treatment_details?.notes || '',
      performed_by_name: doc.treatment_details?.performed_by_name || ''
    });
  };

  const handleSaveDetails = async () => {
    if (!selectedDoc) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('consent_documents')
        .update({
          treatment_details: details,
          performed_by: user!.id
        })
        .eq('id', selectedDoc.id);

      if (error) throw error;
      toast.success('Behandlungsdaten gespeichert');
      fetchDocuments();
      setSelectedDoc(null);
    } catch (error: any) {
      console.error('Error saving details:', error);
      toast.error(`Fehler beim Speichern: ${error.message || 'Unbekannter Fehler'}`);
    } finally {
      setSaving(false);
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.procedure_name !== 'Allgemeiner Anamnesebogen' && (
      `${doc.clients?.first_name} ${doc.clients?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.procedure_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getAnamneseForClient = (clientId: string) => {
    return documents.find(doc => 
      doc.client_id === clientId && 
      doc.procedure_name === 'Allgemeiner Anamnesebogen'
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-brand-beige animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold">Behandlungs-Logbuch</h1>
          <p className="text-brand-secondary">Dokumentieren Sie die technischen Parameter jeder Behandlung.</p>
        </div>
      </div>

      <div className="medical-card bg-white overflow-hidden">
        <div className="p-4 border-b border-brand-border">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            <input 
              type="text" 
              placeholder="Kunde oder Behandlung suchen..." 
              className="w-full pl-10 pr-4 py-2 bg-brand-warm-white border border-brand-border rounded-brand focus:outline-none focus:border-brand-beige text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-warm-white text-brand-muted text-[10px] uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Datum</th>
                <th className="px-6 py-4 font-bold">Kunde</th>
                <th className="px-6 py-4 font-bold">Behandlung</th>
                <th className="px-6 py-4 font-bold">Anamnese</th>
                <th className="px-6 py-4 font-bold">Behandlungsformular</th>
                <th className="px-6 py-4 font-bold">Parameter</th>
                <th className="px-6 py-4 font-bold text-right">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filteredDocs.map((doc) => {
                const anamneseDoc = getAnamneseForClient(doc.client_id);
                
                return (
                  <tr key={doc.id} className="hover:bg-brand-warm-white/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-brand-muted" />
                        {new Date(doc.signed_at).toLocaleDateString('de-DE')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-sm">{doc.clients?.first_name} {doc.clients?.last_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-brand-beige"></div>
                        <span className="text-sm font-medium">{doc.procedure_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {anamneseDoc ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase">
                            <CheckCircle2 className="w-3 h-3" /> Erfasst
                          </span>
                          <button 
                            onClick={() => window.open(`/s/${user?.clinicSlug}/consent/view/${anamneseDoc.id}`, '_blank')}
                            className="p-1 text-brand-muted hover:text-brand-beige transition-colors"
                            title="Ansehen"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-brand-muted italic">Nicht vorhanden</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase">
                          <CheckCircle2 className="w-3 h-3" /> Erfasst
                        </span>
                        <button 
                          onClick={() => window.open(`/s/${user?.clinicSlug}/consent/view/${doc.id}`, '_blank')}
                          className="p-1 text-brand-muted hover:text-brand-beige transition-colors"
                          title="Ansehen"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {doc.treatment_details?.energy ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase">
                          <CheckCircle2 className="w-3 h-3" /> Erfasst
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold uppercase">
                          <Clock className="w-3 h-3" /> Ausstehend
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleOpenDetails(doc)}
                        className="btn-primary py-1.5 px-3 text-[10px] flex items-center gap-1 ml-auto"
                      >
                        <Edit3 className="w-3 h-3" /> Parameter
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="bg-brand-dark text-white p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-display font-bold">Behandlungs-Parameter</h2>
                  <p className="text-brand-muted text-xs mt-1">
                    {selectedDoc.clients?.first_name} {selectedDoc.clients?.last_name} • {selectedDoc.procedure_name}
                  </p>
                </div>
                <button onClick={() => setSelectedDoc(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-muted uppercase mb-1">Behandlung</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="z.B. Laser"
                      value={details.treatment}
                      onChange={(e) => setDetails({...details, treatment: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-muted uppercase mb-1">I o. P</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="I oder P"
                      value={details.iop}
                      onChange={(e) => setDetails({...details, iop: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-muted uppercase mb-1">Frequenz</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="z.B. 10 Hz"
                      value={details.frequency}
                      onChange={(e) => setDetails({...details, frequency: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-muted uppercase mb-1">Kühlung</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="z.B. Stufe 3"
                      value={details.cooling}
                      onChange={(e) => setDetails({...details, cooling: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-muted uppercase mb-1">Behandlungszone</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="z.B. Gesicht"
                      value={details.zone}
                      onChange={(e) => setDetails({...details, zone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-muted uppercase mb-1">Energie j/cm²</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="z.B. 25"
                      value={details.energy}
                      onChange={(e) => setDetails({...details, energy: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-muted uppercase mb-1">Behandler (Team-Mitglied)</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="Name des Behandlers"
                      value={details.performed_by_name}
                      onChange={(e) => setDetails({...details, performed_by_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-muted uppercase mb-1">Bemerkung</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="Besonderheiten..."
                      value={details.notes}
                      onChange={(e) => setDetails({...details, notes: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-brand-warm-white border-t border-brand-border flex gap-3">
                <button 
                  onClick={() => setSelectedDoc(null)}
                  className="flex-1 py-3 border border-brand-border rounded-brand font-bold hover:bg-white transition-colors"
                >
                  Abbrechen
                </button>
                <button 
                  onClick={handleSaveDetails}
                  disabled={saving}
                  className="flex-1 py-3 bg-brand-beige text-white rounded-brand font-bold hover:opacity-90 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Parameter speichern
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
