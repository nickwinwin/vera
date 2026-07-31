'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Building2,
  Search,
  Filter,
  MoreVertical,
  ExternalLink,
  Loader2,
} from 'lucide-react';

export default function AdminClinics() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clinics, setClinics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      const { data } = await supabase.from('clinics').select('*').order('created_at', { ascending: false });
      setClinics(data || []);
    } catch (err) {
      console.error('Error fetching clinics:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = clinics.filter((c: any) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Klinik-Verwaltung</h1>
        <p className="text-brand-secondary">Verwalten Sie alle registrierten Studios und deren Status.</p>
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
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">E-Mail</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Registriert</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-beige mb-2" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-brand-secondary">
                    {clinics.length === 0 ? 'Keine Kliniken registriert.' : 'Keine Kliniken gefunden.'}
                  </td>
                </tr>
              ) : filtered.map((clinic: any) => (
                <tr key={clinic.id} className="hover:bg-brand-warm-white/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-warm-white flex items-center justify-center text-brand-beige font-bold">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{clinic.name || 'Unbekannt'}</p>
                        <p className="text-xs text-brand-muted">Slug: {clinic.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-brand-secondary">{clinic.email || 'ÔÇö'}</td>
                  <td className="px-6 py-4 text-sm text-brand-secondary">
                    {clinic.created_at ? new Date(clinic.created_at).toLocaleDateString('de-DE') : 'ÔÇö'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-brand-warm-white rounded-brand text-brand-beige">
                      <ExternalLink className="w-5 h-5" />
                    </button>
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
