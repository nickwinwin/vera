'use client';

import { 
  Building2, 
  Users, 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Calendar
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Registrierte Kliniken', value: '1,248', icon: Building2, trend: '+12%', trendUp: true },
    { label: 'Aktive Endkunden', value: '45,892', icon: Users, trend: '+8%', trendUp: true },
    { label: 'Monatlicher Umsatz (MRR)', value: '124.500 €', icon: CreditCard, trend: '+15%', trendUp: true },
    { label: 'Churn Rate', value: '1.2%', icon: Activity, trend: '-0.4%', trendUp: true },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Plattform-Übersicht</h1>
        <p className="text-brand-secondary">Globale Statistiken und Performance der VERA Plattform.</p>
      </div>

      {/* Stats Grid */}
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
        {/* New Signups Chart Mock */}
        <div className="lg:col-span-2 medical-card bg-white p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">Neuanmeldungen (30 Tage)</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-bold bg-brand-beige text-white rounded">Kliniken</button>
              <button className="px-3 py-1 text-xs font-bold bg-brand-warm-white text-brand-muted rounded">Endkunden</button>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {[45, 60, 55, 70, 85, 65, 90, 110, 95, 120, 105, 130].map((val, i) => (
              <div key={i} className="flex-1 bg-brand-beige/20 rounded-t relative group">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-brand-beige rounded-t transition-all group-hover:bg-brand-dark" 
                  style={{ height: `${val}%` }} 
                />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-dark text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {val}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-brand-muted font-bold uppercase tracking-widest">
            <span>Feb 01</span>
            <span>Feb 15</span>
            <span>Mär 01</span>
          </div>
        </div>

        {/* Recent Clinics */}
        <div className="medical-card bg-white p-6">
          <h2 className="text-xl font-bold mb-6">Neue Kliniken</h2>
          <div className="space-y-6">
            {[
              { name: "Glow & Flow", owner: "Sarah Kern", plan: "Pro", date: "Heute" },
              { name: "Skin Experts", owner: "Dr. Thomas Wolf", plan: "Enterprise", date: "Gestern" },
              { name: "Pure Beauty", owner: "Elena Fischer", plan: "Basic", date: "Vor 2 Tagen" },
              { name: "Laser Center", owner: "Marc Weber", plan: "Pro", date: "Vor 3 Tagen" }
            ].map((clinic, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-brand-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-warm-white flex items-center justify-center text-brand-beige font-bold">
                    {clinic.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{clinic.name}</p>
                    <p className="text-xs text-brand-muted">{clinic.owner} • <span className="text-brand-beige font-bold">{clinic.plan}</span></p>
                  </div>
                </div>
                <p className="text-[10px] text-brand-muted font-bold">{clinic.date}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 btn-outline py-2 text-sm">Alle Kliniken verwalten</button>
        </div>
      </div>
    </div>
  );
}
