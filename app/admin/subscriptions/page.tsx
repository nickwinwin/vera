'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  CreditCard,
  Search,
  Filter,
  Download,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
} from 'lucide-react';

export default function AdminSubscriptions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [subs, setSubs] = useState<any[]>([]);
  const [totalMrr, setTotalMrr] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubs();
  }, []);

  const fetchSubs = async () => {
    try {
      const [subsRes, clinicsRes] = await Promise.all([
        supabase.from('subscriptions').select('*'),
        supabase.from('clinics').select('id, name'),
      ]);

      const clinics = clinicsRes.data || [];
      const data = (subsRes.data || []).map((s: any) => {
        const clinic = clinics.find((c: any) => c.id === s.clinic_id);
        return { ...s, clinic_name: clinic?.name || 'Unbekannt' };
      });

      setSubs(data);
      setTotalMrr(data.reduce((sum: number, s: any) => sum + Number(s.amount || 0), 0));
    } catch {
      setSubs([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = subs.filter((s: any) =>
    s.clinic_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold">Abonnements & Zahlungen</h1>
          <p className="text-brand-secondary">Übersicht über alle aktiven Abonnements und Umsätze.</p>
        </div>
        <div className="medical-card bg-white px-6 py-3 flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-brand-muted uppercase font-bold">Gesamt-MRR</p>
            <p className="text-xl font-display font-bold text-brand-beige">{totalMrr.toLocaleString('de-DE')} €</p>
          </div>
          <TrendingUp className="w-8 h-8 text-brand-success/20" />
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
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-beige mb-2" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-brand-secondary">
                    Keine Abonnements vorhanden.
                  </td>
                </tr>
              ) : filtered.map((sub: any) => (
                <tr key={sub.id} className="hover:bg-brand-warm-white/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold">{sub.clinic_name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-brand-secondary capitalize">{sub.plan}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold">{Number(sub.amount).toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-brand-muted">
                      <Clock className="w-3 h-3" /> {sub.next_billing_date ? new Date(sub.next_billing_date).toLocaleDateString('de-DE') : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {sub.status === 'active' && <><CheckCircle2 className="w-4 h-4 text-brand-success" /> <span className="text-xs font-medium text-brand-success">Aktiv</span></>}
                      {sub.status === 'past_due' && <><AlertCircle className="w-4 h-4 text-orange-500" /> <span className="text-xs font-medium text-orange-500">Überfällig</span></>}
                      {sub.status === 'canceled' && <><AlertCircle className="w-4 h-4 text-brand-error" /> <span className="text-xs font-medium text-brand-error">Gekündigt</span></>}
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