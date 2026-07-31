'use client';

import { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  MoreVertical, 
  ExternalLink, 
  ShieldCheck,
  Ban,
  Trash2
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminClinics() {
  const [searchTerm, setSearchTerm] = useState('');

  const clinics = [
    { id: 1, name: 'Beauty Lounge Berlin', owner: 'Max Mustermann', plan: 'Professional', status: 'active', date: '12.01.2025', clients: 124 },
    { id: 2, name: 'Skin Experts Hamburg', owner: 'Dr. Sarah Weber', plan: 'Enterprise', status: 'active', date: '05.02.2025', clients: 450 },
    { id: 3, name: 'Pure Glow Munich', owner: 'Elena Fischer', plan: 'Basic', status: 'suspended', date: '20.02.2025', clients: 45 },
    { id: 4, name: 'Laser Center Cologne', owner: 'Marc Wagner', plan: 'Professional', status: 'active', date: '01.03.2025', clients: 89 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold">Klinik-Verwaltung</h1>
          <p className="text-brand-secondary">Verwalten Sie alle registrierten Studios und deren Status.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" /> Neue Klinik anlegen
        </button>
      </div>

      <div className="medical-card bg-white overflow-hidden">
        <div className="p-4 border-b border-brand-border flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            <input 
              type="text" 
              placeholder="Klinik oder Inhaber suchen..." 
              className="w-full pl-10 pr-4 py-2 bg-brand-warm-white border border-brand-border rounded-brand focus:outline-none focus:border-brand-beige text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="btn-outline py-2 px-4 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-warm-white border-b border-brand-border">
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Klinik</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Inhaber</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Kunden</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {clinics.map((clinic) => (
                <tr key={clinic.id} className="hover:bg-brand-warm-white/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-warm-white flex items-center justify-center text-brand-beige font-bold">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{clinic.name}</p>
                        <p className="text-xs text-brand-muted">Seit {clinic.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{clinic.owner}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${clinic.plan === 'Enterprise' ? 'bg-purple-100 text-purple-700' : clinic.plan === 'Professional' ? 'bg-brand-beige/10 text-brand-beige' : 'bg-gray-100 text-gray-600'}`}>
                      {clinic.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${clinic.status === 'active' ? 'bg-brand-success' : 'bg-brand-error'}`} />
                      <span className="text-xs font-medium capitalize">{clinic.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{clinic.clients}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-brand-warm-white rounded-brand text-brand-beige" title="Dashboard ansehen">
                        <ExternalLink className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-brand-warm-white rounded-brand text-brand-muted">
                        <MoreVertical className="w-5 h-5" />
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

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
