'use client';

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@/hooks/use-i18n';
import { Shield, FileText, AlertCircle, CheckCircle2, MoreVertical, Upload, Plus, Loader2, Settings, Info, Pencil, X } from 'lucide-react';
import proceduresData from '@/data/procedures.json';
import Link from 'next/link';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

export default function MyEquipment() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDevice, setExpandedDevice] = useState<string | null>(null);

  // Filter out anamnese as it's not a device category
  const categories = proceduresData.filter(p => p.id !== 'anamnese');

  const fetchEquipment = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select(`
          *,
          equipment_documents (
            id,
            status
          )
        `)
        .eq('clinic_id', user!.clinicId);

      if (error) throw error;
      setEquipment(data || []);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.clinicId) {
      fetchEquipment();
    }
  }, [user, fetchEquipment]);

  const getCategoryStatus = (categoryId: string) => {
    const device = equipment.find(e => e.category_id === categoryId || e.type === categoryId);
    if (!device) return 'inactive';
    
    if (device.status === 'maintenance') return 'error';
    const docs = device.equipment_documents || [];
    if (docs.length === 0) return 'warning';
    if (docs.some((d: any) => d.status === 'expired')) return 'error';
    if (docs.some((d: any) => d.status === 'pending')) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-brand-beige animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold">{t('dashboard.my_equipment')}</h1>
          <p className="text-brand-secondary">Ihre aktiven Geräte und deren Compliance-Status.</p>
        </div>
        <Link href="/dashboard/catalog" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Gerät hinzufügen
        </Link>
      </div>

      {equipment.length === 0 ? (
        <div className="medical-card p-12 text-center bg-white">
          <Shield className="w-16 h-16 text-brand-beige/20 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Noch keine Geräte hinzugefügt</h3>
          <p className="text-brand-muted mb-8 max-w-md mx-auto">Fügen Sie Ihre ersten NiSV-relevanten Geräte aus unserem Katalog hinzu, um mit der Dokumentation zu beginnen.</p>
          <Link href="/dashboard/catalog" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" /> Zum Katalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipment.map((device, i) => {
            const category = proceduresData.find(p => p.id === device.type);
            const status = getCategoryStatus(device.type);
            
            return (
              <motion.div 
                key={device.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-border/50 flex flex-col h-full"
              >
                {/* Top Section: Visual Shield & Category Badge */}
                <div className="bg-brand-warm-white/50 p-8 flex flex-col items-center justify-center relative min-h-[180px]">
                  <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-brand-border/30">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                      {device.type?.replace('_', ' ') || 'GERÄT'}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center">
                  <Shield className={`w-20 h-20 transition-all duration-700 ${status === 'inactive' ? 'text-brand-muted/20' : 'text-brand-beige/40'}`} />
                </div>

              {/* Bottom Section: Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-1">
                    {category?.name || device.type || 'Unbekannte Kategorie'}
                  </p>
                  <h3 className="text-2xl font-display font-bold text-brand-dark leading-tight">
                    {device.name}
                  </h3>
                </div>

                  <div className="space-y-3 mb-6 flex-1">
                    <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Erforderliche Dokumente:</p>
                    <div className="flex flex-wrap gap-2">
                      {['Bedienungsanleitung', 'Fachkunde'].map((doc) => (
                        <span key={doc} className="px-3 py-1 bg-brand-warm-white text-brand-secondary text-[10px] font-medium rounded-md border border-brand-border/30">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-brand-warm-white">
                    <button
                      onClick={() => setExpandedDevice(expandedDevice === device.id ? null : device.id)}
                      className="btn-outline w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2"
                    >
                      {expandedDevice === device.id ? <X className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                      Details
                    </button>
                    <Link
                      href={`/dashboard/equipment/${device.id}`}
                      className="block w-full py-2.5 text-xs font-bold text-center rounded-brand bg-brand-beige/10 text-brand-beige border border-brand-beige/20 hover:bg-brand-beige hover:text-white transition-all"
                    >
                      Verwalten
                    </Link>
                  </div>

                  {expandedDevice === device.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border-t border-brand-border/40 bg-brand-warm-white/30 mt-4 rounded-brand overflow-hidden"
                    >
                      <div className="p-4 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted">Geräte-Info</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-brand-secondary">Seriennummer</span>
                            <span className="text-brand-muted">Nicht angegeben</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-brand-secondary">Status</span>
                            <span className="font-medium text-brand-success">Aktiv</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-brand-secondary">Nächste Wartung</span>
                            <span className="text-brand-muted">Nicht geplant</span>
                          </div>
                        </div>
                        <Link
                          href={`/dashboard/equipment/${device.id}`}
                          className="flex items-center justify-center gap-2 text-xs font-bold text-brand-beige hover:underline pt-2"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Gerätedaten bearbeiten
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
