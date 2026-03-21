'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useI18n } from '@/hooks/use-i18n';
import { 
  ArrowLeft, 
  Shield, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  X,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

export default function EquipmentDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const { user } = useAuth();
  
  const [device, setDevice] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', serial_number: '' });

  useEffect(() => {
    if (user?.clinicId && id) {
      fetchDeviceData();
    }
  }, [user, id]);

  const fetchDeviceData = async () => {
    try {
      const [deviceRes, docsRes] = await Promise.all([
        supabase.from('equipment').select('*').eq('id', id).single(),
        supabase.from('equipment_documents').select('*').eq('equipment_id', id)
      ]);

      if (deviceRes.error) throw deviceRes.error;
      setDevice(deviceRes.data);
      setEditData({ 
        name: deviceRes.data.name, 
        serial_number: deviceRes.data.serial_number || '' 
      });
      setDocuments(docsRes.data || []);
    } catch (error) {
      console.error('Error fetching device data:', error);
      toast.error('Fehler beim Laden der Gerätedaten');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDevice = async () => {
    try {
      const { error } = await supabase
        .from('equipment')
        .update({
          name: editData.name,
          serial_number: editData.serial_number
        })
        .eq('id', id);

      if (error) throw error;
      toast.success('Gerätedaten aktualisiert');
      setIsEditing(false);
      fetchDeviceData();
    } catch (error) {
      console.error('Error updating device:', error);
      toast.error('Fehler beim Aktualisieren');
    }
  };

  const handleUpload = async (docType: string) => {
    setUploading(docType);
    
    // Simulate file selection and upload for now, but save to DB
    // In a real app, we would use an <input type="file">
    try {
      const { error } = await supabase
        .from('equipment_documents')
        .insert([{
          equipment_id: id,
          clinic_id: user!.clinicId,
          name: docType,
          type: docType,
          file_url: 'https://placeholder.com/doc.pdf', // Mock URL for now
          status: 'valid'
        }]);

      if (error) throw error;
      
      toast.success(`${docType} erfolgreich hochgeladen`);
      fetchDeviceData();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Fehler beim Hochladen');
    } finally {
      setUploading(null);
    }
  };

  const handleDeleteDoc = async (docId: string) => {
    if (!confirm('Dokument wirklich löschen?')) return;
    
    try {
      const { error } = await supabase
        .from('equipment_documents')
        .delete()
        .eq('id', docId);

      if (error) throw error;
      toast.success('Dokument gelöscht');
      fetchDeviceData();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Fehler beim Löschen');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-brand-beige animate-spin" />
      </div>
    );
  }

  if (!device) return <div>Gerät nicht gefunden.</div>;

  // Define required docs based on type (simplified)
  const requiredDocs = ['CE-Zertifikat', 'Bedienungsanleitung', 'Wartungsprotokoll'];
  const uploadedTypes = documents.map(d => d.type);
  const isCompliant = requiredDocs.every(type => uploadedTypes.includes(type));

  return (
    <div className="space-y-8">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-brand-secondary hover:text-brand-beige transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Zurück zur Übersicht
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-brand-warm-white rounded-xl flex items-center justify-center text-brand-beige border border-brand-border">
            <Shield className="w-10 h-10" />
          </div>
          <div>
            <p className="text-sm font-bold text-brand-beige uppercase tracking-widest">{device.type}</p>
            <h1 className="text-3xl font-display font-bold">{device.name}</h1>
            <p className="text-brand-secondary">S/N: {device.serial_number || 'Nicht angegeben'}</p>
          </div>
        </div>
        
        <div className="medical-card bg-white px-6 py-4 flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-brand-muted uppercase font-bold">Compliance-Status</p>
            <p className={`text-sm font-bold ${isCompliant ? 'text-brand-success' : 'text-orange-500'}`}>
              {isCompliant ? 'Vollständig' : 'Unvollständig'}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isCompliant ? 'bg-brand-success/10 text-brand-success' : 'bg-orange-100 text-orange-500'}`}>
            {isCompliant ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold">Erforderliche Dokumente</h2>
          <div className="space-y-4">
            {requiredDocs.map((doc, i) => {
              const uploadedDoc = documents.find(d => d.type === doc);
              const isUploaded = !!uploadedDoc;
              const isUploading = uploading === doc;

              return (
                <motion.div 
                  key={doc}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="medical-card bg-white p-6 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isUploaded ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-warm-white text-brand-muted'}`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold">{doc}</p>
                      <p className="text-xs text-brand-muted">
                        {isUploaded ? `Hochgeladen am ${new Date(uploadedDoc.created_at).toLocaleDateString('de-DE')}` : 'Gültigkeit: Unbegrenzt'}
                      </p>
                    </div>
                  </div>

                  <div>
                    {isUploaded ? (
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-brand-success flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Hochgeladen
                        </span>
                        <a href={uploadedDoc.file_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-brand-beige hover:underline">Ansehen</a>
                        <button 
                          onClick={() => handleDeleteDoc(uploadedDoc.id)}
                          className="p-2 hover:bg-red-50 text-brand-error rounded-brand"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleUpload(doc)}
                        disabled={isUploading}
                        className="btn-outline py-2 px-4 text-sm flex items-center gap-2 disabled:opacity-50"
                      >
                        {isUploading ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Lädt...</>
                        ) : (
                          <><Upload className="w-4 h-4" /> Hochladen</>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold">Geräte-Info</h2>
          <div className="medical-card bg-white p-6 space-y-4">
            <div>
              <p className="text-xs text-brand-muted uppercase font-bold">Seriennummer</p>
              <p className="text-sm font-medium">{device.serial_number || 'Nicht angegeben'}</p>
            </div>
            <div>
              <p className="text-xs text-brand-muted uppercase font-bold">Status</p>
              <p className="text-sm font-medium uppercase">{device.status}</p>
            </div>
            <div>
              <p className="text-xs text-brand-muted uppercase font-bold">Nächste Wartung</p>
              <p className="text-sm font-medium">{device.next_maintenance ? new Date(device.next_maintenance).toLocaleDateString('de-DE') : 'Nicht geplant'}</p>
            </div>
            <div className="pt-4 border-t border-brand-border">
              <button 
                onClick={() => setIsEditing(true)}
                className="btn-outline w-full py-2 text-sm"
              >
                Gerätedaten bearbeiten
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-brand-border flex justify-between items-center">
                <h3 className="text-xl font-bold">Gerät bearbeiten</h3>
                <button onClick={() => setIsEditing(false)} className="text-brand-muted hover:text-brand-dark">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-brand-muted mb-1 block">Gerätename</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-brand-warm-white border border-brand-border rounded-brand focus:outline-none focus:border-brand-beige"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-brand-muted mb-1 block">Seriennummer</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-brand-warm-white border border-brand-border rounded-brand focus:outline-none focus:border-brand-beige"
                    value={editData.serial_number}
                    onChange={(e) => setEditData({ ...editData, serial_number: e.target.value })}
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button onClick={() => setIsEditing(false)} className="btn-outline flex-1 py-2">Abbrechen</button>
                  <button onClick={handleUpdateDevice} className="btn-primary flex-1 py-2">Speichern</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
