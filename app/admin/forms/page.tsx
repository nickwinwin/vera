'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  LayoutGrid,
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Eye,
  Loader2,
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminForms() {
  const [searchTerm, setSearchTerm] = useState('');
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data } = await supabase.from('form_templates').select('*').order('name');
      if (data && data.length > 0) {
        setTemplates(data);
      } else {
        setTemplates([
          { id: 1, name: 'IPL Einwilligung', type: 'Consent', version: '1.2', status: 'active', lastUpdate: '12.02.2026' },
          { id: 2, name: 'Laser Haarentfernung', type: 'Consent', version: '2.0', status: 'active', lastUpdate: '01.03.2026' },
          { id: 3, name: 'Allgemeine Anamnese', type: 'Questionnaire', version: '1.0', status: 'active', lastUpdate: '10.01.2025' },
          { id: 4, name: 'Hautsensibilität', type: 'Questionnaire', version: '1.1', status: 'active', lastUpdate: '15.01.2025' },
          { id: 5, name: 'Microneedling Einwilligung', type: 'Consent', version: '1.0', status: 'draft', lastUpdate: '04.03.2026' },
        ]);
      }
    } catch {
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = templates.filter((t: any) =>
    t.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold">Formular-Templates</h1>
          <p className="text-brand-secondary">Verwalten Sie die rechtssicheren Vorlagen für Einwilligungserklärungen.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Neues Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-brand-beige" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center py-12 text-brand-secondary">Keine Templates vorhanden.</div>
        ) : filtered.map((template, i) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="medical-card bg-white p-6 flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg bg-brand-warm-white text-brand-beige">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${template.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {template.status}
              </span>
            </div>
            <h3 className="text-lg font-bold mb-1">{template.name}</h3>
            <p className="text-xs text-brand-muted mb-6">{template.type} • v{template.version}</p>
            <div className="mt-auto pt-6 border-t border-brand-border flex items-center justify-between">
              <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest">
                Update: {template.lastUpdate || template.created_at ? new Date(template.created_at).toLocaleDateString('de-DE') : 'N/A'}
              </p>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-brand-warm-white rounded-brand text-brand-muted"><Eye className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-brand-warm-white rounded-brand text-brand-beige"><Edit2 className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-brand-warm-white rounded-brand text-brand-muted"><Copy className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}