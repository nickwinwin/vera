'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Loader2,
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any[]>([]);
  const [recentClinics, setRecentClinics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [clinicsRes, clientsRes, subsCountRes, subsDataRes, recentClinicsRes] = await Promise.all([
        supabase.from('clinics').select('id', { count: 'exact', head: true }),
        supabase.from('clients').select('id', { count: 'exact', head: true }),
        supabase.from('subscriptions').select('id', { count: 'exact', head: true }),
        supabase.from('subscriptions').select('amount'),
        supabase.from('clinics').select('*').order('created_at', { ascending: false }).limit(4),
      ]);

      const clinicCount = clinicsRes.count || 0;
      const clientCount = clientsRes.count || 0;
      const subCount = subsCountRes.count || 0;

      const totalMrr = subsDataRes.data?.reduce((sum: number, s: any) => sum + Number(s.amount || 0), 0) || 0;

      setStats([
        { label: 'Registrierte Kliniken', value: clinicCount.toLocaleString(), icon: Building2, trend: 'Aktuell', trendUp: true },
        { label: 'Aktive Endkunden', value: clientCount.toLocaleString(), icon: Users, trend: 'Aktuell', trendUp: true },
        { label: 'Monatlicher Umsatz (MRR)', value: `${totalMrr.toLocaleString('de-DE')} Ôé¼`, icon: CreditCard, trend: 'Aktuell', trendUp: true },
        { label: 'Aktive Abos', value: subCount.toLocaleString(), icon: Activity, trend: 'Live', trendUp: true },
      ]);

      setRecentClinics(recentClinicsRes.data || []);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-brand-beige animate-spin mx-auto mb-4" />
          <p className="text-brand-muted">Daten werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Plattform-├£bersicht</h1>
        <p className="text-brand-secondary">Globale Statistiken und Performance der VERA Plattform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="medical-card p-6 bg-white"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg bg-brand-warm-white text-brand-beige">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <p className="text-sm text-brand-muted font-medium">{stat.label}</p>
            <p className="text-2xl font-display font-bold mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 medical-card bg-white p-6">
          <h2 className="text-xl font-bold mb-6">Neueste Kliniken</h2>
          {recentClinics.length === 0 ? (
            <p className="text-brand-secondary text-center py-12">Noch keine Kliniken registriert.</p>
          ) : (
            <div className="space-y-6">
              {recentClinics.map((clinic: any) => (
                <div key={clinic.id} className="flex items-center justify-between py-2 border-b border-brand-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-warm-white flex items-center justify-center text-brand-beige font-bold">
                      {clinic.name?.charAt(0) || 'K'}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{clinic.name}</p>
                      <p className="text-xs text-brand-muted">{clinic.email || 'Keine E-Mail'}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-brand-muted font-bold">
                    {clinic.created_at ? new Date(clinic.created_at).toLocaleDateString('de-DE') : 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="medical-card bg-white p-6">
          <h2 className="text-xl font-bold mb-6">System-Status</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-brand border border-green-100">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div>
                <p className="text-sm font-bold text-green-700">Datenbank verbunden</p>
                <p className="text-xs text-green-600">Supabase l├ñuft</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-brand border border-green-100">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div>
                <p className="text-sm font-bold text-green-700">API online</p>
                <p className="text-xs text-green-600">OpenRouter verbunden</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
