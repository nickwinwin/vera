'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CONSENT_TEMPLATES, DEMO_EQUIPMENT, DEMO_CLIENTS, DEMO_PROCEDURES } from '@/lib/seed-data';
import { useAuth } from '@/hooks/use-auth';
import { Database, Check, Loader2, AlertCircle } from 'lucide-react';

export function SeedButton() {
  const { user } = useAuth();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSeed = async () => {
    if (!user?.clinicId) {
      setStatus('error');
      setMessage('Keine Klinik-ID gefunden. Bitte logge dich erneut ein.');
      return;
    }

    setStatus('loading');
    try {
      // 0. Check if already seeded
      const { count } = await supabase
        .from('consent_templates')
        .select('id', { count: 'exact', head: true })
        .eq('clinic_id', user.clinicId);
      
      if (count && count > 0) {
        setStatus('error');
        setMessage('Datenbank wurde bereits befüllt.');
        return;
      }

      // 1. Seed Procedures
      const proceduresToInsert = DEMO_PROCEDURES.map(p => ({
        ...p,
        clinic_id: user.clinicId
      }));

      const { error: pError } = await supabase
        .from('procedures')
        .insert(proceduresToInsert);
      
      if (pError) throw pError;

      // 2. Seed Templates
      const templatesToInsert = CONSENT_TEMPLATES.map(t => ({
        ...t,
        clinic_id: user.clinicId
      }));

      const { error: tError } = await supabase
        .from('consent_templates')
        .insert(templatesToInsert);
      
      if (tError) throw tError;

      // 3. Seed Equipment
      const equipmentToInsert = DEMO_EQUIPMENT.map(e => ({
        ...e,
        clinic_id: user.clinicId
      }));

      const { error: eError } = await supabase
        .from('equipment')
        .insert(equipmentToInsert);
      
      if (eError) throw eError;

      // 4. Seed Clients
      const clientsToInsert = DEMO_CLIENTS.map(c => ({
        ...c,
        clinic_id: user.clinicId
      }));

      const { error: cError } = await supabase
        .from('clients')
        .insert(clientsToInsert);
      
      if (cError) throw cError;

      setStatus('success');
      setMessage('Datenbank erfolgreich mit Demo-Daten, Formularen und Behandlungen gefüllt!');
      
      // Refresh page after 2 seconds
      setTimeout(() => window.location.reload(), 2000);
    } catch (error: any) {
      console.error('Seeding error:', error);
      setStatus('error');
      setMessage(error.message || 'Fehler beim Befüllen der Datenbank.');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 text-emerald-600 font-medium bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
        <Check className="w-5 h-5" />
        {message}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleSeed}
        disabled={status === 'loading'}
        className="flex items-center gap-2 bg-brand-beige text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Database className="w-5 h-5" />
        )}
        Demo-Daten & Formulare laden
      </button>
      {status === 'error' && (
        <div className="flex items-center gap-2 text-brand-error text-sm">
          <AlertCircle className="w-4 h-4" />
          {message}
        </div>
      )}
    </div>
  );
}
