'use client';

import { useState } from 'react';
import { 
  Shield, 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2, 
  FileText,
  CheckCircle2
} from 'lucide-react';
import equipmentData from '@/data/equipment.json';
import { motion } from 'motion/react';

export default function AdminEquipment() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold">Gerätekatalog CRUD</h1>
          <p className="text-brand-secondary">Verwalten Sie die globale Datenbank der NiSV-relevanten Geräte.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Neues Gerät anlegen
        </button>
      </div>

      <div className="medical-card bg-white overflow-hidden">
        <div className="p-4 border-b border-brand-border flex flex-col md:flex-row gap-4">
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
          <div className="flex gap-2">
            <button className="btn-outline py-2 px-4 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4" /> Kategorie
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-warm-white border-b border-brand-border">
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Gerät</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Kategorie</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Erforderliche Dokumente</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {equipmentData.map((device) => (
                <tr key={device.id} className="hover:bg-brand-warm-white/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-warm-white flex items-center justify-center text-brand-beige">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{device.name}</p>
                        <p className="text-xs text-brand-muted">{device.manufacturer}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-brand-secondary bg-brand-warm-white px-2 py-1 rounded border border-brand-border">
                      {device.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {device.required_documents.map((doc, idx) => (
                        <span key={idx} className="text-[9px] font-bold text-brand-muted uppercase tracking-tighter bg-white border border-brand-border px-1.5 py-0.5 rounded">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-brand-warm-white rounded-brand text-brand-beige" title="Bearbeiten">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-brand text-brand-error" title="Löschen">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
