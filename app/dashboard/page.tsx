'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/hooks/use-i18n';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  ShieldCheck, 
  QrCode, 
  TrendingUp, 
  AlertCircle,
  ArrowUpRight,
  Clock,
  FileText,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import { SeedButton } from '@/components/seed-button';
import Link from 'next/link';

export default function DashboardOverview() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [statsData, setStatsData] = useState({
    clients: 0,
    documents: 0,
    equipment: 0,
    templates: 0
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState<any[]>([]);
  const [pendingParameters, setPendingParameters] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.clinicId) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [clientsRes, docsRes, equipRes, templatesRes, recentRes, maintenanceRes, equipDocsRes, pendingParamsRes] = await Promise.all([
        supabase.from('clients').select('id', { count: 'exact', head: true }).eq('clinic_id', user!.clinicId),
        supabase.from('consent_documents').select('id', { count: 'exact', head: true }).eq('clinic_id', user!.clinicId),
        supabase.from('equipment').select('id', { count: 'exact', head: true }).eq('clinic_id', user!.clinicId),
        supabase.from('consent_templates').select('id', { count: 'exact', head: true }).eq('clinic_id', user!.clinicId),
        supabase.from('consent_documents')
          .select(`
            id, 
            procedure_name, 
            signed_at, 
            clients (
              first_name, 
              last_name
            )
          `)
          .eq('clinic_id', user!.clinicId)
          .order('signed_at', { ascending: false })
          .limit(5),
        supabase.from('equipment')
          .select('*')
          .eq('clinic_id', user!.clinicId)
          .or('status.eq.maintenance,next_maintenance.lt.now()')
          .limit(3),
        supabase.from('equipment')
          .select(`
            id,
            name,
            equipment_documents (
              id
            )
          `)
          .eq('clinic_id', user!.clinicId),
        supabase.from('consent_documents')
          .select('id, treatment_details')
          .eq('clinic_id', user!.clinicId)
          .not('procedure_name', 'eq', 'Allgemeiner Anamnesebogen')
      ]);

      setStatsData({
        clients: clientsRes.count || 0,
        documents: docsRes.count || 0,
        equipment: equipRes.count || 0,
        templates: templatesRes.count || 0
      });

      setRecentActivities(recentRes.data || []);
      
      // Calculate pending parameters manually to ensure accuracy with JSONB
      const pending = pendingParamsRes.data?.filter((doc: any) => 
        !doc.treatment_details?.energy || doc.treatment_details.energy === ''
      ).length || 0;
      
      setPendingParameters(pending);
      
      // Combine maintenance alerts with missing document alerts
      const alerts = [...(maintenanceRes.data || [])];
      
      // Check for missing documents (less than 3)
      if (equipDocsRes.data) {
        equipDocsRes.data.forEach(equip => {
          if ((equip.equipment_documents?.length || 0) < 3) {
            // Only add if not already in alerts
            if (!alerts.some(a => a.id === equip.id)) {
              alerts.push({
                ...equip,
                alertType: 'missing_docs',
                message: 'Dokumente fehlen'
              });
            }
          }
        });
      }

      setMaintenanceAlerts(alerts.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: t('dashboard.total_clients'), value: statsData.clients.toString(), icon: Users, trend: '+0%', color: 'text-brand-beige' },
    { label: 'Einwilligungen', value: statsData.documents.toString(), icon: FileText, trend: '+0%', color: 'text-brand-success' },
    { label: 'Aktive Formulare', value: statsData.templates.toString(), icon: QrCode, trend: '0', color: 'text-brand-secondary' },
    { label: 'Geräte Aktiv', value: statsData.equipment.toString(), icon: Activity, trend: '0', color: 'text-brand-success' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-display font-bold">Willkommen, {user?.name}</h1>
          <p className="text-brand-secondary">Hier ist die Übersicht für Ihr Studio heute.</p>
        </div>
        <SeedButton />
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
              <div className={`p-3 rounded-lg bg-brand-warm-white ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-100 text-green-700' : stat.trend === '0' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-700'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-sm text-brand-muted font-medium">{stat.label}</p>
            <p className="text-2xl font-display font-bold mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 medical-card bg-white p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Letzte Aktivitäten</h2>
            <button className="text-sm text-brand-beige font-bold hover:underline">Alle sehen</button>
          </div>
          <div className="space-y-6">
            {recentActivities.length === 0 ? (
              <p className="text-sm text-brand-secondary text-center py-8">Keine aktuellen Aktivitäten.</p>
            ) : recentActivities.map((activity, i) => (
              <div key={activity.id} className="flex items-center justify-between py-2 border-b border-brand-border last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-warm-white flex items-center justify-center text-brand-beige font-bold">
                    {activity.clients?.first_name?.charAt(0) || 'K'}
                  </div>
                  <div>
                    <p className="text-sm font-bold">
                      {activity.clients?.first_name} {activity.clients?.last_name}
                    </p>
                    <p className="text-xs text-brand-muted">
                      Unterschrieb Einwilligung • <span className="italic">{activity.procedure_name}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-brand-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(activity.signed_at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Alert */}
        <div className="space-y-6">
          <div className={`medical-card bg-white p-6 border-l-4 ${maintenanceAlerts.length > 0 ? 'border-l-brand-error' : 'border-l-brand-success'}`}>
            <div className={`flex items-center gap-2 mb-4 ${maintenanceAlerts.length > 0 ? 'text-brand-error' : 'text-brand-success'}`}>
              {maintenanceAlerts.length > 0 ? <AlertCircle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              <h2 className="text-lg font-bold">Compliance-Hinweise</h2>
            </div>
            <p className="text-sm text-brand-secondary mb-6">Folgende Dokumente laufen in Kürze ab oder fehlen:</p>
            <div className="space-y-4">
              {maintenanceAlerts.length === 0 ? (
                <div className="p-4 bg-green-50 rounded-brand border border-green-100">
                  <p className="text-sm font-bold text-green-700">Alles in Ordnung</p>
                  <p className="text-xs text-green-600 mt-1">Keine anstehenden Wartungen oder Compliance-Lücken.</p>
                </div>
              ) : maintenanceAlerts.map((alert) => (
                <div key={alert.id} className="p-4 bg-red-50 rounded-brand border border-red-100">
                  <p className="text-sm font-bold text-brand-error">{alert.name}</p>
                  <p className="text-xs text-red-600 mt-1">
                    {alert.alertType === 'missing_docs' 
                      ? 'Compliance-Dokumente fehlen' 
                      : alert.status === 'maintenance' 
                        ? 'Wartung erforderlich' 
                        : `Nächste Wartung: ${new Date(alert.next_maintenance).toLocaleDateString('de-DE')}`}
                  </p>
                  <Link 
                    href={`/dashboard/equipment/${alert.id}`}
                    className="mt-3 text-xs font-bold bg-brand-error text-white px-3 py-1 rounded-brand inline-block"
                  >
                    Details
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Procedure Parameters Alert */}
          <div className={`medical-card bg-white p-6 border-l-4 ${pendingParameters > 0 ? 'border-l-amber-500' : 'border-l-brand-success'}`}>
            <div className={`flex items-center gap-2 mb-4 ${pendingParameters > 0 ? 'text-amber-600' : 'text-brand-success'}`}>
              {pendingParameters > 0 ? <Clock className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              <h2 className="text-lg font-bold">Behandlungs-Parameter</h2>
            </div>
            
            {pendingParameters > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-brand-secondary">
                  Sie haben <span className="font-bold text-brand-dark">{pendingParameters}</span> Behandlungen ohne erfasste Parameter im Backlog.
                </p>
                <div className="p-4 bg-amber-50 rounded-brand border border-amber-100">
                  <p className="text-xs text-amber-700 leading-relaxed">
                    NiSV-Hinweis: Die Dokumentation der Behandlungsparameter (Energie, Frequenz, etc.) ist gesetzlich vorgeschrieben.
                  </p>
                  <Link 
                    href="/dashboard/procedures/logs"
                    className="mt-3 text-xs font-bold bg-amber-500 text-white px-3 py-1 rounded-brand inline-block hover:bg-amber-600 transition-colors"
                  >
                    Jetzt nachpflegen
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-green-50 rounded-brand border border-green-100">
                <p className="text-sm font-bold text-green-700">Vollständig dokumentiert</p>
                <p className="text-xs text-green-600 mt-1">Alle durchgeführten Behandlungen sind NiSV-konform erfasst.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
