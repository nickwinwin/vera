'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Database, CheckCircle2, Loader2, ArrowRight, BookOpen } from 'lucide-react';

export default function AdminSetup() {
  const [showGuide, setShowGuide] = useState<string | null>(null);

  const guides: Record<string, { title: string; steps: string[] }> = {
    clinics: {
      title: 'Kliniken verwalten',
      steps: [
        'Gehe zu „Kliniken" in der Admin-Navigation.',
        'Hier siehst du alle registrierten Studios mit Name, E-Mail und Registrierungsdatum.',
        'Klicke auf das „Externer Link"-Symbol neben einer Klinik, um deren öffentliches Portal zu öffnen.',
        'Eine Klinik kann aktuell nur direkt in der Supabase-Datenbank gelöscht oder bearbeitet werden.',
      ],
    },
    equipment: {
      title: 'Gerätekatalog verwalten',
      steps: [
        'Gehe zu „Gerätekatalog" in der Admin-Navigation.',
        'Der Katalog enthält alle NiSV-relevanten Geräte, die Studios zu ihrem Inventar hinzufügen können.',
        'Klicke auf das Stift-Icon, um ein Gerät zu bearbeiten (Name, Hersteller, Kategorie, erforderliche Dokumente).',
        'Klicke auf das Mülleimer-Icon, um ein Gerät zu löschen.',
        'Klicke auf „Neues Gerät anlegen", um ein neues Gerät zum Katalog hinzuzufügen.',
      ],
    },
    documents: {
      title: 'Dokumententypen verwalten',
      steps: [
        'Gehe zu „Dokumententypen" in der Admin-Navigation.',
        'Hier definierst du, welche Dokumente für welche Gerätekategorien erforderlich sind.',
        'Klicke auf das Stift-Icon, um Namen, Kategorie oder Zuordnung zu ändern.',
        'Klicke auf das Mülleimer-Icon, um einen Dokumententyp zu entfernen.',
        'Klicke auf „Neuen Typ anlegen", um einen neuen Dokumententyp zu erstellen.',
      ],
    },
    forms: {
      title: 'Formular-Templates verwalten',
      steps: [
        'Gehe zu „Formular-Templates" in der Admin-Navigation.',
        'Hier siehst du alle Vorlagen für Einwilligungserklärungen und Anamnesebögen.',
        'Klicke auf das Augen-Icon, um eine Vorschau des Templates zu sehen.',
        'Klicke auf das Stift-Icon, um Inhalt, Version oder Status zu bearbeiten.',
        'Klicke auf das Kopieren-Icon, um ein Template zu duplizieren.',
        'Klicke auf „Neues Template", um eine neue Vorlage zu erstellen.',
      ],
    },
    subscriptions: {
      title: 'Abonnements & Zahlungen',
      steps: [
        'Gehe zu „Abonnements" in der Admin-Navigation.',
        'Hier siehst du alle aktiven Abos, den MRR und den Status jeder Klinik.',
        'Der Gesamt-MRR wird automatisch aus allen aktiven Abos berechnet.',
        'Klicke auf „Status", um nach aktiven, überfälligen oder gekündigten Abos zu filtern.',
        'Klicke auf „CSV Export", um alle Abos als CSV herunterzuladen.',
      ],
    },
    overview: {
      title: 'Plattform-Übersicht',
      steps: [
        'Die Startseite zeigt dir die wichtigsten Kennzahlen auf einen Blick.',
        'Anzahl Kliniken, Kunden, MRR und aktive Abos – live aus der Datenbank.',
        'Die Liste der neuesten Kliniken zeigt die aktuellsten Registrierungen.',
        'Der System-Status zeigt, ob Datenbank und KI-Verbindung online sind.',
      ],
    },
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-display font-bold">Admin-Handbuch</h1>
        <p className="text-brand-secondary">So bedienst du das VERA Admin-Dashboard – Bereich für Bereich.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(guides).map(([key, guide]) => (
          <motion.button
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setShowGuide(showGuide === key ? null : key)}
            className={`text-left p-6 rounded-2xl border-2 transition-all ${
              showGuide === key
                ? 'border-brand-beige bg-brand-beige/5 shadow-lg'
                : 'border-brand-border bg-white hover:border-brand-beige/40 hover:shadow-md'
            }`}
          >
            <h3 className="text-lg font-bold text-brand-dark">{guide.title}</h3>
            <p className="text-sm text-brand-secondary mt-1">{(guide as any).subtitle || `${guide.steps.length} Schritte`}</p>
          </motion.button>
        ))}
      </div>

      {showGuide && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="medical-card bg-white p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-brand-beige" />
            <h2 className="text-2xl font-display font-bold">{guides[showGuide].title}</h2>
          </div>
          <ol className="space-y-4">
            {guides[showGuide].steps.map((step, i) => (
              <li key={i} className="flex gap-4 text-sm text-brand-dark leading-relaxed">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-beige text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </motion.div>
      )}
    </div>
  );
}