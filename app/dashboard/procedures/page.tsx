'use client';

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@/hooks/use-i18n';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ToggleLeft, 
  ToggleRight,
  Zap,
  Sparkles,
  Droplets,
  Loader2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

export default function ProceduresPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [procedures, setProcedures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProcedure, setEditingProcedure] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    icon: 'Droplets'
  });

  const fetchProcedures = useCallback(async () => {
    try {
      if (!user?.clinicId) return;
      
      const { data, error } = await supabase
        .from('procedures')
        .select('*')
        .eq('clinic_id', user.clinicId)
        .order('name');
      
      if (error) {
        console.error('Supabase fetch error:', error);
        throw error;
      }
      setProcedures(data || []);
    } catch (error: any) {
      console.error('Error fetching procedures:', error);
      const detailedError = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
      console.error('Detailed fetch error string:', detailedError);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.clinicId) {
      fetchProcedures();
    }
  }, [user?.clinicId, fetchProcedures]);

  const getIcon = (iconName: string, procName: string) => {
    if (iconName === 'Zap' || procName.includes('IPL')) return Zap;
    if (iconName === 'Sparkles' || procName.includes('Laser')) return Sparkles;
    return Droplets;
  };

  const handleAddProcedure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.clinicId) return;

    setSaving(true);
    try {
      if (editingProcedure) {
        const { error } = await supabase
          .from('procedures')
          .update({
            name: formData.name,
            category: formData.category,
            description: formData.description,
            icon: formData.icon
          })
          .eq('id', editingProcedure.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('procedures')
          .insert([{
            id: crypto.randomUUID(),
            name: formData.name,
            category: formData.category,
            description: formData.description,
            icon: formData.icon,
            clinic_id: user.clinicId
          }]);

        if (error) throw error;
      }

      setIsModalOpen(false);
      setEditingProcedure(null);
      setFormData({ name: '', category: '', description: '', icon: 'Droplets' });
      fetchProcedures();
    } catch (error: any) {
      console.error('Caught error in handleAddProcedure:', error);
      // Log all properties of the error object
      const detailedError = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
      console.error('Detailed error string:', detailedError);
      
      const errorMsg = error.message || error.details || error.hint || 'Unbekannter Fehler';
      alert(`Fehler beim Speichern: ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (proc: any) => {
    setEditingProcedure(proc);
    setFormData({
      name: proc.name,
      category: proc.category,
      description: proc.description || '',
      icon: proc.icon || 'Droplets'
    });
    setIsModalOpen(true);
  };

  const handleDeleteProcedure = async (id: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diese Behandlung löschen möchten?')) return;

    try {
      const { error } = await supabase
        .from('procedures')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchProcedures();
    } catch (error) {
      console.error('Error deleting procedure:', error);
    }
  };

  const filteredProcedures = procedures.filter(proc => 
    proc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proc.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-display font-bold">{t('dashboard.procedures')}</h1>
          <p className="text-brand-secondary">Verwalten Sie die Behandlungen, die Sie in Ihrem Studio anbieten.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Neue Behandlung
        </button>
      </div>

      <div className="medical-card bg-white p-4 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <input 
            type="text" 
            placeholder="Behandlung suchen..." 
            className="w-full pl-10 pr-4 py-2 bg-brand-warm-white border border-brand-border rounded-brand focus:outline-none focus:border-brand-beige text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProcedures.map((proc, i) => {
          const Icon = getIcon(proc.icon, proc.name);
          return (
            <motion.div 
              key={proc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="medical-card bg-white p-6 flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-warm-white rounded-full flex items-center justify-center text-brand-beige">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{proc.name}</h3>
                    <p className="text-[10px] text-brand-muted font-mono">{proc.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-success uppercase">Aktiv</span>
                  <ToggleRight className="w-6 h-6 text-brand-success cursor-pointer" />
                </div>
              </div>

              <p className="text-sm text-brand-secondary mb-6 flex-1">{proc.description}</p>

              <div className="pt-6 border-t border-brand-border flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-brand-muted uppercase">Formular-Kategorie:</span>
                  <span className="text-[10px] bg-brand-warm-white px-2 py-0.5 rounded border-brand-border font-bold text-brand-beige">
                    {proc.category}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditClick(proc)}
                    className="p-2 hover:bg-brand-warm-white rounded-brand text-brand-beige"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteProcedure(proc.id)}
                    className="p-2 hover:bg-red-50 rounded-brand text-brand-error"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Procedure Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-brand-border flex justify-between items-center bg-white shrink-0">
                <h2 className="text-xl font-display font-bold">
                  {editingProcedure ? 'Behandlung bearbeiten' : 'Neue Behandlung hinzufügen'}
                </h2>
                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingProcedure(null);
                    setFormData({ name: '', category: '', description: '', icon: 'Droplets' });
                  }} 
                  className="p-2 hover:bg-brand-warm-white rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddProcedure} className="p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-sm font-bold mb-1">Name der Behandlung</label>
                  <input 
                    required
                    type="text" 
                    placeholder="z.B. Laser Haarentfernung"
                    className="w-full px-4 py-2 bg-brand-warm-white border border-brand-border rounded-brand focus:outline-none focus:border-brand-beige"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Formular-Kategorie</label>
                  <select 
                    required
                    className="w-full px-4 py-2 bg-brand-warm-white border border-brand-border rounded-brand focus:outline-none focus:border-brand-beige"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Kategorie wählen...</option>
                    <option value="anamnese">Anamnese</option>
                    <option value="laser">Laser</option>
                    <option value="peeling">Peeling</option>
                    <option value="ipl">IPL</option>
                    <option value="microneedling">Microneedling</option>
                    <option value="rf">Radiofrequenz</option>
                    <option value="ultraschall">Ultraschall</option>
                    <option value="classic">Klassisch</option>
                  </select>
                  <p className="text-[10px] text-brand-muted mt-1">Bestimmt, welches Aufklärungsformular der Kunde unterschreiben muss.</p>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Beschreibung</label>
                  <textarea 
                    rows={3}
                    placeholder="Kurze Beschreibung für den Kunden..."
                    className="w-full px-4 py-2 bg-brand-warm-white border border-brand-border rounded-brand focus:outline-none focus:border-brand-beige resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Icon</label>
                  <div className="flex gap-4">
                    {[
                      { name: 'Droplets', icon: Droplets },
                      { name: 'Zap', icon: Zap },
                      { name: 'Sparkles', icon: Sparkles }
                    ].map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: item.name })}
                        className={`flex-1 p-3 rounded-brand border flex flex-col items-center gap-1 transition-all ${
                          formData.icon === item.name 
                            ? 'bg-brand-beige/10 border-brand-beige text-brand-beige' 
                            : 'bg-brand-warm-white border-brand-border text-brand-muted hover:border-brand-beige/50'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 flex gap-3 mt-4 border-t border-brand-border">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 border border-brand-border rounded-brand font-bold hover:bg-brand-warm-white transition-colors text-brand-dark"
                  >
                    Abbrechen
                  </button>
                  <button 
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-3 bg-brand-beige text-white rounded-brand font-bold hover:opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Speichern
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
