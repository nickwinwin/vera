'use client';

import { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDocuments() {
  const [searchTerm, setSearchTerm] = useState('');

  const docTypes = [
    { id: 1, name: 'Fachkundenachweis', category: 'NiSV-Qualifikation', requiredFor: 'Laser, IPL, RF', status: 'active' },
    { id: 2, name: 'Gefährdungsbeurteilung', category: 'Arbeitsschutz', requiredFor: 'Alle Geräte', status: 'active' },
    { id: 3, name: 'Anlagenbuch', category: 'Dokumentation', requiredFor: 'NiSV-Geräte', status: 'active' },
    { id: 4, name: 'Wartungsprotokoll', category: 'Instandhaltung', requiredFor: 'Alle Geräte', status: 'active' },
    { id: 5, name: 'Laserschutzbeauftragter', category: 'Sicherheit', requiredFor: 'Klasse 3B & 4 Laser', status: 'active' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold">Dokumententypen</h1>
          <p className="text-brand-secondary">Definieren Sie die erforderlichen Dokumente pro Gerätekategorie.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Neuen Typ anlegen
        </button>
      </div>

      <div className="medical-card bg-white overflow-hidden">
        <div className="p-4 border-b border-brand-border">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            <input 
              type="text" 
              placeholder="Dokumententyp suchen..." 
              className="w-full pl-10 pr-4 py-2 bg-brand-warm-white border border-brand-border rounded-brand focus:outline-none focus:border-brand-beige text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-warm-white border-b border-brand-border">
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Kategorie</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Erforderlich für</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {docTypes.map((doc) => (
                <tr key={doc.id} className="hover:bg-brand-warm-white/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-brand-beige" />
                      <span className="text-sm font-bold">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-brand-secondary">{doc.category}</td>
                  <td className="px-6 py-4 text-sm text-brand-secondary">{doc.requiredFor}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-success uppercase">
                      <CheckCircle2 className="w-3 h-3" /> {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-brand-warm-white rounded-brand text-brand-beige">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-brand text-brand-error">
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
