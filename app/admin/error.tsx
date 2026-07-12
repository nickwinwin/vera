'use client';

import { AlertCircle } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-brand-warm-white flex flex-col items-center justify-center p-6 text-center">
      <AlertCircle className="w-16 h-16 text-brand-error mb-4" />
      <h1 className="text-2xl font-bold mb-2">Admin-Fehler</h1>
      <p className="text-brand-secondary mb-6">Die Admin-Seite konnte nicht geladen werden.</p>
      <button onClick={reset} className="btn-primary px-6 py-2">
        Erneut versuchen
      </button>
    </div>
  );
}