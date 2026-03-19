'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/hooks/use-i18n';
import { Search, Filter, Plus, Info, CheckCircle2 } from 'lucide-react';
import equipmentData from '@/data/equipment.json';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

export default function EquipmentCatalog() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [addedEquipment, setAddedEquipment] = useState<string[]>([]);

  const categories = ['All', ...Array.from(new Set(equipmentData.map(e => e.category)))];

  const filteredEquipment = equipmentData.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         e.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = async (device: any) => {
    if (!user?.clinicId) {
      toast.error('Bitte melden Sie sich an');
      return;
    }

    try {
      const { error } = await supabase
        .from('equipment')
        .insert([{
          clinic_id: user.clinicId,
          name: device.name,
          type: device.category,
          status: 'active',
          next_maintenance: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 year from now
        }]);

      if (error) throw error;

      setAddedEquipment([...addedEquipment, device.id]);
      toast.success(`${device.name} zum Studio hinzugefügt`);
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
          <p className="text-brand-secondary">Wählen Sie Ihre Geräte aus unserem umfangreichen Katalog.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="medical-card p-4 bg-white flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <input 
            type="text" 
            placeholder="Gerät oder Hersteller suchen..." 
            className="w-full pl-10 pr-4 py-2 bg-brand-warm-white border border-brand-border rounded-brand focus:outline-none focus:border-brand-beige text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-muted" />
          <select 
            className="bg-brand-warm-white border border-brand-border rounded-brand px-4 py-2 text-sm focus:outline-none focus:border-brand-beige"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((device, i) => (
          <motion.div 
            key={device.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="medical-card bg-white overflow-hidden flex flex-col"
          >
            <div className="h-48 bg-brand-warm-white relative flex items-center justify-center p-8">
              <ShieldCheckIcon className="w-24 h-24 text-brand-beige/20" />
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                {device.category}
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-4">
                <p className="text-xs font-bold text-brand-beige uppercase tracking-widest mb-1">{device.manufacturer}</p>
                <h3 className="text-xl font-bold">{device.name}</h3>
              </div>
              
              <div className="space-y-2 mb-6 flex-1">
                <p className="text-xs font-bold text-brand-muted uppercase">Erforderliche Dokumente:</p>
                <div className="flex flex-wrap gap-2">
                  {device.required_documents.map((doc, idx) => (
                    <span key={idx} className="text-[10px] bg-brand-warm-white border border-brand-border px-2 py-1 rounded text-brand-secondary">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="btn-outline flex-1 py-2 text-sm flex items-center justify-center gap-2">
                  <Info className="w-4 h-4" /> Details
                </button>
                {addedEquipment.includes(device.id) ? (
                  <button className="bg-brand-success text-white flex-1 py-2 rounded-brand text-sm flex items-center justify-center gap-2 cursor-default">
                    <CheckCircle2 className="w-4 h-4" /> Hinzugefügt
                  </button>
                ) : (
                  <button 
                    onClick={() => handleAdd(device)}
                    className="btn-primary flex-1 py-2 text-sm flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Hinzufügen
                  </button>
                )}
              </div>
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
