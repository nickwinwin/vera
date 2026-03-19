'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/hooks/use-i18n';
import { Shield, FileText, AlertCircle, CheckCircle2, MoreVertical, Upload, Plus, Loader2 } from 'lucide-react';
import equipmentData from '@/data/equipment.json';
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

  useEffect(() => {
    if (user?.clinicId) {
      fetchEquipment();
    }
  }, [user]);

  const fetchEquipment = async () => {
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
        .eq('clinic_id', user!.clinicId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEquipment(data || []);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (device: any) => {
    if (device.status === 'maintenance') return 'error';
    const docs = device.equipment_documents || [];
    if (docs.length === 0) return 'error';
    if (docs.some((d: any) => d.status === 'expired')) return 'error';
    if (docs.some((d: any) => d.status === 'pending')) return 'warning';
    return 'success';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Gerät wirklich entfernen?')) return;
    
    try {
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Gerät entfernt');
      fetchEquipment();
    } catch (error) {
      console.error('Error deleting equipment:', error);
      toast.error('Fehler beim Löschen');
    }
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
          <p className="text-brand-secondary">Verwalten Sie die Compliance-Dokumente Ihrer Geräte.</p>
        </div>
        <Link href="/dashboard/catalog" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Gerät hinzufügen
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {equipment.length === 0 ? (
          <div className="medical-card bg-white p-12 text-center">
            <Shield className="w-12 h-12 text-brand-border mx-auto mb-4" />
            <p className="text-brand-secondary">Noch keine Geräte hinzugefügt.</p>
            <Link href="/dashboard/catalog" className="text-brand-beige font-bold hover:underline mt-2 inline-block">
              Zum Katalog gehen
            </Link>
          </div>
        ) : equipment.map((device, i) => {
          const status = getStatus(device);
          const docsCount = device.equipment_documents?.length || 0;
          
          return (
            <motion.div 
              key={device.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="medical-card bg-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-brand-warm-white rounded-lg flex items-center justify-center text-brand-beige">
                  <Shield className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{device.name}</h3>
                  <p className="text-sm text-brand-muted">{device.type} • S/N: {device.serial_number || 'Nicht angegeben'}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-8">
                <div className="text-center">
                  <p className="text-xs text-brand-muted uppercase font-bold mb-1">Dokumente</p>
                  <p className="text-lg font-bold">{docsCount}</p>
                </div>

                <div className="text-center">
                  <p className="text-xs text-brand-muted uppercase font-bold mb-1">Status</p>
                  <div className="flex items-center gap-1">
                    {status === 'success' && <><CheckCircle2 className="w-4 h-4 text-brand-success" /> <span className="text-sm font-medium text-brand-success">Konform</span></>}
                    {status === 'warning' && <><AlertCircle className="w-4 h-4 text-orange-500" /> <span className="text-sm font-medium text-orange-500">Aktion nötig</span></>}
                    {status === 'error' && <><AlertCircle className="w-4 h-4 text-brand-error" /> <span className="text-sm font-medium text-brand-error">Kritisch</span></>}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/dashboard/equipment/${device.id}`} className="btn-outline py-2 px-4 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Dokumente
                  </Link>
                  <button 
                    onClick={() => handleDelete(device.id)}
                    className="p-2 hover:bg-red-50 rounded-brand text-brand-error"
                    title="Gerät löschen"
                  >
                    <AlertCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
