'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Database, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function AdminSetup() {
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const runMigration = async () => {
    setStatus('running');
    setMessage('');
    try {
      const res = await fetch('/api/admin/setup', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setStatus('done');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.error || 'Migration fehlgeschlagen.');
      }
    } catch {
      setStatus('error');
      setMessage('Netzwerkfehler. Bitte versuchen Sie es erneut.');
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-display font-bold">Datenbank-Setup</h1>
        <p className="text-brand-secondary">Erstellen Sie die fehlenden Datenbank-Tabellen für VERA.</p>
      </div>

      <div className="medical-card bg-white p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-brand-beige/10 flex items-center justify-center text-brand-beige">
            <Database className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Tabellen-Migration</h2>
            <p className="text-sm text-brand-muted">Erstellt: clients, equipment, subscriptions, consent_documents u.w.</p>
          </div>
        </div>

        <div className="bg-brand-warm-white rounded-brand p-4 mb-6 space-y-2">
          <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Folgende Tabellen werden erstellt:</p>
          <div className="grid grid-cols-2 gap-1 text-sm">
            {['clients', 'equipment', 'equipment_documents', 'consent_documents', 'consent_templates', 'devices', 'subscriptions', 'document_types', 'form_templates'].map(t => (
              <div key={t} className="flex items-center gap-2 text-brand-dark">
                <CheckCircle2 className="w-3 h-3 text-brand-beige" />
                {t}
              </div>
            ))}
          </div>
        </div>

        {status === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-brand mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-700">Migration fehlgeschlagen</p>
              <p className="text-xs text-red-600 mt-1">{message}</p>
              <p className="text-xs text-red-500 mt-2">
                Alternative: Öffne <strong>Supabase Dashboard → SQL Editor</strong>, kopiere den Inhalt aus <code>supabase/migration.sql</code> und führe ihn aus.
              </p>
            </div>
          </div>
        )}

        {status === 'done' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-brand mb-6 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-green-700">Migration erfolgreich!</p>
              <p className="text-xs text-green-600 mt-1">{message}</p>
            </div>
          </div>
        )}

        <button
          onClick={runMigration}
          disabled={status === 'running'}
          className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {status === 'running' ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Migration läuft...</>
          ) : status === 'done' ? (
            <><CheckCircle2 className="w-5 h-5" /> Erledigt</>
          ) : (
            <><ArrowRight className="w-5 h-5" /> Migration ausführen</>
          )}
        </button>
      </div>

      <div className="medical-card bg-white p-8">
        <h2 className="text-lg font-bold mb-4">Manuelle Ausführung</h2>
        <p className="text-sm text-brand-secondary mb-4">
          Falls der automatische Button nicht funktioniert:
        </p>
        <ol className="space-y-2 text-sm text-brand-dark list-decimal list-inside">
          <li>Gehe zu <a href="https://supabase.com" target="_blank" className="text-brand-beige font-bold hover:underline">Supabase Dashboard</a> → Dein Projekt → SQL Editor</li>
          <li>Kopiere den Inhalt aus <code className="bg-brand-warm-white px-1 rounded">supabase/migration.sql</code></li>
          <li>F&uuml;ge ihn ein und klicke <strong>&bdquo;Run&ldquo;</strong></li>
        </ol>
        <p className="text-xs text-brand-muted mt-4">
          Voraussetzung: <code className="bg-brand-warm-white px-1 rounded">SUPABASE_MANAGEMENT_TOKEN</code> in .env.local (zu finden unter Settings → API → Manage API Tokens)
        </p>
      </div>
    </div>
  );
}