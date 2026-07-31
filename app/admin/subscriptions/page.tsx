'use client';

import { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminSubscriptions() {
  const [searchTerm, setSearchTerm] = useState('');

  const subs = [
    { id: 1, clinic: 'Beauty Lounge Berlin', plan: 'Professional', amount: '99,00 €', date: '01.04.2026', status: 'active' },
    { id: 2, clinic: 'Skin Experts Hamburg', plan: 'Enterprise', amount: '199,00 €', date: '15.03.2026', status: 'active' },
    { id: 3, clinic: 'Pure Glow Munich', plan: 'Basic', amount: '49,00 €', date: '20.03.2026', status: 'past_due' },
    { id: 4, clinic: 'Laser Center Cologne', plan: 'Professional', amount: '99,00 €', date: '01.04.2026', status: 'active' },
    { id: 5, clinic: 'Aura Spa Frankfurt', plan: 'Basic', amount: '49,00 €', date: '10.03.2026', status: 'canceled' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold">Abonnements & Zahlungen</h1>
          <p className="text-brand-secondary">Übersicht über alle aktiven Abonnements und Umsätze.</p>
        </div>
        <div className="flex gap-4">
          <div className="medical-card bg-white px-6 py-3 flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-brand-muted uppercase font-bold">Gesamt-MRR</p>
              <p className="text-xl font-display font-bold text-brand-beige">124.500 €</p>
            </div>
            <TrendingUpIcon className="w-8 h-8 text-brand-success/20" />
          </div>
        </div>
      </div>

      <div className="medical-card bg-white overflow-hidden">
        <div className="p-4 border-b border-brand-border flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            <input 
              type="text" 
              placeholder="Klinik suchen..." 
              className="w-full pl-10 pr-4 py-2 bg-brand-warm-white border border-brand-border rounded-brand focus:outline-none focus:border-brand-beige text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="btn-outline py-2 px-4 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4" /> Status
            </button>
            <button className="btn-outline py-2 px-4 text-sm flex items-center gap-2">
              <Download className="w-4 h-4" /> CSV Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-warm-white border-b border-brand-border">
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Klinik</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Betrag</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Nächste Zahlung</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {subs.map((sub) => (
                <tr key={sub.id} className="hover:bg-brand-warm-white/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold">{sub.clinic}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-brand-secondary">{sub.plan}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold">{sub.amount}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-brand-muted">
                      <Clock className="w-3 h-3" /> {sub.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {sub.status === 'active' && <><CheckCircle2 className="w-4 h-4 text-brand-success" /> <span className="text-xs font-medium text-brand-success">Aktiv</span></>}
                      {sub.status === 'past_due' && <><AlertCircle className="w-4 h-4 text-orange-500" /> <span className="text-xs font-medium text-orange-500">Überfällig</span></>}
                      {sub.status === 'canceled' && <><AlertCircle className="w-4 h-4 text-brand-error" /> <span className="text-xs font-medium text-brand-error">Gekündigt</span></>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-bold text-brand-beige hover:underline">Details</button>
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

function TrendingUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
