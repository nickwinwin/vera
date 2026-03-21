'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/hooks/use-i18n';
import { Search, Filter, Plus, Info, CheckCircle2, Shield } from 'lucide-react';
import proceduresData from '@/data/procedures.json';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

export default function EquipmentCatalog() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [addedEquipment, setAddedEquipment] = useState<string[]>([]);

  // Filter out anamnese as it's not a device category
  const templates = proceduresData.filter(p => p.id !== 'anamnese');

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleAdd = async (template: any) => {
    if (!user?.clinicId) {
      toast.error('Bitte melden Sie sich an');
      return;
    }

    try {
      const { error } = await supabase
        .from('equipment')
        .insert([{
          clinic_id: user.clinicId,
          name: template.name,
          type: template.id,
          status: 'active',
          next_maintenance: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }]);

      if (error) throw error;

      setAddedEquipment([...addedEquipment, template.id]);
      toast.success(`${template.name} zum Studio hinzugefügt`);
    } catch (error) {
      console.error('Error adding equipment:', error);
      toast.error('Fehler beim Hinzufügen des Geräts');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">{t('dashboard.catalog')}</h1>
          <p className="text-brand-secondary">Wählen Sie NiSV-Kategorien aus, um sie Ihrem Institut hinzuzufügen.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="medical-card p-4 bg-white flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <input 
            type="text" 
            placeholder="Kategorie suchen..." 
            className="w-full pl-10 pr-4 py-2 bg-brand-warm-white border border-brand-border rounded-brand focus:outline-none focus:border-brand-beige text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, i) => (
          <motion.div 
            key={template.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="medical-card bg-white overflow-hidden flex flex-col"
          >
            <div className="h-48 bg-brand-warm-white relative flex items-center justify-center p-8">
              <Shield className="w-24 h-24 text-brand-beige/20" />
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                NiSV Template
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold mb-2">{template.name}</h3>
              <p className="text-sm text-brand-muted mb-6 flex-1">{template.description}</p>
              
              <button 
                onClick={() => handleAdd(template)}
                disabled={addedEquipment.includes(template.id)}
                className={`w-full py-3 rounded-brand font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  addedEquipment.includes(template.id)
                  ? 'bg-brand-success/10 text-brand-success cursor-default'
                  : 'bg-brand-beige text-white hover:bg-brand-beige/90 shadow-sm hover:shadow-md'
                }`}
              >
                {addedEquipment.includes(template.id) ? (
                  <><CheckCircle2 className="w-4 h-4" /> Hinzugefügt</>
                ) : (
                  <><Plus className="w-4 h-4" /> Zum Institut hinzufügen</>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
